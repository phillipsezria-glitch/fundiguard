import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook to protect routes that require authentication
 * Redirects to /auth if no token is found in localStorage
 * Usage: Call at the start of useEffect in protected pages
 */
export function useAuthProtected() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth');
    }
  }, [router]);
}

/**
 * Get auth token and user from localStorage
 * Returns null if not authenticated
 */
export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}
