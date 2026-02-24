import pool from '../src/config/database';
import { readFileSync } from 'fs';
import { join } from 'path';

async function migrate() {
  const sql = readFileSync(join(__dirname, '../src/migrations/002_product_images.sql'), 'utf-8');
  await pool.query(sql);
  console.log('Migration 002_product_images.sql applied.');
  process.exit(0);
}

migrate().catch((err) => {
  if (err.code === '42P07' || err.message?.includes('already exists')) {
    console.log('Table already exists, skipping.');
    process.exit(0);
    return;
  }
  console.error('Migration failed:', err.message);
  process.exit(1);
});
