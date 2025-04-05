import { AuthOptions } from 'next-auth';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authConfig = {
  callbacks: {
    // JWT callback is called whenever a JWT is created (i.e. at sign in)
    // or updated (i.e. when session is accessed in client). The returned value
    // will be encrypted, and it is stored in a cookie.
    async jwt({ token, user, trigger, account }) {
      //TODO: Use trigger 'update', when user changes their data that is stored in jwt to update session data.
      return { ...token, ...user };
    },

    // Session callback is called whenever a session is checked.
    // Client-side calls to getSession() or useSession() will invoke this.
    // This lets you customize what gets returned to your application.
    async session({ session, token, user }) {
      session.user = { ...token } as any;
      return session;
    },

    // SignIn callback is called when an authentication attempt is made.
    // It receives the user profile and credentials.
    // Return true to allow sign in, false to deny, or a URL to redirect to.
    async signIn({ user }) {
      if (user) {
        return true;
      } else {
        return `${API_URL}/signup-login`;
      }
    }
  },
  providers: [],
  pages: {
    signIn: '/login'
  }
} satisfies AuthOptions;
