export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  totpSecret?: string;
  totpEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  type: SessionType;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export enum SessionType {
  SETUP_2FA = 'setup-2FA',
  VERIFY_2FA = 'verify-2FA',
  FULL_ACCESS = 'full-access',
}

export const TOKEN_EXPIRES_IN = {
  [SessionType.SETUP_2FA]: '5m', // 5 minutes for TOTP setup
  [SessionType.VERIFY_2FA]: '5m', // 5 minutes for 2FA verification
  [SessionType.FULL_ACCESS]: '7d', // 7 days for session
} as const;

export const COOKIE_NAMES = {
  SESSION: 'tob_session', // tob = teller onboarding
  TWO_FA_SESSION: 'tob_2fa_session',
} as const;

export type CookieName = (typeof COOKIE_NAMES)[keyof typeof COOKIE_NAMES];

export const COOKIE_OPTIONS = {
  HTTP_ONLY: true,
  SECURE: process.env.NODE_ENV === 'production',
  SAME_SITE: 'lax' as const,
  PATH: '/',
  MAX_AGE: 60 * 60 * 24 * 7, // 7 days
} as const;

export * from './api';
