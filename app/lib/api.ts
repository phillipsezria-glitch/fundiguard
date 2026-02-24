// API Client for FundiGuard Backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `API Error: ${response.status}`);
    }

    return response.json();
}

export const api = {
    // Auth endpoints
    auth: {
        register: async (data: {
            phone_number: string;
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
