import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { MENUS_TABLE, Menu } from '../models/Menu';

/**
 * GET /store/menus - Chỉ trả về menus của store mà user thuộc về (req.user.store_id).
 * Dùng với requireStoreAccount.
 */
export async function listMyStoreMenus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const result = await pool.query<Menu>(
      `SELECT * FROM ${MENUS_TABLE} WHERE store_id = $1 ORDER BY created_at DESC`,
      [storeId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('listMyStoreMenus:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /store/menus/:id - Lấy 1 menu chỉ khi menu thuộc store của user.
 */
export async function getMyStoreMenu(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const id = req.params.id;
    const result = await pool.query<Menu>(
      `SELECT * FROM ${MENUS_TABLE} WHERE id = $1 AND store_id = $2`,
      [id, storeId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Menu not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getMyStoreMenu:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /store/menus - Tạo menu cho store của user.
 */
export async function createMyStoreMenu(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const { name, is_active } = req.body ?? {};
    if (!name) {
      res.status(400).json({ error: 'name is required' });
      return;
    }
    const result = await pool.query<Menu>(
      `INSERT INTO ${MENUS_TABLE} (store_id, name, is_active)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [storeId, name, is_active ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createMyStoreMenu:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * PUT /store/menus/:id - Cập nhật menu (chỉ khi thuộc store của user).
 */
export async function updateMyStoreMenu(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const id = req.params.id;
    const { name, is_active } = req.body ?? {};
    const result = await pool.query<Menu>(
      `UPDATE ${MENUS_TABLE}
       SET name = COALESCE($2, name), is_active = COALESCE($3, is_active), updated_at = NOW()
       WHERE id = $1 AND store_id = $4 RETURNING *`,
      [id, name, is_active, storeId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Menu not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('updateMyStoreMenu:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
