import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    if (token) {
      if (pathname.startsWith('/signup-login')) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return NextResponse.next();
    }

    if (pathname !== '/signup-login') {
      return NextResponse.redirect(new URL('/signup-login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return true;
      }
    }
  }
);

export const config = {
  matcher: ['/signup-login', '/listings/create', '/my-listings']
};
