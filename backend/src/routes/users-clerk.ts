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

    // TODO: Implement database sync
    // This should:
    // 1. Check if user already exists in database using clerk_user_id
    // 2. If not, create new user record
    // 3. Update role in database
    // 4. Return sync status

    // For now, return success
    res.json({
      success: true,
      message: 'User synced with FundiGuard',
      user: {
        id: userId,
        email: user.email,
        name: user.name,
        role: role || user.role,
      },
    });
  } catch (error: any) {
    console.error('Sync clerk user error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get current user profile
 * GET /api/users/profile
 */
router.get('/profile', clerkAuthMiddleware, async (req, res) => {
  try {
    const user = req.user;

    // TODO: Fetch full user profile from database including:
    // - Rating
    // - Reviews
    // - Verified status
    // - Portfolio (if pro)
    // - etc.

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update current user profile
 * PUT /api/users/profile
 */
router.put('/profile', clerkAuthMiddleware, async (req, res) => {
  try {
    const { phone, name, profile_image, bio, experience } = req.body;
    const userId = req.userId;

    // TODO: Implement profile update in database
    // Update user fields and Clerk metadata

    res.json({
      success: true,
      message: 'Profile updated',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
