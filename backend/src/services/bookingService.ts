import { supabase } from '../config/supabase';

export interface CreateBidInput {
  job_id: string;
  proposed_price: number;
  estimated_duration_hours: number;
  bid_message?: string;
}

export interface CreateBookingInput {
  bid_id: string;
  final_price: number;
  scheduled_date: string;
  scheduled_time?: string;
}

/**
 * Submit a bid on a job
 */
export const submitBid = async (professionalId: string, input: CreateBidInput) => {
  try {
    // Verify job exists and is open
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', input.job_id)
      .eq('status', 'open')
      .single();

    if (jobError || !job) {
      throw new Error('Job not found or is not open');
    }

    // Check if professional already bid on this job
    const { data: existingBid } = await supabase
      .from('bids')
      .select('id')
      .eq('job_id', input.job_id)
      .eq('professional_id', professionalId)
      .single();

    if (existingBid) {
      throw new Error('You have already bid on this job');
    }

    const bid = {
      id: crypto.randomUUID(),
      job_id: input.job_id,
      professional_id: professionalId,
      proposed_price: input.proposed_price,
      estimated_duration_hours: input.estimated_duration_hours,
      bid_message: input.bid_message || '',
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('bids')
      .insert([bid])
      .select()
      .single();

    if (error) {
      throw new Error('Failed to submit bid');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get bids for a specific job
 */
export const getBidsForJob = async (jobId: string) => {
  try {
    const { data: bids, error } = await supabase
      .from('bids')
      .select('*')
      .eq('job_id', jobId)
      .eq('status', 'pending')
      .order('proposed_price', { ascending: true });

    if (error) {
      throw new Error('Failed to fetch bids');
    }

    // Enrich with professional info
    const enriched = await Promise.all(
      (bids || []).map(async (bid) => {
        const { data: professional } = await supabase
          .from('professionals')
          .select(
            `*,
            users:user_id(id, full_name, profile_photo_url, verified, dci_verified)`
          )
          .eq('id', bid.professional_id)
          .single();

        return { ...bid, professional };
      })
    );

    return enriched;
  } catch (error) {
    throw error;
  }
};

/**
 * Get bids submitted by a professional
 */
export const getBidsSubmittedBy = async (professionalId: string, status?: string) => {
  try {
    let query = supabase
      .from('bids')
      .select('*')
      .eq('professional_id', professionalId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch bids');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reject a bid
 */
export const rejectBid = async (bidId: string) => {
  try {
    const { data, error } = await supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('id', bidId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to reject bid');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Accept a bid and create booking
 */
export const acceptBidAndCreateBooking = async (
  bidId: string,
  clientId: string,
  input: Omit<CreateBookingInput, 'bid_id'>
) => {
  try {
    // Get bid details
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select('*')
      .eq('id', bidId)
      .single();

    if (bidError || !bid) {
      throw new Error('Bid not found');
    }

    // Verify client owns the job
    const { data: job } = await supabase
      .from('jobs')
      .select('client_id, status')
      .eq('id', bid.job_id)
      .single();

    if (!job || job.client_id !== clientId) {
      throw new Error('Unauthorized: You do not own this job');
    }

    if (job.status !== 'open') {
      throw new Error('Job is no longer open');
    }

    // Update bid to accepted
    const { error: bidUpdateError } = await supabase
      .from('bids')
      .update({ status: 'accepted', accepted_at: new Date().toISOString() })
      .eq('id', bidId);

    if (bidUpdateError) {
      throw new Error('Failed to accept bid');
    }

    // Reject all other bids
    await supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('job_id', bid.job_id)
      .neq('id', bidId);

    // Create booking
    const booking = {
      id: crypto.randomUUID(),
      job_id: bid.job_id,
      client_id: clientId,
      professional_id: bid.professional_id,
      bid_id: bidId,
      final_price: input.final_price,
      status: 'scheduled',
      scheduled_date: input.scheduled_date,
      scheduled_time: input.scheduled_time || '09:00',
      created_at: new Date().toISOString(),
    };

    const { data: newBooking, error: bookingError } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single();

    if (bookingError) {
      throw new Error('Failed to create booking');
    }

    // Update job status
    await supabase
      .from('jobs')
      .update({ status: 'in_progress' })
      .eq('id', bid.job_id);

    return newBooking;
  } catch (error) {
    throw error;
  }
};

/**
 * Get booking by ID
 */
export const getBookingById = async (bookingId: string) => {
  try {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      throw new Error('Booking not found');
    }

    return booking;
  } catch (error) {
    throw error;
  }
};

/**
 * Get bookings for a user (client or professional)
 */
export const getUserBookings = async (userId: string, role: 'client' | 'pro', status?: string) => {
  try {
    let query = supabase.from('bookings').select('*');

    if (role === 'client') {
      query = query.eq('client_id', userId);
    } else {
      query = query.eq('professional_id', userId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('scheduled_date', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch bookings');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (bookingId: string, newStatus: string) => {
  try {
    const updateData: any = { status: newStatus };

    if (newStatus === 'in_progress') {
      updateData.started_at = new Date().toISOString();
    } else if (newStatus === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update booking status');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Submit completion photos
 */
export const submitCompletionPhotos = async (bookingId: string, photos: string[], proNotes?: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        completion_photos: photos,
        pro_notes: proNotes || '',
        completed_at: new Date().toISOString(),
        status: 'completed',
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to submit completion');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cancel booking
 */
export const cancelBooking = async (bookingId: string, _cancellationReason: string) => {
  try {
    // Check booking status
    const { data: booking } = await supabase
      .from('bookings')
      .select('status')
      .eq('id', bookingId)
      .single();

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (!['scheduled', 'in_progress'].includes(booking.status)) {
      throw new Error(`Cannot cancel booking with status: ${booking.status}`);
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to cancel booking');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Submit rating after booking completion
 */
export const submitRating = async (
  bookingId: string,
  reviewerId: string,
  rating: number,
  reviewText: string,
  categories?: { communication: number; quality: number; punctuality: number }
) => {
  try {
    // Get booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('client_id, professional_id')
      .eq('id', bookingId)
      .single();

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Determine recipient
    let recipientId: string;
    if (reviewerId === booking.client_id) {
      recipientId = booking.professional_id;
    } else if (reviewerId === booking.professional_id) {
      recipientId = booking.client_id;
    } else {
      throw new Error('Unauthorized: You are not part of this booking');
    }

    // Check if rating already exists
    const { data: existingRating } = await supabase
      .from('ratings')
      .select('id')
      .eq('booking_id', bookingId)
      .eq('reviewer_id', reviewerId)
      .single();

    if (existingRating) {
      throw new Error('You have already rated this booking');
    }

    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const ratingRecord = {
      id: crypto.randomUUID(),
      booking_id: bookingId,
      reviewer_id: reviewerId,
      recipient_id: recipientId,
      rating,
      review_text: reviewText,
      categories: categories || {},
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('ratings')
      .insert([ratingRecord])
      .select()
      .single();

    if (error) {
      throw new Error('Failed to submit rating');
    }

    // Update professional's average rating
    const { data: allRatings } = await supabase
      .from('ratings')
      .select('rating')
      .eq('recipient_id', recipientId);

    if (allRatings && allRatings.length > 0) {
      const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

      await supabase
        .from('professionals')
        .update({
          average_rating: Math.round(avgRating * 10) / 10,
          rating_count: allRatings.length,
        })
        .eq('user_id', recipientId);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get ratings for a professional
 */
export const getProfessionalRatings = async (professionalUserId: string, limit: number = 20) => {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('recipient_id', professionalUserId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error('Failed to fetch ratings');
    }

    return data;
  } catch (error) {
    throw error;
  }
};
