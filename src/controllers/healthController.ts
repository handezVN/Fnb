import { Request, Response } from 'express';
import pool from '../config/database';

/**
 * Health check + DB connectivity
 */
export async function getHealth(_req: Request, res: Response): Promise<void> {
  try {
    const dbResult = await pool.query('SELECT NOW() as now');
    res.json({
      message: 'Backend running 🚀',
      data: dbResult.rows,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      message: 'Service unavailable',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

/**
 * Kiểm tra kết nối Docker (PostgreSQL trong Docker) thành công chưa
 * GET /health/docker → { success, docker_connected, database, message }
 */
export async function getDockerHealth(_req: Request, res: Response): Promise<void> {
  const startedAt = Date.now();
  try {
    const dbResult = await pool.query('SELECT 1 as ok, NOW() as server_time');
    const latencyMs = Date.now() - startedAt;

    res.json({
      success: true,
      docker_connected: true,
      database: 'connected',
      message: 'Kết nối Docker (PostgreSQL) thành công',
      server_time: dbResult.rows[0]?.server_time,
      latency_ms: latencyMs,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      docker_connected: false,
      database: 'disconnected',
      message: 'Không thể kết nối tới database (Docker). Kiểm tra container postgres đã chạy chưa.',
      error: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}
