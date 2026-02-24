import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import {
  CATEGORIES_TABLE,
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
} from '../models/Category';

export async function listCategories(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const result = await pool.query<Category>(
      `SELECT * FROM ${CATEGORIES_TABLE} ORDER BY menu_id, sort_order, created_at`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('listCategories:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getCategory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await pool.query<Category>(`SELECT * FROM ${CATEGORIES_TABLE} WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getCategory:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createCategory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const body = req.body as CategoryCreateInput;
    if (!body.menu_id || !body.name) {
      res.status(400).json({ error: 'menu_id and name are required' });
      return;
    }
    const result = await pool.query<Category>(
      `INSERT INTO ${CATEGORIES_TABLE} (menu_id, name, sort_order)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [body.menu_id, body.name, body.sort_order ?? 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === '23503') {
      res.status(400).json({ error: 'menu_id not found' });
      return;
    }
    console.error('createCategory:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateCategory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const body = req.body as CategoryUpdateInput;
    const result = await pool.query<Category>(
      `UPDATE ${CATEGORIES_TABLE}
       SET name = COALESCE($2, name), sort_order = COALESCE($3, sort_order), updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, body.name, body.sort_order]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('updateCategory:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
