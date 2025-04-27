'use server';

import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import { COOKIE_NAMES } from '@/features/auth/types';
import { JWTPayload, signToken, verifyToken } from '@/libs/jwt';

function isTokenExpired(exp?: number): boolean {
  if (!exp) {
    return true;
  }
  return dayjs.unix(exp).isBefore(dayjs());
}

export async function getSession(
  cookieName: string = COOKIE_NAMES.SESSION
): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token);

    // Check if token is expired
    if (isTokenExpired(payload.exp)) {
      // Delete expired token
      await deleteSession(cookieName);
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Error verifying token:', error);
    // Delete invalid token
    await deleteSession(cookieName);
    return null;
  }
}

export async function deleteSession(cookieName: string = COOKIE_NAMES.SESSION) {
  const cookieStore = await cookies();
  // Set cookie with empty value and immediate expiration
  cookieStore.set(cookieName, '', {
    expires: new Date(0),
    path: '/',
  });
}

export async function createSession(
  payload: JWTPayload,
  cookieName: string = COOKIE_NAMES.SESSION
) {
  const token = await signToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return token;
}
