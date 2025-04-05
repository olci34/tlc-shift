import { LoginData } from '@/pages/signup-login';
import { AxiosError } from 'axios';
import apiClient from './interceptors/apiClient';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
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

  try {
    const resp = await apiClient.post<LoginResponse>(url, loginData);
    return resp.data;
  } catch (ex: AxiosError | any) {
    console.log(`Error occurred when login. Error: ${(ex as AxiosError).message}`);
    throw ex as AxiosError;
  }
};
