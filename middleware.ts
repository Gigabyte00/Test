import { withClerkMiddleware, getAuth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function handle(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  const user = await clerkClient.users.getUser(userId);
  if (user.publicMetadata.locked) {
    return NextResponse.redirect(new URL('/sign-in?locked=1', req.url));
  }

  const role = user.publicMetadata.role as string | undefined;
  const path = req.nextUrl.pathname;
  if (path.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (path.startsWith('/vendor') && role !== 'VENDOR') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export default withClerkMiddleware(handle);

export const config = {
  matcher: [
    '/dashboard((?!/api).*)',
    '/admin((?!/api).*)',
    '/vendor((?!/api).*)'
  ]
};
