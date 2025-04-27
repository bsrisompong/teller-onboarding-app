import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { COOKIE_NAMES, COOKIE_OPTIONS, generateTOTPSecret, getSession } from '@/features/auth';
import { JWT_SECRET } from '@/libs/jwt';
import { prisma } from '@/libs/prisma';

export async function POST() {
  try {
    // Get and verify the session
    const session = await getSession();
    if (!session || !session.email || session.type !== 'setup-2FA') {
      return NextResponse.json(
        { error: 'Invalid session token or wrong session type' },
        { status: 401 }
      );
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate TOTP secret and URI
    const { secret, uri } = generateTOTPSecret(user.email);

    // Create a TOTP setup token
    const setupToken = await new SignJWT({
      email: user.email,
      secret,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('5m') // 5 minutes for setup
      .sign(JWT_SECRET);

    // Set the TOTP setup cookie
    const response = NextResponse.json({ uri });
    response.cookies.set(COOKIE_NAMES.TWO_FA_SESSION, setupToken, {
      httpOnly: COOKIE_OPTIONS.HTTP_ONLY,
      secure: COOKIE_OPTIONS.SECURE,
      sameSite: COOKIE_OPTIONS.SAME_SITE,
      maxAge: 60 * 5, // 5 minutes
      path: COOKIE_OPTIONS.PATH,
    });

    return response;
  } catch (error) {
    console.error('TOTP generation error:', error);
    return NextResponse.json({ error: 'Failed to generate TOTP' }, { status: 500 });
  }
}
