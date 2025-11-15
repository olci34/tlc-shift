import { getSession } from 'next-auth/react';
import apiClient from './interceptors/apiClient';

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

export const getUserInfo = async () => {
  const session = await getSession();

  if (session?.user?.id) {
    try {
      const resp = await apiClient.get<UserInfo>('/api/users/me');
      return resp.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }
};
