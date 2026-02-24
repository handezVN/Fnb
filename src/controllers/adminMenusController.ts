import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import {
  MENUS_TABLE,
  Menu,
  MenuCreateInput,
  MenuUpdateInput,
} from '../models/Menu';

export async function listMenus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.query.store_id as string | undefined;
    if (storeId) {
      const result = await pool.query<Menu>(
        `SELECT * FROM ${MENUS_TABLE} WHERE store_id = $1 ORDER BY created_at DESC`,
        [storeId]
      );
      res.json(result.rows);
      return;
    }
    const result = await pool.query<Menu>(
      `SELECT * FROM ${MENUS_TABLE} ORDER BY store_id, created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('listMenus:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getMenu(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await pool.query<Menu>(`SELECT * FROM ${MENUS_TABLE} WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Menu not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getMenu:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createMenu(req: AuthRequest, res: Response): Promise<void> {
  try {
    const body = req.body as MenuCreateInput;
    if (!body.store_id || !body.name) {
      res.status(400).json({ error: 'store_id and name are required' });
      return;
    }
    const result = await pool.query<Menu>(
      `INSERT INTO ${MENUS_TABLE} (store_id, name, is_active)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [body.store_id, body.name, body.is_active ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === '23503') {
      res.status(400).json({ error: 'store_id not found' });
      return;
    }
    console.error('createMenu:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateMenu(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const body = req.body as MenuUpdateInput;
    const result = await pool.query<Menu>(
      `UPDATE ${MENUS_TABLE}
       SET name = COALESCE($2, name), is_active = COALESCE($3, is_active), updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, body.name, body.is_active]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Menu not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('updateMenu:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
