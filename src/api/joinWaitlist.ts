import apiClient from './interceptors/apiClient';
import { AxiosError } from 'axios';

export interface WaitlistResponse {
  email: string;
  created_at: string;
  updated_at: string;
}

export const joinWaitlist = async (email: string): Promise<WaitlistResponse> => {
  const body = {
    email
  };

  try {
    const resp = await apiClient.post<WaitlistResponse>(`/waitlist/join`, body);

    return resp.data;
  } catch (err: AxiosError | any) {
    console.log(`Join waitlist error: ${err.message}`);
    throw err;
  }
};
