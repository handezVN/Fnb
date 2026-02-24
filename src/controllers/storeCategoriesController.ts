import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { CATEGORIES_TABLE } from '../models/Category';
import { MENUS_TABLE } from '../models/Menu';
import type { Category } from '../models/Category';

/**
 * GET /store/categories - Danh sách categories thuộc menus của store user.
 */
export async function listMyStoreCategories(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const result = await pool.query<Category>(
      `SELECT c.* FROM ${CATEGORIES_TABLE} c
       JOIN ${MENUS_TABLE} m ON m.id = c.menu_id AND m.store_id = $1
       ORDER BY c.menu_id, c.sort_order, c.created_at`,
      [storeId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('listMyStoreCategories:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /store/categories/:id - Lấy 1 category (chỉ khi thuộc store của user).
 */
export async function getMyStoreCategory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const id = req.params.id;
    const result = await pool.query<Category>(
      `SELECT c.* FROM ${CATEGORIES_TABLE} c
       JOIN ${MENUS_TABLE} m ON m.id = c.menu_id AND m.store_id = $1
       WHERE c.id = $2`,
      [storeId, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getMyStoreCategory:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /store/categories - Tạo category (menu_id phải thuộc store của user).
 */
export async function createMyStoreCategory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const { menu_id, name, sort_order } = req.body ?? {};
    if (!menu_id || !name) {
      res.status(400).json({ error: 'menu_id and name are required' });
      return;
    }
    const result = await pool.query<Category>(
      `INSERT INTO ${CATEGORIES_TABLE} (menu_id, name, sort_order)
       SELECT $1, $2, $3
       FROM ${MENUS_TABLE} m WHERE m.id = $1 AND m.store_id = $4
       RETURNING *`,
      [menu_id, name, sort_order ?? 0, storeId]
    );
    if (result.rows.length === 0) {
      res.status(400).json({ error: 'menu_id not found or not in your store' });
      return;
    }
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createMyStoreCategory:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * PUT /store/categories/:id - Cập nhật category (chỉ khi thuộc store của user).
 */
export async function updateMyStoreCategory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const id = req.params.id;
    const { name, sort_order } = req.body ?? {};
    const result = await pool.query<Category>(
      `UPDATE ${CATEGORIES_TABLE} c SET
         name = COALESCE($2, c.name),
         sort_order = COALESCE($3, c.sort_order),
         updated_at = NOW()
       FROM ${MENUS_TABLE} m
       WHERE c.menu_id = m.id AND m.store_id = $4 AND c.id = $1
       RETURNING c.*`,
      [id, name, sort_order, storeId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('updateMyStoreCategory:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
