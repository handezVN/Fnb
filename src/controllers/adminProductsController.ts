import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import {
  PRODUCTS_TABLE,
  Product,
  ProductCreateInput,
  ProductUpdateInput,
} from '../models/Product';

function normalizeProductPrice(row: Product): Product {
  if (row && typeof row.price === 'string') {
    return { ...row, price: parseFloat(row.price as unknown as string) };
  }
  return row;
}

export async function listProducts(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const result = await pool.query<Product>(
      `SELECT * FROM ${PRODUCTS_TABLE} ORDER BY category_id, sort_order, created_at`
    );
    res.json(result.rows.map(normalizeProductPrice));
  } catch (err) {
    console.error('listProducts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getProduct(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await pool.query<Product>(`SELECT * FROM ${PRODUCTS_TABLE} WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(normalizeProductPrice(result.rows[0]));
  } catch (err) {
    console.error('getProduct:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createProduct(req: AuthRequest, res: Response): Promise<void> {
  try {
    const body = req.body as ProductCreateInput;
    if (!body.category_id || !body.name || body.price == null) {
      res.status(400).json({ error: 'category_id, name and price are required' });
      return;
    }
    const price = typeof body.price === 'string' ? parseFloat(body.price) : Number(body.price);
    if (Number.isNaN(price) || price < 0) {
      res.status(400).json({ error: 'price must be a non-negative number' });
      return;
    }
    const result = await pool.query<Product>(
      `INSERT INTO ${PRODUCTS_TABLE} (category_id, name, description, price, image_url, is_available, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        body.category_id,
        body.name,
        body.description ?? null,
        price,
        body.image_url ?? null,
        body.is_available ?? true,
        body.sort_order ?? 0,
      ]
    );
    res.status(201).json(normalizeProductPrice(result.rows[0]));
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === '23503') {
      res.status(400).json({ error: 'category_id not found' });
      return;
    }
    console.error('createProduct:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateProduct(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const body = req.body as ProductUpdateInput;
    const priceVal = body.price != null
      ? (typeof body.price === 'string' ? parseFloat(body.price) : body.price)
      : undefined;
    const result = await pool.query<Product>(
      `UPDATE ${PRODUCTS_TABLE}
       SET name = COALESCE($2, name), description = COALESCE($3, description),
           price = COALESCE($4, price), image_url = COALESCE($5, image_url),
           is_available = COALESCE($6, is_available), sort_order = COALESCE($7, sort_order),
           updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, body.name, body.description, priceVal, body.image_url, body.is_available, body.sort_order]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(normalizeProductPrice(result.rows[0]));
  } catch (err) {
    console.error('updateProduct:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function patchProductAvailability(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const { is_available } = req.body as { is_available?: boolean };
    if (typeof is_available !== 'boolean') {
      res.status(400).json({ error: 'is_available must be a boolean' });
      return;
    }
    const result = await pool.query<Product>(
      `UPDATE ${PRODUCTS_TABLE} SET is_available = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id, is_available]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(normalizeProductPrice(result.rows[0]));
  } catch (err) {
    console.error('patchProductAvailability:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
