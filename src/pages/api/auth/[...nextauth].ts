import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth, { AuthOptions } from 'next-auth';
import { LoginData } from '@/pages/signup-login';
import { login } from '@/api/login';
import { authOptions } from '../../../../auth.config';

export const authOptionss = {
  ...authOptions,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as LoginData;
        const token = await login({ email, password });

        if (token.access_token) {
          // Any object returned will be saved in `user` property of the JWT
          return { id: token.access_token, ...token };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          throw Error('Something went wrong while login');
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ]
} satisfies AuthOptions;

export default NextAuth(authOptionss);
