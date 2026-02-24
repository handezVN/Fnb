/**
 * Run all migrations.
 * Run once after DB is up: npm run migrate
 */
import pool from '../src/config/database';
import { readFileSync } from 'fs';
import { join } from 'path';

const migrations = ['001_initial_schema.sql', '002_product_images.sql'];

async function migrate() {
  for (const name of migrations) {
    try {
      const sql = readFileSync(join(__dirname, '../src/migrations', name), 'utf-8');
      await pool.query(sql);
      console.log(`Migration ${name} applied.`);
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e.code === '42P07' || e.message?.includes('already exists')) {
        console.log(`Migration ${name}: already exists, skipping.`);
      } else {
        throw err;
      }
    }
  }
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', (err as Error).message);
  process.exit(1);
});
