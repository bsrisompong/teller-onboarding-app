import { SignJWT } from 'jose';
import { authenticator } from 'otplib';
import { JWT_SECRET } from '@/libs/jwt';

// Configure TOTP settings
authenticator.options = {
  window: 1, // Allow codes from previous/next 30-second window
  step: 30, // 30-second time step
};

export interface TOTPSecret {
  secret: string;
  uri: string;
}

export function generateTOTPSecret(email: string): TOTPSecret {
  const secret = authenticator.generateSecret();
  const uri = authenticator.keyuri(email, 'Teller Onboarding App', secret);

  return {
    secret,
    uri,
  };
}

export function verifyTOTPCode(secret: string, token: string): boolean {
  return authenticator.verify({ token, secret });
}

export async function generateTOTPJWT(email: string, secret: string) {
  const token = await new SignJWT({
    email,
    secret,
    type: 'totp-setup',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m') // Short expiration for setup
    .sign(JWT_SECRET);

  return token;
}
