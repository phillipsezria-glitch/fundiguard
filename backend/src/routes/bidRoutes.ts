import express from 'express';
import * as bidController from '../controllers/bidController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * Bid Routes
 */

// Create a bid (requires authentication)
router.post('/', authMiddleware, bidController.createBid);

// Get bids for a specific job
router.get('/', bidController.getBidsForJob);

// Get all bids submitted by the current user (professional)
router.get('/my-bids', authMiddleware, bidController.getMyBids);

// Accept a bid (client only)
router.patch('/accept', authMiddleware, bidController.acceptBid);

// Reject a bid (client only)
router.patch('/reject', authMiddleware, bidController.rejectBid);

export default router;
