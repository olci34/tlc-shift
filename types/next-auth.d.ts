import NextAuth from 'next-auth/next';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      accessToken: string;
      tokenType: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
  }
}
