import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import {
  COOKIE_NAMES,
  createSession,
  deleteSession,
  SessionType,
  verifyTOTPCode,
} from '@/features/auth';
//
import { JWT_SECRET, signToken } from '@/libs/jwt';
import { prisma } from '@/libs/prisma';

// Calculate expiration date based on duration string
const calculateExpirationDate = (duration: string): Date => {
  const [value, unit] = duration.match(/(\d+)([mhd])/)?.slice(1) || [];

  if (!value || !unit) {
    throw new Error('Invalid duration format');
  }

  const numValue = parseInt(value, 10);

  switch (unit) {
    case 'm':
      return dayjs().add(numValue, 'minute').toDate();
    case 'h':
      return dayjs().add(numValue, 'hour').toDate();
    case 'd':
      return dayjs().add(numValue, 'day').toDate();
    default:
      throw new Error('Invalid duration unit');
  }
};

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    // Get the session token from cookies
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(COOKIE_NAMES.SESSION)?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No session token found' }, { status: 401 });
    }

    // Verify the session token
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Invalid session token' }, { status: 401 });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: payload.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let isValid: boolean;
    let secret: string;

    if (payload.type === 'setup-2FA') {
      // First-time verification
      const twoFAToken = cookieStore.get(COOKIE_NAMES.TWO_FA_SESSION)?.value;
      if (!twoFAToken) {
        return NextResponse.json({ error: 'No TOTP setup token found' }, { status: 400 });
      }

      const { payload: twoFAPayload } = await jwtVerify(twoFAToken, JWT_SECRET);
      if (!twoFAPayload || !twoFAPayload.secret) {
        return NextResponse.json({ error: 'Invalid TOTP setup token' }, { status: 400 });
      }

      secret = twoFAPayload.secret as string;
      isValid = verifyTOTPCode(secret, code);

      if (isValid) {
        // Update user's TOTP status
        await prisma.user.update({
          where: { email: user.email },
          data: {
            totpEnabled: true,
            totpSecret: secret,
          },
        });
      }
    } else if (payload.type === 'verify-2FA') {
      // Returning user verification
      if (!user.totpEnabled || !user.totpSecret) {
        return NextResponse.json({ error: '2FA not enabled' }, { status: 400 });
      }

      secret = user.totpSecret;
      isValid = verifyTOTPCode(secret, code);
    } else {
      return NextResponse.json({ error: 'Invalid session type' }, { status: 400 });
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }

    // Create a full-access session
    const jwtPayload = {
      userId: user.id,
      email: user.email,
      name: user.name || undefined,
      picture: user.picture || undefined,
      type: 'full-access' as SessionType,
    };

    // Create session in database
    await prisma.session.create({
      data: {
        userId: user.id,
        token: await signToken(jwtPayload),
        type: 'full-access',
        expiresAt: calculateExpirationDate('7d'),
      },
    });

    // Create new session and clear TOTP session if it exists
    await createSession(jwtPayload);
    await deleteSession(COOKIE_NAMES.TWO_FA_SESSION);

    return NextResponse.json({
      success: true,
      redirectTo: '/',
    });
  } catch (error) {
    console.error('TOTP verification error:', error);
    return NextResponse.json({ error: 'Failed to verify TOTP code' }, { status: 500 });
  }
}
