import { Request, Response } from 'express';
import * as jobService from '../services/jobService';
import { AuthenticatedRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

/**
 * Create a new job
 * POST /api/jobs
 */
export const createJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { title, category, description, budget, location, urgency, latitude, longitude, photos, proposed_job_date } = req.body;

    if (!title || !category || !description || !budget || !location) {
      res.status(400).json({ error: 'Title, category, description, budget, and location required' });
      return;
    }

    const job = await jobService.createJob({
      client_id: req.userId,
      title,
      category,
      description,
      budget: parseFloat(budget),
      location,
      urgency: urgency || 'normal',
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      photos: photos || [],
      proposed_job_date,
    });

    res.status(201).json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all jobs with filters
 * GET /api/jobs?category=&location=&status=&budget_min=&budget_max=&page=1&limit=10
 */
export const listJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      location,
      status,
      urgency,
      budget_min,
      budget_max,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filters = {
      category: category as string,
      location: location as string,
      status: status as string,
      urgency: urgency as string,
      budget_min: budget_min ? parseFloat(budget_min as string) : undefined,
      budget_max: budget_max ? parseFloat(budget_max as string) : undefined,
      search: search as string,
    };

    const result = await jobService.listJobs(
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
 * Get job by ID
 * GET /api/jobs/:id
 */
export const getJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const job = await jobService.getJobById(id);

    res.json(job);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

/**
 * Get jobs by category
 * GET /api/jobs/category/:category
 */
export const getJobsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const jobs = await jobService.getJobsByCategory(category, parseInt(limit as string) || 10);

    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user's jobs
 * GET /api/jobs/user/my-jobs
 */
export const getUserJobs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { status } = req.query;

    const jobs = await jobService.getJobsByClient(req.userId, status as string);

    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update job
 * PUT /api/jobs/:id
 */
export const updateJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const updates = req.body;

    // Verify ownership
    const { data: job } = await supabase
      .from('jobs')
      .select('client_id')
      .eq('id', id)
      .single();

    if (!job || job.client_id !== req.userId) {
      res.status(403).json({ error: 'Unauthorized: You do not own this job' });
      return;
    }

    const updated = await jobService.updateJob(id, updates);

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete job (cancel)
 * DELETE /api/jobs/:id
 */
export const deleteJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id } = req.params;

    const deleted = await jobService.deleteJob(id, req.userId);

    res.json(deleted);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get nearby jobs
 * GET /api/jobs/nearby?latitude=&longitude=&radius=10&limit=10
 */
export const getNearbyJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, radius = 10, limit = 10 } = req.query;

    if (!latitude || !longitude) {
      res.status(400).json({ error: 'Latitude and longitude required' });
      return;
    }

    const jobs = await jobService.getNearbyJobs(
      parseFloat(latitude as string),
      parseFloat(longitude as string),
      parseFloat(radius as string) || 10,
      parseInt(limit as string) || 10
    );

    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Search jobs
 * GET /api/jobs/search?q=plumbing
 */
export const searchJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q) {
      res.status(400).json({ error: 'Search query required' });
      return;
    }

    const jobs = await jobService.searchJobs(q as string, parseInt(limit as string) || 20);

    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get trending jobs
 * GET /api/jobs/trending?days=7&limit=10
 */
export const getTrendingJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { days = 7, limit = 10 } = req.query;

    const jobs = await jobService.getTrendingJobs(
      parseInt(days as string) || 7,
      parseInt(limit as string) || 10
    );

    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Import supabase for middleware verification
import { supabase } from '../config/supabase';
