import express from 'express';
import * as professionalController from '../controllers/professionalController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * Professional Routes
 */

// List all professionals
router.get('/', professionalController.listProfessionals);

// Get top professionals
router.get('/top', professionalController.getTopProfessionals);

// Search professionals
router.get('/search', professionalController.searchProfessionals);

// Get professionals by category
router.get('/category/:category', professionalController.getProfessionalsByCategory);

// Get my profile (protected)
router.get('/me', authMiddleware, professionalController.getMyProfile);

// Update my profile (protected)
router.put('/me', authMiddleware, professionalController.updateMyProfile);

// Get my stats (protected)
router.get('/me/stats', authMiddleware, professionalController.getMyStats);

// Get my earnings (protected)
router.get('/me/earnings', authMiddleware, professionalController.getMyEarnings);

// Update availability (protected)
router.patch('/me/availability', authMiddleware, professionalController.updateAvailability);

// Update online status (protected)
router.patch('/me/online-status', authMiddleware, professionalController.updateOnlineStatus);

// Upgrade subscription (protected)
router.post('/me/upgrade-subscription', authMiddleware, professionalController.upgradeSubscription);

// Get professional by ID (public)
router.get('/:id', professionalController.getProfile);

export default router;
