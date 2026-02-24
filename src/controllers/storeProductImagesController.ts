import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { PRODUCT_IMAGES_TABLE } from '../models/ProductImage';
import { PRODUCTS_TABLE } from '../models/Product';
import { CATEGORIES_TABLE } from '../models/Category';
import { MENUS_TABLE } from '../models/Menu';
import type { ProductImage } from '../models/ProductImage';

async function ensureProductInStore(productId: string, storeId: string): Promise<boolean> {
  const r = await pool.query(
    `SELECT 1 FROM ${PRODUCTS_TABLE} p
     JOIN ${CATEGORIES_TABLE} c ON c.id = p.category_id
     JOIN ${MENUS_TABLE} m ON m.id = c.menu_id AND m.store_id = $2
     WHERE p.id = $1`,
    [productId, storeId]
  );
  return r.rows.length > 0;
}

export async function listMyStoreProductImages(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const productId = String(req.params.productId);
    const ok = await ensureProductInStore(productId, storeId);
    if (!ok) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    const result = await pool.query<ProductImage>(
      `SELECT * FROM ${PRODUCT_IMAGES_TABLE} WHERE product_id = $1 ORDER BY sort_order, created_at`,
      [productId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('listMyStoreProductImages:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function addMyStoreProductImage(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const productId = String(req.params.productId);
    const ok = await ensureProductInStore(productId, storeId);
    if (!ok) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    const file = (req as AuthRequest & { file?: { filename: string } }).file;
    const image_url = file ? `/uploads/${file.filename}` : (req.body?.image_url as string);
    if (!image_url) {
      res.status(400).json({ error: 'image_url or file upload required' });
      return;
    }
    const sort_order = Number(req.body?.sort_order ?? 0);
    const result = await pool.query<ProductImage>(
      `INSERT INTO ${PRODUCT_IMAGES_TABLE} (product_id, image_url, sort_order)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [productId, image_url, sort_order]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('addMyStoreProductImage:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteMyStoreProductImage(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const productId = String(req.params.productId);
    const imageId = String(req.params.imageId);
    const ok = await ensureProductInStore(productId, storeId);
    if (!ok) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    const result = await pool.query(
      `DELETE FROM ${PRODUCT_IMAGES_TABLE} WHERE id = $1 AND product_id = $2 RETURNING id`,
      [imageId, productId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error('deleteMyStoreProductImage:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function reorderMyStoreProductImages(req: AuthRequest, res: Response): Promise<void> {
  try {
    const storeId = req.user?.store_id;
    if (!storeId) {
      res.status(403).json({ error: 'Store account required' });
      return;
    }
    const productId = String(req.params.productId);
    const ok = await ensureProductInStore(productId, storeId);
    if (!ok) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    const { image_ids } = req.body as { image_ids?: string[] };
    if (!Array.isArray(image_ids)) {
      res.status(400).json({ error: 'image_ids array required' });
      return;
    }
    await pool.query('BEGIN');
    for (let i = 0; i < image_ids.length; i++) {
      await pool.query(
        `UPDATE ${PRODUCT_IMAGES_TABLE} SET sort_order = $2 WHERE id = $1 AND product_id = $3`,
        [image_ids[i], i, productId]
      );
    }
    await pool.query('COMMIT');
    const result = await pool.query<ProductImage>(
      `SELECT * FROM ${PRODUCT_IMAGES_TABLE} WHERE product_id = $1 ORDER BY sort_order`,
      [productId]
    );
    res.json(result.rows);
  } catch (err) {
    await pool.query('ROLLBACK').catch(() => {});
    console.error('reorderMyStoreProductImages:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
