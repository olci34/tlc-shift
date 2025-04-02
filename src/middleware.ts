import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const token = await getToken({ req });
    if (token) {
      if (req.nextUrl.pathname.startsWith('/signup-login')) {
        return NextResponse.redirect(new URL('/', req.url));
      }

      return NextResponse.next();
    }
    return null;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        //NOTE: We can bring role based authorization logic here.
        if (req.nextUrl.pathname.startsWith('/signup-login')) {
          return true;
        }

        return !!token;
      }
    }
  }
);

export const config = {
  matcher: ['/signup-login']
};
