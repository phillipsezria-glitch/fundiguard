import { supabase } from '../config/supabase';

export interface CreateBidRequest {
  job_id: string;
  professional_id: string;
  proposed_price: number;
  timeline: number; // in days
  proposal: string;
}

export interface Bid {
  id: string;
  job_id: string;
  professional_id: string;
  proposed_price: number;
  timeline: number;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  professional?: {
    id: string;
    full_name: string;
    phone_number: string;
  };
}

class BidService {
  async createBid(data: CreateBidRequest): Promise<Bid> {
    // Validate job exists
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, client_id')
      .eq('id', data.job_id)
      .single();

    if (jobError || !job) {
      throw new Error('Job not found');
    }

    if (job.client_id === data.professional_id) {
      throw new Error('You cannot bid on your own job');
    }

    // Check if professional already bid on this job
    const { data: existingBid } = await supabase
      .from('bids')
      .select('id')
      .eq('job_id', data.job_id)
      .eq('professional_id', data.professional_id)
      .single();

    if (existingBid) {
      throw new Error('You have already submitted a bid for this job');
    }

    // Validate proposed price
    if (!data.proposed_price || data.proposed_price <= 0) {
      throw new Error('Proposed price must be greater than 0');
    }

    // Validate timeline
    if (!data.timeline || data.timeline <= 0) {
      throw new Error('Timeline must be greater than 0 days');
    }

    if (!data.proposal || data.proposal.trim().length === 0) {
      throw new Error('Proposal description is required');
    }

    // Create bid
    const { data: bid, error } = await supabase
      .from('bids')
      .insert([
        {
          job_id: data.job_id,
          professional_id: data.professional_id,
          proposed_price: data.proposed_price,
          timeline: data.timeline,
          proposal: data.proposal,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create bid: ${error.message}`);
    }

    return bid;
  }

  async getBidsForJob(jobId: string): Promise<Bid[]> {
    const { data: bids, error } = await supabase
      .from('bids')
      .select(`
        *,
        professional:professionals(id, full_name, phone_number)
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch bids: ${error.message}`);
    }

    return bids || [];
  }

  async getMyBids(professionalId: string): Promise<Bid[]> {
    const { data: bids, error } = await supabase
      .from('bids')
      .select(`
        *,
        job:jobs(id, title, client_id, budget, status)
      `)
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch bids: ${error.message}`);
    }

    return bids || [];
  }

  async acceptBid(bidId: string, clientId: string): Promise<Bid> {
    // Get the bid
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select('job_id, professional_id')
      .eq('id', bidId)
      .single();

    if (bidError || !bid) {
      throw new Error('Bid not found');
    }

    // Verify client owns the job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('client_id')
      .eq('id', bid.job_id)
      .single();

    if (jobError || !job || job.client_id !== clientId) {
      throw new Error('Unauthorized: You do not own this job');
    }

    // Accept this bid
    const { data: acceptedBid, error: acceptError } = await supabase
      .from('bids')
      .update({ status: 'accepted' })
      .eq('id', bidId)
      .select()
      .single();

    if (acceptError) {
      throw new Error(`Failed to accept bid: ${acceptError.message}`);
    }

    // Reject all other bids for this job
    await supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('job_id', bid.job_id)
      .neq('id', bidId);

    // Update job status to 'in-progress'
    await supabase
      .from('jobs')
      .update({ status: 'in-progress' })
      .eq('id', bid.job_id);

    // Create booking
    await supabase
      .from('bookings')
      .insert([
        {
          job_id: bid.job_id,
          bid_id: bidId,
          client_id: clientId,
          professional_id: bid.professional_id,
          status: 'active',
          start_date: new Date().toISOString(),
        },
      ]);

    return acceptedBid;
  }

  async rejectBid(bidId: string, clientId: string): Promise<Bid> {
    // Get the bid
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select('job_id, professional_id')
      .eq('id', bidId)
      .single();

    if (bidError || !bid) {
      throw new Error('Bid not found');
    }

    // Verify client owns the job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('client_id')
      .eq('id', bid.job_id)
      .single();

    if (jobError || !job || job.client_id !== clientId) {
      throw new Error('Unauthorized: You do not own this job');
    }

    // Reject bid
    const { data: rejectedBid, error: rejectError } = await supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('id', bidId)
      .select()
      .single();

    if (rejectError) {
      throw new Error(`Failed to reject bid: ${rejectError.message}`);
    }

    return rejectedBid;
  }

  async getBidById(bidId: string): Promise<Bid> {
    const { data: bid, error } = await supabase
      .from('bids')
      .select('*')
      .eq('id', bidId)
      .single();

    if (error || !bid) {
      throw new Error('Bid not found');
    }

    return bid;
  }
}

export default new BidService();
