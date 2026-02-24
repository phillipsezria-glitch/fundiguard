import { Request, Response } from 'express';
import * as professionalService from '../services/professionalService';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * Get my professional profile
 * GET /api/professionals/me
 */
export const getMyProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const profile = await professionalService.getProfessionalByUserId(req.user.userId);

    res.json(profile);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

/**
 * Update my professional profile
 * PUT /api/professionals/me
 */
export const updateMyProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const updates = req.body;

    const profile = await professionalService.updateProfessional(req.user.userId, updates);

    res.json(profile);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get professional profile by ID (public)
 * GET /api/professionals/:id
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const profile = await professionalService.getProfessionalById(id);

    res.json(profile);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

/**
 * List all professionals
 * GET /api/professionals?category=&location=&min_rating=&available_only=true&online_only=true&page=1&limit=10
 */
export const listProfessionals = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      location,
      min_rating,
      available_only,
      online_only,
      verified_only,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filters = {
      category: category as string,
      location: location as string,
      min_rating: min_rating ? parseFloat(min_rating as string) : undefined,
      available_only: available_only === 'true',
      online_only: online_only === 'true',
      verified_only: verified_only === 'true',
      search: search as string,
    };

    const result = await professionalService.listProfessionals(
      filters,
      parseInt(page as string) || 1,
      parseInt(limit as string) || 10
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get professionals by category
 * GET /api/professionals/category/:category
 */
export const getProfessionalsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const professionals = await professionalService.getProfessionalsByCategory(
      category,
      parseInt(limit as string) || 10
    );

    res.json(professionals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Search professionals
 * GET /api/professionals/search?q=plumber
 */
export const searchProfessionals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q) {
      res.status(400).json({ error: 'Search query required' });
      return;
    }

    const professionals = await professionalService.searchProfessionals(
      q as string,
      parseInt(limit as string) || 20
    );

    res.json(professionals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get top rated professionals
 * GET /api/professionals/top?limit=10
 */
export const getTopProfessionals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 10 } = req.query;

    const professionals = await professionalService.getTopProfessionals(
      parseInt(limit as string) || 10
    );

    res.json(professionals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get professional stats
 * GET /api/professionals/me/stats
 */
export const getMyStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const stats = await professionalService.getProfessionalStats(req.user.userId);

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get professional earnings
 * GET /api/professionals/me/earnings
 */
export const getMyEarnings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { limit = 50 } = req.query;

    const earnings = await professionalService.getProfessionalEarnings(
      req.user.userId,
      parseInt(limit as string) || 50
    );

    res.json(earnings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update availability
 * PATCH /api/professionals/me/availability
 */
export const updateAvailability = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { is_available } = req.body;

    if (is_available === undefined) {
      res.status(400).json({ error: 'is_available boolean required' });
      return;
    }

    const updated = await professionalService.updateAvailability(req.user.userId, is_available);

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update online status
 * PATCH /api/professionals/me/online-status
 */
export const updateOnlineStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { is_online } = req.body;

    if (is_online === undefined) {
      res.status(400).json({ error: 'is_online boolean required' });
      return;
    }

    const updated = await professionalService.updateOnlineStatus(req.user.userId, is_online);

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upgrade subscription
 * POST /api/professionals/me/upgrade-subscription
 */
export const upgradeSubscription = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { subscription_type } = req.body;

    if (!['free', 'premium', 'elite'].includes(subscription_type)) {
      res.status(400).json({ error: 'Invalid subscription type' });
      return;
    }

    // In production, verify payment was made
    const updated = await professionalService.upgradeProfessionalSubscription(
      req.user.userId,
      subscription_type
    );

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
