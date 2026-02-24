import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';
import { Role } from '../models/types';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  store_id: string | null;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * Verify JWT from Authorization: Bearer <token> and attach user to req.user.
 */
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

const ADMIN_ROLES: Role[] = [Role.SUPER_ADMIN, Role.BRAND_ADMIN];

/**
 * Require admin role (SUPER_ADMIN or BRAND_ADMIN). Use after requireAuth.
 */
export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (!ADMIN_ROLES.includes(req.user.role)) {
    res.status(403).json({ error: 'Forbidden: admin role required' });
    return;
  }
  next();
}

const STORE_ROLES: Role[] = [Role.STORE_MANAGER, Role.STAFF];

/**
 * Require store account (STORE_MANAGER or STAFF with store_id). Use after requireAuth.
 * Dùng cho API của từng store: user chỉ truy cập được data của store mình.
 */
export function requireStoreAccount(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (!STORE_ROLES.includes(req.user.role) || !req.user.store_id) {
    res.status(403).json({ error: 'Forbidden: store account required (must have store assigned)' });
    return;
  }
  next();
}
