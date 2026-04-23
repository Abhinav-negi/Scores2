import { NextResponse } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth/jwt';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = await verifyTokenEdge(token);

    if (!payload) {
      // Invalid or expired token
      const response = NextResponse.json({ user: null }, { status: 401 });
      response.cookies.delete('token');
      return response;
    }

    return NextResponse.json(
      { user: { id: payload.userId, email: payload.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
