import { Router } from 'express';
import { getHealth, getDockerHealth } from '../controllers/healthController';

const router = Router();

router.get('/', getHealth);
router.get('/docker', getDockerHealth);

export default router;
