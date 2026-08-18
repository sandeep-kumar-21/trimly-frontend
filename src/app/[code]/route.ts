import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // Reserved frontend app routes to ignore
  const reservedRoutes = [
    'home',
    'links',
    'qrcodes',
    'campaigns',
    'analytics',
    'settings',
    'protected',
    'login',
    'register',
    'api',
    'favicon.ico',
  ];

  if (reservedRoutes.includes(code)) {
    return NextResponse.next();
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  const backendOrigin = apiBase.replace(/\/api\/?$/, '');

  // Redirect to backend short code handler (e.g. http://localhost:4000/3), which logs click & 302 redirects to destination URL
  return NextResponse.redirect(`${backendOrigin}/${code}`, 307);
}
