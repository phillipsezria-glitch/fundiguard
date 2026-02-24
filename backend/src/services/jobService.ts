import { supabase } from '../config/supabase';

export interface CreateJobInput {
  client_id: string;
  title: string;
  category: string;
  description: string;
  budget: number;
  urgency?: 'normal' | 'urgent';
  location: string;
  latitude?: number;
  longitude?: number;
  photos?: string[];
  proposed_job_date?: string;
}

export interface JobFilter {
  category?: string;
  location?: string;
  status?: string;
  urgency?: string;
  budget_min?: number;
  budget_max?: number;
  latitude?: number;
  longitude?: number;
  search?: string;
}

/**
 * Create a new job posting
 */
export const createJob = async (input: CreateJobInput) => {
  try {
    const jobId = crypto.randomUUID();

    const job = {
      id: jobId,
      client_id: input.client_id,
      title: input.title,
      category: input.category,
      description: input.description,
      budget: input.budget,
      urgency: input.urgency || 'normal',
      location: input.location,
      latitude: input.latitude,
      longitude: input.longitude,
      status: 'open',
      photos: input.photos || [],
      proposed_job_date: input.proposed_job_date,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert([job])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create job: ${error.message}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get job by ID with full details
 */
export const getJobById = async (jobId: string) => {
  try {
    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      throw new Error('Job not found');
    }

    // Get bids count
    const { count: bidsCount } = await supabase
      .from('bids')
      .select('*', { count: 'exact', head: true })
      .eq('job_id', jobId)
      .eq('status', 'pending');

    // Get client info
    const { data: client } = await supabase
      .from('users')
      .select('id, full_name, profile_photo_url, verified')
      .eq('id', job.client_id)
      .single();

    return {
      ...job,
      bids_count: bidsCount || 0,
      client,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * List jobs with filters and pagination
 */
export const listJobs = async (filters: JobFilter, page: number = 1, limit: number = 10) => {
  try {
    let query = supabase.from('jobs').select('*', { count: 'exact' });

    // Apply filters
    if (filters.category && filters.category !== 'All') {
      query = query.ilike('category', `%${filters.category}%`);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    } else {
      query = query.eq('status', 'open'); // Default: only open jobs
    }

    if (filters.urgency) {
      query = query.eq('urgency', filters.urgency);
    }

    if (filters.budget_min !== undefined) {
      query = query.gte('budget', filters.budget_min);
    }

    if (filters.budget_max !== undefined) {
      query = query.lte('budget', filters.budget_max);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Sort by created_at descending (newest first)
    query = query.order('created_at', { ascending: false });

    // Pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: jobs, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch jobs: ${error.message}`);
    }

    return {
      jobs,
      total: count || 0,
      page,
      limit,
      pages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get jobs by category (for browse page)
 */
export const getJobsByCategory = async (category: string, limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .ilike('category', `%${category}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error('Failed to fetch jobs');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get jobs by client
 */
export const getJobsByClient = async (clientId: string, status?: string) => {
  try {
    let query = supabase
      .from('jobs')
      .select('*')
      .eq('client_id', clientId);

    if (status) {
      query = query.eq('status', status);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error('Failed to fetch client jobs');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update job status
 */
export const updateJobStatus = async (jobId: string, newStatus: string) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update({ status: newStatus })
      .eq('id', jobId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update job status');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update job details
 */
export const updateJob = async (jobId: string, updates: Partial<CreateJobInput>) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update job');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete job (soft delete - only client before any bids)
 */
export const deleteJob = async (jobId: string, clientId: string) => {
  try {
    // Verify ownership
    const { data: job } = await supabase
      .from('jobs')
      .select('client_id, status')
      .eq('id', jobId)
      .single();

    if (!job || job.client_id !== clientId) {
      throw new Error('Unauthorized: You do not own this job');
    }

    if (job.status !== 'open') {
      throw new Error('Can only delete jobs in "open" status');
    }

    // Check if any bids exist
    const { count: bidsCount } = await supabase
      .from('bids')
      .select('*', { count: 'exact', head: true })
      .eq('job_id', jobId);

    if (bidsCount && bidsCount > 0) {
      throw new Error('Cannot delete job with existing bids');
    }

    // Mark as cancelled
    const { data, error } = await supabase
      .from('jobs')
      .update({ status: 'cancelled' })
      .eq('id', jobId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to delete job');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get nearby jobs (within radius)
 */
export const getNearbyJobs = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 10,
  limit: number = 10
) => {
  try {
    // Simple distance calculation (not super accurate but good for MVP)
    // 1 degree ≈ 111 km
    const latRange = radiusKm / 111;
    const lngRange = radiusKm / (111 * Math.cos(latitude * (Math.PI / 180)));

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .gte('latitude', latitude - latRange)
      .lte('latitude', latitude + latRange)
      .gte('longitude', longitude - lngRange)
      .lte('longitude', longitude + lngRange)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error('Failed to fetch nearby jobs');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Search jobs with full text search
 */
export const searchJobs = async (query: string, limit: number = 20) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error('Search failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get trending jobs (most recent and most bids)
 */
export const getTrendingJobs = async (days: number = 7, limit: number = 10) => {
  try {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    // Get jobs with bid counts
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select(
        `*,
        bids:bids(count)`
      )
      .eq('status', 'open')
      .gte('created_at', dateThreshold.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error('Failed to fetch trending jobs');
    }

    return jobs;
  } catch (error) {
    throw error;
  }
};
