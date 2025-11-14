import { SignupData } from '@/pages/signup-login';
import apiClient from './interceptors/apiClient';
import { AxiosError } from 'axios';
import { getVisitorIdSafe } from '@/lib/utils/visitor-id';

export const signup = async (data: SignupData) => {
  // Get existing visitor_id that was created on app load
  const visitorId = getVisitorIdSafe();

  const body = {
    email: data.email,
    password: data.password,
    first_name: data.firstName,
    last_name: data.lastName,
    visitor_id: visitorId
  };

  try {
    const resp = await apiClient.post<boolean>(`/users/signup`, body);

    return resp.data;
  } catch (err: AxiosError | any) {
    console.log(`Singup error: ${err.message}`);
    throw err;
  }
};
