import { SignupData } from '@/pages/signup-login';
import apiClient from './interceptors/apiClient';
import { AxiosError } from 'axios';

export const signup = async (data: SignupData) => {
  const body = {
    email: data.email,
    password: data.password,
    first_name: data.firstName,
    last_name: data.lastName
  };

  try {
    const resp = await apiClient.post<boolean>(`/users/signup`, body);

    return resp.data;
  } catch (err: AxiosError | any) {
    console.log(`Singup error: ${err.message}`);
    throw err;
  }
};
