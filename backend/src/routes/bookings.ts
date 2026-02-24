import express from 'express';
import * as bookingController from '../controllers/bookingController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * Booking & Bid Routes
 */

// Submit a bid (protected)
router.post('/bids', authMiddleware, bookingController.submitBid);

// Get bids for a job (protected)
router.get('/bids/:jobId', authMiddleware, bookingController.getBidsForJob);

// Get my bids (protected)
router.get('/user/my-bids', authMiddleware, bookingController.getMyBids);

// Reject a bid (protected)
router.patch('/bids/:bidId/reject', authMiddleware, bookingController.rejectBid);

// Accept bid and create booking (protected)
router.post('/accept-bid', authMiddleware, bookingController.acceptBidAndCreateBooking);

// Get my bookings (protected)
router.get('/', authMiddleware, bookingController.getMyBookings);

// Get booking details
router.get('/:bookingId', bookingController.getBooking);

// Update booking status (protected)
router.patch('/:bookingId/status', authMiddleware, bookingController.updateBookingStatus);

// Complete booking with photos (protected)
router.patch('/:bookingId/complete', authMiddleware, bookingController.completeBooking);

// Cancel booking (protected)
router.post('/:bookingId/cancel', authMiddleware, bookingController.cancelBooking);

// Submit rating (protected)
router.post('/:bookingId/rate', authMiddleware, bookingController.submitRating);

// Get professional ratings
router.get('/ratings/:professionalUserId', bookingController.getProfessionalRatings);

export default router;
