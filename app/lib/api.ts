// API Client for FundiGuard Backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:3001' 
    : 'https://api.fundiguard.ke');

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        phone_number: string;
        full_name: string;
        role: 'client' | 'pro';
        created_at: string;
    };
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

async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_URL}/api${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
            credentials: 'include', // Include cookies for production
        });

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status}`;
            try {
                const error = await response.json();
                errorMessage = error.error || error.message || errorMessage;
            } catch (e) {
                // Response is not JSON
            }
            throw new Error(errorMessage);
        }

        return response.json();
    } catch (error: any) {
        // Handle network/fetch errors
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            console.error('Network error - API unreachable:', url);
            throw new Error(
                `Unable to connect to server. Please check your internet connection. ` +
                `(Trying to reach: ${API_URL})`
            );
        }
        throw error;
    }
}

export const api = {
    // Auth endpoints
    auth: {
        register: async (data: {
            phone_number: string;
            email: string;
            password: string;
            full_name: string;
            role: 'client' | 'pro';
        }) => apiCall<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

        login: async (data: {
            phone_number: string;
            password: string;
        }) => apiCall<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

        requestOTP: async (data: {
            phone_number: string;
            action: 'login' | 'register';
        }) => apiCall<{ message: string; debug?: string }>('/auth/request-otp', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

        verifyOTP: async (data: {
            phone_number: string;
            otp_code: string;
            action: 'login' | 'register';
            full_name?: string;
            email?: string;
            role?: 'client' | 'pro';
        }) => apiCall<AuthResponse>('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    },

    // Jobs endpoints
    jobs: {
        list: async (token: string, page = 1, limit = 10) =>
            apiCall<JobsResponse>(`/jobs?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),

        create: async (token: string, data: {
            title: string;
            description: string;
            category: string;
            budget: number;
            location: string;
            urgency: string;
        }) => apiCall<JobData>('/jobs', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }),

        getById: async (token: string, jobId: string) =>
            apiCall<JobData>(`/jobs/${jobId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
    },

    // Bids endpoints
    bids: {
        create: async (token: string, data: {
            job_id: string;
            proposed_price: number;
            timeline: number;
            proposal: string;
        }) => apiCall<any>('/bids', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }),

        getForJob: async (jobId: string) =>
            apiCall<any[]>(`/bids?job_id=${jobId}`, {
                method: 'GET',
            }),

        getMyBids: async (token: string) =>
            apiCall<any[]>('/bids/my-bids', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),

        accept: async (token: string, bidId: string) =>
            apiCall<any>('/bids/accept', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ bid_id: bidId }),
            }),

        reject: async (token: string, bidId: string) =>
            apiCall<any>('/bids/reject', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ bid_id: bidId }),
            }),
    },

    // Bookings endpoints
    bookings: {
        submitCompletion: async (token: string, bookingId: string, data: {
            completion_photos: string[];
            pro_notes?: string;
        }) => apiCall<any>(`/bookings/${bookingId}/completion`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }),
    },

    // Upload endpoints
    upload: {
        single: async (token: string, file: File) => {
            const formData = new FormData();
            formData.append('file', file);

            const url = `${API_URL}/api/upload`;
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                    credentials: 'include',
                });

                if (!response.ok) {
                    let errorMessage = `Upload failed: ${response.status}`;
                    try {
                        const error = await response.json();
                        errorMessage = error.error || errorMessage;
                    } catch (e) {
                        // Response is not JSON
                    }
                    throw new Error(errorMessage);
                }

                return response.json() as Promise<{ url: string; path: string }>;
            } catch (error: any) {
                if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                    throw new Error('Unable to upload file. Please check your internet connection.');
                }
                throw error;
            }
        },

        batch: async (token: string, files: File[]) => {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });

            const url = `${API_URL}/api/upload/batch`;
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                    credentials: 'include',
                });

                if (!response.ok) {
                    let errorMessage = `Batch upload failed: ${response.status}`;
                    try {
                        const error = await response.json();
                        errorMessage = error.error || errorMessage;
                    } catch (e) {
                        // Response is not JSON
                    }
                    throw new Error(errorMessage);
                }

                return response.json() as Promise<{ urls: string[]; files: Array<{ url: string; path: string }> }>;
            } catch (error: any) {
                if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                    throw new Error('Unable to upload files. Please check your internet connection.');
                }
                throw error;
            }
        },

        delete: async (token: string, path: string) =>
            apiCall<{ message: string }>('/upload', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ path }),
            }),
    },

    // User endpoints
    users: {
        getProfile: async (token: string) =>
            apiCall<any>('/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
    },
};

// Storage helpers for auth token
export const auth = {
    setToken: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', token);
        }
    },

    getToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    },

    removeToken: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
        }
    },

    setUser: (user: any) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
        }
    },

    getUser: () => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    clearAuth: () => {
        auth.removeToken();
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
    },
};
