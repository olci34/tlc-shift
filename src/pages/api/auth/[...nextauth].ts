import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth, { AuthOptions } from 'next-auth';
import { LoginData } from '@/pages/signup-login';
import { login } from '@/api/login';
import { authConfig } from '../../../../auth.config';

export const authOptions = {
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as LoginData;
        const loginData = await login({ email, password });

        if (loginData.access_token) {
          // Any object returned will be saved in `user` property of the JWT
          return {
            id: loginData.user.id,
            firstName: loginData.user.first_name,
            lastName: loginData.user.last_name,
            accessToken: loginData.access_token,
            tokenType: loginData.token_type
          };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          throw Error('Something went wrong while login');
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ]
} satisfies AuthOptions;

export default NextAuth(authOptions);
