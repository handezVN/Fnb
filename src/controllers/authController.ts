import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { authConfig } from '../config/auth';
import { AuthRequest, JwtPayload } from '../middleware/auth';
import { USERS_TABLE } from '../models/User';
import { User } from '../models/User';
import { UserStatus } from '../models/types';

/** User object returned in API (no password) */
export interface AuthUserResponse {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: string;
  store_id: string | null;
  status: string;
}

function toAuthUser(row: User): AuthUserResponse {
  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    phone: row.phone,
    role: row.role,
    store_id: row.store_id,
    status: row.status,
  };
}

/**
 * POST /auth/login
 * Body: { email, password }
 * Response: { access_token, user }
 */
export async function login(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await pool.query<User>(
      `SELECT * FROM ${USERS_TABLE} WHERE email = $1 LIMIT 1`,
      [email.trim().toLowerCase()]
    );
    const user = result.rows[0];
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    if (user.status !== UserStatus.ACTIVE) {
      res.status(403).json({ error: 'Account is disabled' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      store_id: user.store_id,
    };
    const access_token = jwt.sign(payload, authConfig.jwtSecret, {
      expiresIn: authConfig.jwtExpiresIn,
    } as jwt.SignOptions);

    res.status(200).json({
      access_token,
      user: toAuthUser(user),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /auth/logout
 * Client should discard token; optional server-side blacklist can be added later.
 */
export async function logout(_req: AuthRequest, res: Response): Promise<void> {
  res.status(200).json({ message: 'Logged out successfully' });
}

/**
 * GET /auth/me
 * Returns current user info + role. Requires Authorization: Bearer <token>.
 */
export async function me(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const result = await pool.query<User>(
      `SELECT * FROM ${USERS_TABLE} WHERE id = $1 LIMIT 1`,
      [req.user.sub]
    );
    const user = result.rows[0];
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(toAuthUser(user));
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
