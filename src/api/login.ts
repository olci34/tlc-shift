import { LoginData } from '@/pages/signup-login';
import axios, { AxiosError } from 'axios';

export interface Token {
  access_token: string;
  token_type: string;
}

export const login = async (loginData: LoginData) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const url = `${API_URL}/users/login`;
  const formData = new URLSearchParams();
  formData.append('username', loginData.email);
  formData.append('password', loginData.password);

  try {
    const resp = await axios.post<Token>(url, formData.toString());
    return resp.data;
  } catch (ex: AxiosError | any) {
    console.log(`Error occurred when login. Error: ${(ex as AxiosError).message}`);
    throw ex as AxiosError;
  }
};
