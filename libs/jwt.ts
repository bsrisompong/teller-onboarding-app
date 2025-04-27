import { jwtVerify, SignJWT } from 'jose';
import { SessionType, TOKEN_EXPIRES_IN } from '@/features/auth/types';

export interface JWTPayload {
  userId: string;
  email: string;
  name?: string;
  picture?: string;
  type: SessionType;
  exp?: number; // JWT expiration timestamp
}

export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export const signToken = async (payload: JWTPayload): Promise<string> => {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(TOKEN_EXPIRES_IN[payload.type])
    .sign(JWT_SECRET);
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as unknown as JWTPayload;
};
