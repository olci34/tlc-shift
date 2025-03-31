import { LoginData } from '@/pages/signup-login';
import { AxiosError } from 'axios';
import apiClient from './interceptors/apiClient';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse extends Token {
  user: User;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export const login = async (loginData: LoginData) => {
  const url = `/users/login`;
  const formData = new URLSearchParams();
  formData.append('username', loginData.email);
  formData.append('password', loginData.password);

  try {
    const resp = await apiClient.post<LoginResponse>(url, formData.toString());
    return resp.data;
  } catch (ex: AxiosError | any) {
    console.log(`Error occurred when login. Error: ${(ex as AxiosError).message}`);
    throw ex as AxiosError;
  }
};
