import { Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { USERS_TABLE, User, UserCreateInput, UserUpdateInput } from '../models/User';
import { UserStatus } from '../models/types';

function toPublicUser(u: User) {
  const { password_hash: _, ...rest } = u;
  return rest;
}

export async function listUsers(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const result = await pool.query<User>(
      `SELECT * FROM ${USERS_TABLE} ORDER BY created_at DESC`
    );
    res.json(result.rows.map(toPublicUser));
  } catch (err) {
    console.error('listUsers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getUser(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await pool.query<User>(`SELECT * FROM ${USERS_TABLE} WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(toPublicUser(result.rows[0]));
  } catch (err) {
    console.error('getUser:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createUser(req: AuthRequest, res: Response): Promise<void> {
  try {
    const body = req.body as UserCreateInput & { password?: string };
    if (!body.email || !body.full_name || !body.role) {
      res.status(400).json({ error: 'email, full_name and role are required' });
      return;
    }
    const rawPassword = body.password ?? 'changeme';
    const password_hash = await bcrypt.hash(rawPassword, 10);
    const result = await pool.query<User>(
      `INSERT INTO ${USERS_TABLE} (email, password_hash, full_name, phone, role, store_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        body.email.trim().toLowerCase(),
        password_hash,
        body.full_name,
        body.phone ?? null,
        body.role,
        body.store_id ?? null,
        body.status ?? UserStatus.ACTIVE,
      ]
    );
    res.status(201).json(toPublicUser(result.rows[0]));
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === '23505') {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }
    console.error('createUser:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateUser(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const body = req.body as UserUpdateInput & { password?: string };
    const updates: string[] = [];
    const values: unknown[] = [id];
    let idx = 2;
    if (body.full_name !== undefined) {
      updates.push(`full_name = $${idx++}`);
      values.push(body.full_name);
    }
    if (body.phone !== undefined) {
      updates.push(`phone = $${idx++}`);
      values.push(body.phone);
    }
    if (body.role !== undefined) {
      updates.push(`role = $${idx++}`);
      values.push(body.role);
    }
    if (body.store_id !== undefined) {
      updates.push(`store_id = $${idx++}`);
      values.push(body.store_id);
    }
    if (body.status !== undefined) {
      updates.push(`status = $${idx++}`);
      values.push(body.status);
    }
    if (body.password_hash !== undefined) {
      updates.push(`password_hash = $${idx++}`);
      values.push(body.password_hash);
    }
    if (typeof body.password === 'string' && body.password) {
      const hash = await bcrypt.hash(body.password, 10);
      updates.push(`password_hash = $${idx++}`);
      values.push(hash);
    }
    if (updates.length === 0) {
      const r = await pool.query<User>(`SELECT * FROM ${USERS_TABLE} WHERE id = $1`, [id]);
      if (r.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(toPublicUser(r.rows[0]));
      return;
    }
    updates.push('updated_at = NOW()');
    const result = await pool.query<User>(
      `UPDATE ${USERS_TABLE} SET ${updates.join(', ')} WHERE id = $1 RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(toPublicUser(result.rows[0]));
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === '23505') res.status(400).json({ error: 'Email already exists' });
    else {
      console.error('updateUser:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export async function patchUserStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const { status } = req.body as { status?: UserStatus };
    if (!status || !Object.values(UserStatus).includes(status)) {
      res.status(400).json({ error: 'status must be one of: active, disabled' });
      return;
    }
    const result = await pool.query<User>(
      `UPDATE ${USERS_TABLE} SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, status]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(toPublicUser(result.rows[0]));
  } catch (err) {
    console.error('patchUserStatus:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
