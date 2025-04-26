import { jwtVerify, SignJWT } from 'jose';

export interface JWTPayload {
  userId: string;
  email: string;
  name?: string;
  picture?: string;
  type: 'pending-2FA' | 'authenticated';
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const JWT_EXPIRES_IN = '1h';

export const signToken = async (payload: JWTPayload): Promise<string> => {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as unknown as JWTPayload;
};
