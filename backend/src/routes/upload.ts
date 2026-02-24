import express, { Response } from 'express';
import multer from 'multer';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest, authMiddleware } from '../middleware/auth';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    // Only allow image files
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

/**
 * Upload a single image
 * POST /api/upload
 * Multipart form-data with 'file' field
 */
router.post('/', authMiddleware, upload.single('file'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Generate unique filename
    const fileName = `${req.user.userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${req.file.originalname.split('.').pop()}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('job-photos')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload image' });
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('job-photos')
      .getPublicUrl(data.path);

    res.json({
      url: urlData.publicUrl,
      path: data.path,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

/**
 * Upload multiple images
 * POST /api/upload/batch
 * Multipart form-data with 'files' field (array)
 */
router.post('/batch', authMiddleware, upload.array('files', 5), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.files || req.files.length === 0) {
      res.status(400).json({ error: 'No files provided' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const uploadPromises = (req.files as Express.Multer.File[]).map(async (file) => {
      const fileName = `${req.user!.userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${file.originalname.split('.').pop()}`;

      const { data, error } = await supabase.storage
        .from('job-photos')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('job-photos')
        .getPublicUrl(data.path);

      return {
        url: urlData.publicUrl,
        path: data.path,
      };
    });

    const results = await Promise.all(uploadPromises);

    res.json({
      urls: results.map((r) => r.url),
      files: results,
    });
  } catch (error: any) {
    console.error('Batch upload error:', error);
    res.status(500).json({ error: error.message || 'Batch upload failed' });
  }
});

/**
 * Delete an uploaded image
 * DELETE /api/upload
 * Body: { path: string }
 */
router.delete('/', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { path } = req.body;

    if (!path) {
      res.status(400).json({ error: 'Path required' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Verify ownership - path should start with user ID
    if (!path.startsWith(req.user.userId)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const { error } = await supabase.storage
      .from('job-photos')
      .remove([path]);

    if (error) {
      res.status(500).json({ error: 'Failed to delete image' });
      return;
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (error: any) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message || 'Delete failed' });
  }
});

export default router;
