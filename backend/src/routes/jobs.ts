import express from 'express';
import * as jobController from '../controllers/jobController';
import { clerkAuthMiddleware } from '../middleware/clerkAuth';

const router = express.Router();

/**
 * Job Routes
 */

// List all jobs with filters
router.get('/', jobController.listJobs);

// Get trending jobs
router.get('/trending', jobController.getTrendingJobs);

// Get nearby jobs
router.get('/nearby', jobController.getNearbyJobs);

// Search jobs
router.get('/search', jobController.searchJobs);

// Get jobs by category
router.get('/category/:category', jobController.getJobsByCategory);

// Create new job (protected)
router.post('/', clerkAuthMiddleware, jobController.createJob);

// Get user's jobs (protected)
router.get('/user/my-jobs', clerkAuthMiddleware, jobController.getUserJobs);

// Get job by ID
router.get('/:id', jobController.getJob);

// Update job (protected)
router.put('/:id', clerkAuthMiddleware, jobController.updateJob);

// Delete/cancel job (protected)
router.delete('/:id', clerkAuthMiddleware, jobController.deleteJob);

export default router;
