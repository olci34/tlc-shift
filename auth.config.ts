import { AuthOptions } from 'next-auth';
import axios from 'axios';
import { getVisitorIdSafe } from './src/lib/utils/visitor-id';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const authConfig = {
  callbacks: {
    // JWT callback is called whenever a JWT is created (i.e. at sign in)
    // or updated (i.e. when session is accessed in client). The returned value
    // will be encrypted, and it is stored in a cookie.
    async jwt({ token, user, trigger, account }) {
      //TODO: Use trigger 'update', when user changes their data that is stored in jwt to update session data.

      // Handle Google OAuth sign in
      if (account?.provider === 'google' && user) {
        try {
          // Extract name from Google profile
          const nameParts = user.name?.split(' ') || [];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          // Get visitor ID
          const visitorId = getVisitorIdSafe();

          // Persist Google user to backend database and get access token
          const response = await axios.post(
            `${API_URL}/users/google-auth`,
            {
              email: user.email,
              first_name: firstName,
              last_name: lastName,
              google_id: user.id,
              visitor_id: visitorId
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          const { user: backendUser, access_token, token_type } = response.data;

          // Return JWT with backend user data and access token
          return {
            ...token,
            id: backendUser.id,
            email: backendUser.email,
            firstName: backendUser.first_name,
            lastName: backendUser.last_name,
            accessToken: access_token,
            tokenType: token_type,
            provider: 'google'
          };
        } catch (error) {
          console.error('Failed to persist Google user to backend:', error);
          // If backend call fails, still allow frontend auth but log the error
          const nameParts = user.name?.split(' ') || [];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          return {
            ...token,
            id: user.id,
            email: user.email,
            firstName,
            lastName,
            provider: 'google',
            error: 'backend_sync_failed'
          };
        }
      }

      // Handle credentials sign in
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
    signIn: '/signup-login'
  }
} satisfies AuthOptions;
