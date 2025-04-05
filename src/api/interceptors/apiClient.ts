import axios from 'axios';
import { Session } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(async (request) => {
  const session = await getSession();
  if (session && session.user?.accessToken) {
    request.headers.Authorization = `${session.user.tokenType} ${session.user.accessToken}`;
  }

  return request;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(`error`, error);
    return Promise.reject(new Error(error.response?.data?.message || 'An error occurred'));
  }
);

export default apiClient;
