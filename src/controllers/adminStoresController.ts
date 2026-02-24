import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import {
  STORES_TABLE,
  Store,
  StoreCreateInput,
  StoreUpdateInput,
} from '../models/Store';

export async function listStores(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const result = await pool.query<Store>(`SELECT * FROM ${STORES_TABLE} ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error('listStores:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getStore(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await pool.query<Store>(`SELECT * FROM ${STORES_TABLE} WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getStore:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createStore(req: AuthRequest, res: Response): Promise<void> {
  try {
    const body = req.body as StoreCreateInput;
    if (!body.name || !body.address) {
      res.status(400).json({ error: 'name and address are required' });
      return;
    }
    const result = await pool.query<Store>(
      `INSERT INTO ${STORES_TABLE} (name, address, phone, opening_time, closing_time, is_open)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        body.name,
        body.address,
        body.phone ?? null,
        body.opening_time ?? null,
        body.closing_time ?? null,
        body.is_open ?? true,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createStore:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateStore(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const body = req.body as StoreUpdateInput;
    const result = await pool.query<Store>(
      `UPDATE ${STORES_TABLE}
       SET name = COALESCE($2, name), address = COALESCE($3, address), phone = COALESCE($4, phone),
           opening_time = COALESCE($5, opening_time), closing_time = COALESCE($6, closing_time),
           is_open = COALESCE($7, is_open), updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [
        id,
        body.name,
        body.address,
        body.phone,
        body.opening_time,
        body.closing_time,
        body.is_open,
      ]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('updateStore:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteStore(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const result = await pool.query(`DELETE FROM ${STORES_TABLE} WHERE id = $1 RETURNING id`, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error('deleteStore:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
