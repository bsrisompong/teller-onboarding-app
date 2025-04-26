'use server';

import { cookies } from 'next/headers';
import { JWTPayload, signToken, verifyToken } from '@/libs/jwt';

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifyToken(token);
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  // Set cookie with empty value and immediate expiration
  cookieStore.set('token', '', {
    expires: new Date(0),
    path: '/',
  });
}

export async function createSession(payload: JWTPayload) {
  const token = await signToken(payload);
  const cookieStore = await cookies();

  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return token;
}
