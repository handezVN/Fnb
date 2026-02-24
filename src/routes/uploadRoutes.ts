import { Router, Request, Response } from 'express';
import path from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs';
import multer from 'multer';
import { requireAuth } from '../middleware/auth';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/\.(jpe?g|png|webp|gif)$/i.test(file.originalname)) cb(null, true);
    else cb(new Error('Only images (jpg, png, webp, gif) allowed'));
  },
});

const router = Router();

/** POST /upload - Upload 1 image, returns { url } */
router.post('/', requireAuth, upload.single('image'), (req: Request, res: Response) => {
  const file = (req as Request & { file?: { filename: string } }).file;
  if (!file) {
    res.status(400).json({ error: 'No image file' });
    return;
  }
  res.json({ url: `/uploads/${file.filename}` });
});

export default router;
