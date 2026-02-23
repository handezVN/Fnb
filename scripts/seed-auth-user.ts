/**
 * Seed one admin user for testing auth.
 * Run: npx ts-node scripts/seed-auth-user.ts
 * Default: email admin@example.com, password admin123
 */
import bcrypt from 'bcryptjs';
import pool from '../src/config/database';
import { USERS_TABLE } from '../src/models/User';
import { Role } from '../src/models/types';

const EMAIL = 'admin@example.com';
const PASSWORD = 'admin123';
const FULL_NAME = 'Admin User';

async function seed() {
  const password_hash = await bcrypt.hash(PASSWORD, 10);
  await pool.query(
    `INSERT INTO ${USERS_TABLE} (email, password_hash, full_name, role, status)
     VALUES ($1, $2, $3, $4, 'active')
     ON CONFLICT (email) DO UPDATE SET password_hash = $2, updated_at = NOW()`,
    [EMAIL, password_hash, FULL_NAME, Role.BRAND_ADMIN]
  );
  console.log('Seeded auth user:', EMAIL, '/', PASSWORD);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
