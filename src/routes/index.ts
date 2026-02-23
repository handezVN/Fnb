import { Router, Request, Response } from 'express';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Backend running 🚀 !@312312321' });
});
router.use('/health', healthRoutes);

// API v1
const v1 = Router();
v1.use('/auth', authRoutes);
// v1.use('/admin', adminRoutes);
// v1.use('/store', storeRoutes);
// v1.use('/customer', customerRoutes);
// v1.use('/orders', ordersRoutes);
// v1.use('/menu', menuRoutes);

router.use('/api/v1', v1);

export default router;
