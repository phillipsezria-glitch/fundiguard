import { Request, Response } from 'express';
import * as bookingService from '../services/bookingService';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * Submit a bid on a job
 * POST /api/bookings/bids
 */
export const submitBid = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { job_id, proposed_price, estimated_duration_hours, bid_message } = req.body;

    if (!job_id || !proposed_price || proposed_price < 0) {
      res.status(400).json({ error: 'Job ID and valid proposed price required' });
      return;
    }

    if (estimated_duration_hours && estimated_duration_hours < 0.5) {
      res.status(400).json({ error: 'Estimated duration must be at least 0.5 hours' });
      return;
    }

    const bid = await bookingService.submitBid(req.user.userId, {
      job_id,
      proposed_price: parseFloat(proposed_price),
      estimated_duration_hours: parseFloat(estimated_duration_hours) || 1,
      bid_message,
    });

    res.status(201).json(bid);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get bids for a job
 * GET /api/bookings/bids/:jobId
 */
export const getBidsForJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;

    // Verify ownership
    const { data: job } = await supabase
      .from('jobs')
      .select('client_id')
      .eq('id', jobId)
      .single();

    if (!job || (req.user && job.client_id !== req.user.userId)) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const bids = await bookingService.getBidsForJob(jobId);

    res.json(bids);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get my bids
 * GET /api/bookings/bids/user/my-bids
 */
export const getMyBids = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { status } = req.query;

    const bids = await bookingService.getBidsSubmittedBy(req.user.userId, status as string);

    res.json(bids);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Reject a bid
 * PATCH /api/bookings/bids/:bidId/reject
 */
export const rejectBid = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { bidId } = req.params;

    const bid = await bookingService.rejectBid(bidId);

    res.json(bid);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Accept a bid and create booking
 * POST /api/bookings/accept-bid
 */
export const acceptBidAndCreateBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { bid_id, final_price, scheduled_date, scheduled_time } = req.body;

    if (!bid_id || !final_price || !scheduled_date) {
      res.status(400).json({ error: 'Bid ID, final price, and scheduled date required' });
      return;
    }

    const booking = await bookingService.acceptBidAndCreateBooking(bid_id, req.user.userId, {
      final_price: parseFloat(final_price),
      scheduled_date,
      scheduled_time,
    });

    res.status(201).json(booking);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get booking details
 * GET /api/bookings/:bookingId
 */
export const getBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;

    const booking = await bookingService.getBookingById(bookingId);

    res.json(booking);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

/**
 * Get my bookings
 * GET /api/bookings?status=scheduled
 */
export const getMyBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { status } = req.query;

    // This is simplified - in reality we need to check user role
    const bookings = await bookingService.getUserBookings(req.user.userId, 'client', status as string);

    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update booking status
 * PATCH /api/bookings/:bookingId/status
 */
export const updateBookingStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { bookingId } = req.params;
    const { status } = req.body;

    if (!['scheduled', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const booking = await bookingService.updateBookingStatus(bookingId, status);

    res.json(booking);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Submit completion photos
 * PATCH /api/bookings/:bookingId/complete
 */
export const completeBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { bookingId } = req.params;
    const { completion_photos, pro_notes } = req.body;

    if (!completion_photos || !Array.isArray(completion_photos)) {
      res.status(400).json({ error: 'Completion photos array required' });
      return;
    }

    const booking = await bookingService.submitCompletionPhotos(bookingId, completion_photos, pro_notes);

    res.json(booking);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Cancel booking
 * POST /api/bookings/:bookingId/cancel
 */
export const cancelBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { bookingId } = req.params;
    const { cancellation_reason } = req.body;

    const booking = await bookingService.cancelBooking(bookingId, cancellation_reason || '');

    res.json(booking);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Submit rating
 * POST /api/bookings/:bookingId/rate
 */
export const submitRating = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { bookingId } = req.params;
    const { rating, review_text, categories } = req.body;

    if (!rating || !review_text) {
      res.status(400).json({ error: 'Rating and review text required' });
      return;
    }

    const ratingRecord = await bookingService.submitRating(
      bookingId,
      req.user.userId,
      parseInt(rating),
      review_text,
      categories
    );

    res.status(201).json(ratingRecord);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get professional ratings
 * GET /api/bookings/ratings/:professionalUserId
 */
export const getProfessionalRatings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { professionalUserId } = req.params;
    const { limit = 20 } = req.query;

    const ratings = await bookingService.getProfessionalRatings(
      professionalUserId,
      parseInt(limit as string) || 20
    );

    res.json(ratings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Import supabase for authorization
import { supabase } from '../config/supabase';
