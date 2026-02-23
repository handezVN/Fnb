/**
 * Run initial schema migration.
 * Run once after DB is up: npx ts-node scripts/migrate.ts
 */
import pool from '../src/config/database';
import { readFileSync } from 'fs';
import { join } from 'path';

const migrationPath = join(__dirname, '../src/migrations/001_initial_schema.sql');

async function migrate() {
  const sql = readFileSync(migrationPath, 'utf-8');
  await pool.query(sql);
  console.log('Migration 001_initial_schema.sql applied.');
  process.exit(0);
}

migrate().catch((err) => {
  if (err.code === '42P07' || err.message?.includes('already exists')) {
    console.log('Tables/types already exist, skipping.');
    process.exit(0);
    return;
  }
  console.error('Migration failed:', err.message);
  process.exit(1);
});
