import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * Get user profile
 * GET /api/users/profile
 */
export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, phone_number, full_name, role, bio, location, avatar_url, rating, created_at')
      .eq('id', req.user.userId)
      .single();

    if (error) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get job count for professionals
    let total_jobs = 0;
    if (user.role === 'pro') {
      const { count } = await supabase
        .from('bids')
        .select('*', { count: 'exact', head: true })
        .eq('professional_id', req.user.userId)
        .eq('status', 'accepted');

      total_jobs = count || 0;
    }

    res.json({
      ...user,
      total_jobs,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch profile' });
  }
};

/**
 * Update user profile
 * PATCH /api/users/profile
 * Body: { full_name?, location?, bio? }
 */
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { full_name, location, bio } = req.body;

    // Validate inputs
    if (full_name && full_name.trim().length < 2) {
      res.status(400).json({ error: 'Full name must be at least 2 characters' });
      return;
    }

    // Build update object (only include provided fields)
    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: 'No fields to update' });
      return;
    }

    const { data: updated, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user.userId)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json({
      message: 'Profile updated successfully',
      user: updated,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
};

/**
 * Get random professionals (for browsing)
 * GET /api/users/professionals?limit=10
 */
export const getProfessionals = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

    const { data: professionals, error } = await supabase
      .from('users')
      .select('id, phone_number, full_name, role, bio, location, avatar_url, rating, created_at')
      .eq('role', 'pro')
      .limit(limit);

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.json({
      professionals: professionals || [],
      total: professionals?.length || 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch professionals' });
  }
};

/**
 * Get professional profile by ID
 * GET /api/users/professionals/:id
 */
export const getProfessionalById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data: professional, error } = await supabase
      .from('users')
      .select('id, phone_number, full_name, role, bio, location, avatar_url, rating, created_at')
      .eq('id', id)
      .eq('role', 'pro')
      .single();

    if (error) {
      res.status(404).json({ error: 'Professional not found' });
      return;
    }

    // Get completed jobs count
    const { count } = await supabase
      .from('bids')
      .select('*', { count: 'exact', head: true })
      .eq('professional_id', id)
      .eq('status', 'accepted');

    res.json({
      ...professional,
      total_jobs: count || 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch professional' });
  }
};
