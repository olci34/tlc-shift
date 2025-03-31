import axios from 'axios';
import { getSession } from 'next-auth/react';

const ApiClient = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const instance = axios.create();

  instance.interceptors.request.use(async (request) => {
    const session = await getSession();

    if (session && session.user) {
      request.headers.Authorization = `${session.tokenType} ${session.accessToken}`;
    }

    request.baseURL = API_URL;
    request.headers['Content-Type'] = 'application/json';
    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(`error`, error);
      throw new Error(error.response.data.message);
    }
  );

  return instance;
};

export default ApiClient();
