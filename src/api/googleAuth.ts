import { AxiosError } from 'axios';
import apiClient from './interceptors/apiClient';
import { getVisitorIdSafe } from '@/lib/utils/visitor-id';

export interface GoogleAuthData {
  email: string;
  first_name: string;
  last_name: string;
  google_id: string;
}

export interface GoogleAuthResponse {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  access_token: string;
  token_type: string;
}

/**
 * Authenticate or create a user via Google OAuth
 * This endpoint will either create a new user or return existing user with access token
 */
export const googleAuth = async (data: GoogleAuthData): Promise<GoogleAuthResponse> => {
  // Get existing visitor_id that was created on app load
  const visitorId = getVisitorIdSafe();

  const body = {
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    google_id: data.google_id,
    visitor_id: visitorId
  };

  try {
    const resp = await apiClient.post<GoogleAuthResponse>(`/users/google-auth`, body);
    return resp.data;
  } catch (err: AxiosError | any) {
    console.error(`Google auth error: ${err.message}`);
    throw err;
  }
};
