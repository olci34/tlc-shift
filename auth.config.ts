import { AuthOptions } from 'next-auth';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions = {
  callbacks: {
    async jwt({ token, user, trigger }) {
      //TODO: Use trigger 'update', when user changes their data that is stored in jwt to update session data.
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
    async signIn({ user }) {
      if (user) {
        return true;
      } else {
        return `${API_URL}/login`;
      }
    }
  },
  providers: [],
  pages: {
    signIn: '/login'
  }
} satisfies AuthOptions;
