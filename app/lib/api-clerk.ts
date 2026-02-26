// Clerk-based API Client for FundiGuard Backend
import { useAuth } from "@clerk/nextjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "client" | "pro";
  phone?: string;
  created_at: string;
}

export interface JobData {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  status: string;
  created_at: string;
}

export interface JobsResponse {
  jobs: JobData[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * Make API call with Clerk JWT authentication
 * Automatically includes Bearer token in Authorization header
 */
export async function apiFetch<T>(
  endpoint: string,
  getToken: () => Promise<string | null>,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}/api${endpoint}`;
  
  const token = await getToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers as Record<string, string>,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `API Error: ${response.statusText}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  } catch (error: any) {
    console.error(`API Error: ${endpoint}`, error);
    throw error;
  }
}

// ==================== AUTH ENDPOINTS ====================

export async function syncClerkUser(token: string, role: "client" | "pro") {
  const response = await fetch(`${API_URL}/api/users/sync-clerk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to sync user");
  }

  return response.json();
}

// ==================== JOB ENDPOINTS ====================

export async function createJob(
  getToken: () => Promise<string | null>,
  jobData: Partial<JobData>
) {
  return apiFetch("/jobs", getToken, {
    method: "POST",
    body: JSON.stringify(jobData),
  });
}

export async function getJobs(
  getToken: () => Promise<string | null>,
  filters?: { category?: string; status?: string; page?: number }
) {
  const params = new URLSearchParams();
  if (filters?.category) params.append("category", filters.category);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.page) params.append("page", filters.page.toString());

  return apiFetch<JobsResponse>(
    `/jobs?${params.toString()}`,
    getToken
  );
}

export async function getJob(
  getToken: () => Promise<string | null>,
  jobId: string
) {
  return apiFetch(`/jobs/${jobId}`, getToken);
}

export async function updateJob(
  getToken: () => Promise<string | null>,
  jobId: string,
  updates: Partial<JobData>
) {
  return apiFetch(`/jobs/${jobId}`, getToken, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// ==================== PROFESSIONAL ENDPOINTS ====================

export async function getProfessional(
  getToken: () => Promise<string | null>,
  proId: string
) {
  return apiFetch(`/professionals/${proId}`, getToken);
}

export async function updateProfessionalProfile(
  getToken: () => Promise<string | null>,
  profileData: any
) {
  return apiFetch("/professionals/profile", getToken, {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}

// ==================== BID ENDPOINTS ====================

export async function createBid(
  getToken: () => Promise<string | null>,
  jobId: string,
  amount: number,
  message: string
) {
  return apiFetch("/bids", getToken, {
    method: "POST",
    body: JSON.stringify({ job_id: jobId, amount, message }),
  });
}

export async function getBids(
  getToken: () => Promise<string | null>,
  jobId?: string
) {
  const endpoint = jobId ? `/bids?job_id=${jobId}` : "/bids";
  return apiFetch(endpoint, getToken);
}

// ==================== BOOKING ENDPOINTS ====================

export async function createBooking(
  getToken: () => Promise<string | null>,
  bidId: string
) {
  return apiFetch("/bookings", getToken, {
    method: "POST",
    body: JSON.stringify({ bid_id: bidId }),
  });
}

export async function getBookings(
  getToken: () => Promise<string | null>,
  status?: string
) {
  const endpoint = status ? `/bookings?status=${status}` : "/bookings";
  return apiFetch(endpoint, getToken);
}

// ==================== PAYMENT ENDPOINTS ====================

export async function initiatePayment(
  getToken: () => Promise<string | null>,
  bookingId: string,
  amount: number
) {
  return apiFetch("/payments/initiate", getToken, {
    method: "POST",
    body: JSON.stringify({ booking_id: bookingId, amount }),
  });
}

// ==================== USER ENDPOINTS ====================

export async function getUserProfile(
  getToken: () => Promise<string | null>
) {
  return apiFetch("/users/profile", getToken);
}

export async function updateUserProfile(
  getToken: () => Promise<string | null>,
  profileData: Partial<AuthUser>
) {
  return apiFetch("/users/profile", getToken, {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}
