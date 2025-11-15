import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Check if a JWT token is expired based on the 'exp' claim
 */
const isTokenExpired = (token: any): boolean => {
  if (!token || !token.exp) {
    return false;
  }

  // JWT exp claim is in seconds, Date.now() is in milliseconds
  const currentTime = Date.now() / 1000;
  return token.exp < currentTime;
};

apiClient.interceptors.request.use(async (request) => {
  const session = await getSession();

  if (session) {
    // Check if the token is expired
    if (isTokenExpired(session.user)) {
      console.log('Token expired. Signing out and redirecting to login...');

      // Sign out and redirect to login page
      signOut({ callbackUrl: '/signup-login' });

      // Reject the request to prevent it from being sent
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }

    // Token is still valid, add it to the request
    if (session.user?.accessToken) {
      const authHeader = `${session.user.tokenType} ${session.user.accessToken}`;
      request.headers.Authorization = authHeader;
    }
  }

  // Remove Content-Type header for FormData requests to let browser set it with boundary
  if (request.data instanceof FormData) {
    delete request.headers['Content-Type'];
  }

  return request;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(new Error(error.response?.data?.detail || 'An error occurred'));
  }
);

export default apiClient;
