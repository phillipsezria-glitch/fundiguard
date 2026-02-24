export interface User {
  id: string;
  phone_number: string;
  email?: string;
  password_hash?: string;
  full_name: string;
  profile_photo_url?: string;
  role: 'client' | 'pro' | 'admin';
  bio?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  verified: boolean;
  id_verified: boolean;
  dci_verified: boolean;
  created_at: string;
}

export interface Professional {
  id: string;
  user_id: string;
  skill_category: string;
  skill_description?: string;
  hourly_rate: number;
  portfolio_url?: string;
  years_experience: number;
  response_time_minutes: number;
  is_available: boolean;
  online_status: boolean;
  subscription_type: 'free' | 'premium' | 'elite';
  total_jobs_completed: number;
  total_earnings: number;
  average_rating: number;
  rating_count: number;
}

export interface AuthRequest {
  phone_number: string;
  password?: string;
  otp_code?: string;
  role?: 'client' | 'pro';
  full_name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_in: number;
}

export interface OTPRequest {
  phone_number: string;
  action: 'register' | 'login' | 'reset';
}

export interface OTPVerifyRequest {
  phone_number: string;
  otp_code: string;
  action: 'register' | 'login' | 'reset';
  full_name?: string;
  role?: 'client' | 'pro';
  password?: string;
}
