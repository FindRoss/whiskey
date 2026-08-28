import express from 'express';
import multer from 'multer';
import supabase from './supabase.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const path = `${Date.now()}-${req.file.originalname}`;

  const { error } = await supabase.storage
    .from('whiskey-images')
    .upload(path, req.file.buffer, { contentType: req.file.mimetype });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Upload failed' });
  }

  const { data } = supabase.storage.from('whiskey-images').getPublicUrl(path);

  res.status(201).json({ url: data.publicUrl });
});

export default router;