import { Router } from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkAuth';
import { supabase } from '../config/supabase';

const router = Router();

/**
 * Sync Clerk user to FundiGuard database (Supabase)
 * POST /api/users/sync-clerk
 * Body: { phone_number: string, role: 'client' | 'pro' }
 * Headers: Authorization: Bearer <CLERK_TOKEN>
 */
router.post('/sync-clerk', clerkAuthMiddleware, async (req, res) => {
  try {
    const { role, phone_number } = req.body;
    const clerkUserId = req.userId;
    const clerkUser = req.user;

    // Validate required fields
    if (!phone_number) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    if (!role || !['client', 'pro'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "client" or "pro"' });
    }

    // Validate Kenyan phone number format
    const phoneRegex = /^\+?254\d{9}$/;
    if (!phoneRegex.test(phone_number.replace(/\s/g, ''))) {
      return res.status(400).json({
        error: 'Invalid phone number. Use format: +254712345678 or 0712345678',
      });
    }

    // Normalize phone number to international format
    let normalizedPhone = phone_number.replace(/\s/g, '');
    if (normalizedPhone.startsWith('0')) {
      normalizedPhone = '+25' + normalizedPhone.substring(1);
    }
    if (!normalizedPhone.startsWith('+')) {
      normalizedPhone = '+' + normalizedPhone;
    }

    // Create or update user in Supabase
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          clerk_user_id: clerkUserId,
          phone_number: normalizedPhone,
          email: clerkUser.email,
          full_name: clerkUser.name || clerkUser.email,
          role: role,
          status: 'active',
          created_at: new Date().toISOString(),
        },
        {
          onConflict: 'clerk_user_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase upsert error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to sync user to database',
      });
    }

    if (!data) {
      return res.status(500).json({ error: 'Failed to retrieve synced user' });
    }

    res.json({
      success: true,
      user: {
        id: data.id,
        clerk_user_id: data.clerk_user_id,
        phone_number: data.phone_number,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
      },
      message: 'User synced successfully with FundiGuard',
    });
  } catch (error: any) {
    console.error('Sync clerk user error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Get current user profile from Supabase
 * GET /api/users/me
 * Headers: Authorization: Bearer <CLERK_TOKEN>
 */
router.get('/me', clerkAuthMiddleware, async (req, res) => {
  try {
    const clerkUserId = req.userId;

    // Look up user in Supabase by clerk_user_id
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error) {
      console.error('Supabase select error:', error);
      return res.status(404).json({ error: 'User not found in database' });
    }

    res.json({
      success: true,
      user: data,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update current user profile
 * PUT /api/users/me
 * Body: { full_name?, phone_number?, profile_image?, bio? }
 * Headers: Authorization: Bearer <CLERK_TOKEN>
 */
router.put('/me', clerkAuthMiddleware, async (req, res) => {
  try {
    const clerkUserId = req.userId;
    const { full_name, phone_number, profile_image, bio } = req.body;

    // Build update object - only include provided fields
    const updates: any = {};
    if (full_name) updates.full_name = full_name;
    if (phone_number) {
      // Validate phone format
      const phoneRegex = /^\+?254\d{9}$/;
      if (!phoneRegex.test(phone_number.replace(/\s/g, ''))) {
        return res.status(400).json({ error: 'Invalid phone number format' });
      }
      updates.phone_number = phone_number;
    }
    if (profile_image) updates.profile_image = profile_image;
    if (bio) updates.bio = bio;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.updated_at = new Date().toISOString();

    // Update in Supabase
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('clerk_user_id', clerkUserId)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      user: data,
      message: 'Profile updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
