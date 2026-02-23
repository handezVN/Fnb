import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { login, logout, me } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

export default router;
