import { SignupData } from '@/pages/signup-login';
import axios, { AxiosError } from 'axios';

export const signup = async (data: SignupData) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const body = {
    email: data.email,
    password: data.password,
    first_name: data.firstName,
    last_name: data.lastName
  };

  try {
    const resp = await axios.post<boolean>(`${API_URL}/users/signup`, body);

    return resp.data;
  } catch (err: AxiosError | any) {
    console.log(`Singup error: ${err.message}`);
    throw err;
  }
};
