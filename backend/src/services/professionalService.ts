import { supabase } from '../config/supabase';

export interface UpdateProfessionalInput {
  skill_category?: string;
  skill_description?: string;
  hourly_rate?: number;
  portfolio_url?: string;
  years_experience?: number;
  bio?: string;
  is_available?: boolean;
  subscription_type?: 'free' | 'premium' | 'elite';
}

/**
 * Get professional profile by user ID
 */
export const getProfessionalByUserId = async (userId: string) => {
  try {
    // Get user info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw new Error('User not found');
    }

    if (user.role !== 'pro') {
      throw new Error('User is not a professional');
    }

    // Get professional profile
    const { data: professional, error: proError } = await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (proError) {
      throw new Error('Professional profile not found');
    }

    return {
      ...professional,
      user: {
        id: user.id,
        full_name: user.full_name,
        profile_photo_url: user.profile_photo_url,
        phone_number: user.phone_number,
        location: user.location,
        verified: user.verified,
        id_verified: user.id_verified,
        dci_verified: user.dci_verified,
        created_at: user.created_at,
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get professional profile by ID (for public viewing)
 */
export const getProfessionalById = async (professionalId: string) => {
  try {
    const { data: professional, error: proError } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', professionalId)
      .single();

    if (proError || !professional) {
      throw new Error('Professional not found');
    }

    // Get user info
    const { data: user } = await supabase
      .from('users')
      .select('id, full_name, profile_photo_url, phone_number, location, verified, id_verified, dci_verified, created_at')
      .eq('id', professional.user_id)
      .single();

    // Get recent ratings
    const { data: ratings } = await supabase
      .from('ratings')
      .select('*')
      .eq('recipient_id', professional.user_id)
      .order('created_at', { ascending: false })
      .limit(5);

    return {
      ...professional,
      user,
      recent_ratings: ratings || [],
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Update professional profile
 */
export const updateProfessional = async (userId: string, updates: UpdateProfessionalInput) => {
  try {
    // Get professional
    const { data: professional, error: fetchError } = await supabase
      .from('professionals')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (fetchError || !professional) {
      throw new Error('Professional profile not found');
    }

    // Update
    const { data, error } = await supabase
      .from('professionals')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update profile');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update professional availability
 */
export const updateAvailability = async (userId: string, isAvailable: boolean) => {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .update({ is_available: isAvailable })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update availability');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update online status
 */
export const updateOnlineStatus = async (userId: string, isOnline: boolean) => {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .update({ online_status: isOnline, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update online status');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * List professionals with filters
 */
export const listProfessionals = async (
  filters: {
    category?: string;
    location?: string;
    min_rating?: number;
    available_only?: boolean;
    online_only?: boolean;
    verified_only?: boolean;
    search?: string;
  },
  page: number = 1,
  limit: number = 10
) => {
  try {
    let query = supabase
      .from('professionals')
      .select('*', { count: 'exact' });

    if (filters.category) {
      query = query.ilike('skill_category', `%${filters.category}%`);
    }

    if (filters.min_rating) {
      query = query.gte('average_rating', filters.min_rating);
    }

    if (filters.available_only) {
      query = query.eq('is_available', true);
    }

    if (filters.online_only) {
      query = query.eq('online_status', true);
    }

    if (filters.verified_only) {
      // This requires a join with users table
      query = query.eq('users.verified', true);
    }

    // Sort by rating descending
    query = query.order('average_rating', { ascending: false });

    // Pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: professionals, error, count } = await query;

    if (error) {
      throw new Error('Failed to fetch professionals');
    }

    // Get user info for each professional
    const enriched = await Promise.all(
      (professionals || []).map(async (pro) => {
        const { data: user } = await supabase
          .from('users')
          .select('id, full_name, profile_photo_url, location, verified, created_at')
          .eq('id', pro.user_id)
          .single();

        return { ...pro, user };
      })
    );

    return {
      professionals: enriched,
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
 * Get professionals by skill category
 */
export const getProfessionalsByCategory = async (category: string, limit: number = 10) => {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('is_available', true)
      .ilike('skill_category', `%${category}%`)
      .order('average_rating', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error('Failed to fetch professionals');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Search professionals
 */
export const searchProfessionals = async (query: string, limit: number = 20) => {
  try {
    const { data: professionals, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('is_available', true)
      .or(`skill_category.ilike.%${query}%,skill_description.ilike.%${query}%`)
      .order('average_rating', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error('Search failed');
    }

    return professionals;
  } catch (error) {
    throw error;
  }
};

/**
 * Get top professionals (by rating)
 */
export const getTopProfessionals = async (limit: number = 10, minRatings: number = 5) => {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .gte('rating_count', minRatings)
      .eq('is_available', true)
      .order('average_rating', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error('Failed to fetch top professionals');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get professional stats/performance
 */
export const getProfessionalStats = async (userId: string) => {
  try {
    // Get professional profile
    const { data: professional } = await supabase
      .from('professionals')
      .select('total_jobs_completed, total_earnings, average_rating, rating_count')
      .eq('user_id', userId)
      .single();

    if (!professional) {
      throw new Error('Professional not found');
    }

    // Get recent jobs
    const { data: recentJobs } = await supabase
      .from('bookings')
      .select('*')
      .eq('professional_id', userId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(5);

    // Get upcoming jobs
    const { data: upcomingJobs } = await supabase
      .from('bookings')
      .select('*')
      .eq('professional_id', userId)
      .neq('status', 'completed')
      .neq('status', 'cancelled')
      .order('scheduled_date', { ascending: true })
      .limit(5);

    return {
      ...professional,
      recent_jobs: recentJobs || [],
      upcoming_jobs: upcomingJobs || [],
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get professional earnings/payment history
 */
export const getProfessionalEarnings = async (userId: string, limit: number = 50) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .eq('payment_type', 'earning')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error('Failed to fetch earnings');
    }

    // Calculate totals
    const total = data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    const pending = data?.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    const completed = data?.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    return {
      transactions: data,
      totals: { total, pending, completed },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Upgrade professional subscription
 */
export const upgradeProfessionalSubscription = async (userId: string, subscriptionType: 'free' | 'premium' | 'elite') => {
  try {
    // In production, verify payment was made first

    const { data, error } = await supabase
      .from('professionals')
      .update({ subscription_type: subscriptionType })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to upgrade subscription');
    }

    return data;
  } catch (error) {
    throw error;
  }
};
