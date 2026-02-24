import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { PRODUCTS_TABLE } from '../models/Product';
import { PRODUCT_IMAGES_TABLE } from '../models/ProductImage';
import { CATEGORIES_TABLE } from '../models/Category';
import { MENUS_TABLE } from '../models/Menu';
import type { Product } from '../models/Product';

function normalizePrice(row: Product): Product {
  if (row && typeof row.price === 'string') {
    return { ...row, price: parseFloat(row.price as unknown as string) };
  }
  return row;
}

/**
 * GET /store/products - Danh sách products thuộc categories của menus trong store user.
 */
export async function listMyStoreProducts(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const result = await pool.query<Product>(
      `SELECT p.* FROM ${PRODUCTS_TABLE} p
       JOIN ${CATEGORIES_TABLE} c ON c.id = p.category_id
       JOIN ${MENUS_TABLE} m ON m.id = c.menu_id AND m.store_id = $1
       ORDER BY c.menu_id, c.sort_order, p.sort_order, p.created_at`,
      [storeId]
    );
    res.json(result.rows.map(normalizePrice));
  } catch (err) {
    console.error('listMyStoreProducts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /store/products/:id - Lấy 1 product (chỉ khi thuộc store của user).
 */
export async function getMyStoreProduct(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const id = req.params.id;
    const result = await pool.query<Product>(
      `SELECT p.* FROM ${PRODUCTS_TABLE} p
       JOIN ${CATEGORIES_TABLE} c ON c.id = p.category_id
       JOIN ${MENUS_TABLE} m ON m.id = c.menu_id AND m.store_id = $1
       WHERE p.id = $2`,
      [storeId, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    const product = normalizePrice(result.rows[0]);
    const imagesResult = await pool.query(
      `SELECT id, image_url, sort_order FROM ${PRODUCT_IMAGES_TABLE} WHERE product_id = $1 ORDER BY sort_order`,
      [id]
    );
    res.json({ ...product, images: imagesResult.rows });
  } catch (err) {
    console.error('getMyStoreProduct:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * POST /store/products - Tạo product (category_id phải thuộc store của user).
 */
export async function createMyStoreProduct(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const { category_id, name, description, price, image_url, is_available, sort_order } = req.body ?? {};
    if (!category_id || !name || price == null) {
      res.status(400).json({ error: 'category_id, name and price are required' });
      return;
    }
    const priceNum = typeof price === 'string' ? parseFloat(price) : Number(price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      res.status(400).json({ error: 'price must be a non-negative number' });
      return;
    }
    const result = await pool.query<Product>(
      `INSERT INTO ${PRODUCTS_TABLE} (category_id, name, description, price, image_url, is_available, sort_order)
       SELECT $1, $2, $3, $4, $5, $6, $7
       FROM ${CATEGORIES_TABLE} c
       JOIN ${MENUS_TABLE} m ON m.id = c.menu_id AND m.store_id = $8
       WHERE c.id = $1
       RETURNING *`,
      [category_id, name, description ?? null, priceNum, image_url ?? null, is_available ?? true, sort_order ?? 0, storeId]
    );
    if (result.rows.length === 0) {
      res.status(400).json({ error: 'category_id not found or not in your store' });
      return;
    }
    res.status(201).json(normalizePrice(result.rows[0]));
  } catch (err) {
    console.error('createMyStoreProduct:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * PUT /store/products/:id - Cập nhật product (chỉ khi thuộc store của user).
 */
export async function updateMyStoreProduct(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const id = req.params.id;
    const { name, description, price, image_url, is_available, sort_order } = req.body ?? {};
    const priceVal = price != null ? (typeof price === 'string' ? parseFloat(price) : Number(price)) : undefined;
    const result = await pool.query<Product>(
      `UPDATE ${PRODUCTS_TABLE} p SET
         name = COALESCE($2, p.name),
         description = COALESCE($3, p.description),
         price = COALESCE($4, p.price),
         image_url = COALESCE($5, p.image_url),
         is_available = COALESCE($6, p.is_available),
         sort_order = COALESCE($7, p.sort_order),
         updated_at = NOW()
       FROM ${CATEGORIES_TABLE} c
       JOIN ${MENUS_TABLE} m ON m.id = c.menu_id AND m.store_id = $8
       WHERE p.category_id = c.id AND p.id = $1
       RETURNING p.*`,
      [id, name, description, priceVal, image_url, is_available, sort_order, storeId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(normalizePrice(result.rows[0]));
  } catch (err) {
    console.error('updateMyStoreProduct:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * PATCH /store/products/:id/availability - Bật/tắt bán (chỉ khi thuộc store của user).
 */
export async function patchMyStoreProductAvailability(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const id = req.params.id;
    const { is_available } = req.body ?? {};
    if (typeof is_available !== 'boolean') {
      res.status(400).json({ error: 'is_available must be a boolean' });
      return;
    }
    const result = await pool.query<Product>(
      `UPDATE ${PRODUCTS_TABLE} p SET is_available = $2, updated_at = NOW()
       FROM ${CATEGORIES_TABLE} c
       JOIN ${MENUS_TABLE} m ON m.id = c.menu_id AND m.store_id = $3
       WHERE p.category_id = c.id AND p.id = $1
       RETURNING p.*`,
      [id, is_available, storeId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(normalizePrice(result.rows[0]));
  } catch (err) {
    console.error('patchMyStoreProductAvailability:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
