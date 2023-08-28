import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import type { Maybe } from "./lib/database/types"

export const config = {
  matcher: [
    '/api/:path*',
  ],
};

const apiAccessRefusedResponse = (errorMessage = 'access denied') => {
  const payload: Maybe<unknown> = {
    error: errorMessage
  }
  return new NextResponse(JSON.stringify(payload), { status: 403 })
}



function apiMiddleWare(request: NextRequest) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin')

  if (request.method === 'GET') {
    // GET is allowed
    return NextResponse.next()
  }

  if (origin && origin === url.origin) {
    // other methods must be from same origin
    return NextResponse.next()
  }

  return apiAccessRefusedResponse()
}

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api')) {
    return apiMiddleWare(request)
  }

  return NextResponse.next();
}