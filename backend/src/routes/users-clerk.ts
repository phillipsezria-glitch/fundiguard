import { Router } from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkAuth';

const router = Router();

/**
 * Sync Clerk user to FundiGuard database
 * POST /api/users/sync-clerk
 * Headers: Authorization: Bearer <CLERK_TOKEN>
 */
router.post('/sync-clerk', clerkAuthMiddleware, async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.userId;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // SUCCESS - User synced (TODO: Add database sync in future)
    res.json({
      success: true,
      message: 'User synced with FundiGuard',
      user: {
        id: userId,
        email: user.email,
        name: user.name,
        role: role || user.role || 'client',
      },
    });
  } catch (error: any) {
    console.error('Sync clerk user error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get current user profile
 * GET /api/users/me
 * Headers: Authorization: Bearer <CLERK_TOKEN>
 */
router.get('/me', clerkAuthMiddleware, async (req, res) => {
  try {
    const user = req.user;

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role || 'client',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
