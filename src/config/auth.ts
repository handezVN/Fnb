/**
 * Auth config: JWT secret & expiry.
 * Set JWT_SECRET in .env (required in production).
 */
export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
