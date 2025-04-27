import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { createSession, SessionType } from '@/features/auth';
import { JWTPayload } from '@/libs/jwt';
import { prisma } from '@/libs/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code || !state) {
      throw new Error('Missing required parameters');
    }

    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    );

    // Find and validate OAuth session
    const oauthSession = await prisma.oAuthSession.findUnique({
      where: { state },
    });

    if (!oauthSession) {
      throw new Error('Invalid or expired session');
    }

    if (new Date() > oauthSession.expiresAt) {
      await prisma.oAuthSession.delete({
        where: { id: oauthSession.id },
      });
      throw new Error('Session expired');
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken({
      code,
      codeVerifier: oauthSession.codeVerifier,
    });

    // Get user info
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid token payload');
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { googleId: payload.sub },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: payload.sub,
          email: payload.email!,
          name: payload.name,
          picture: payload.picture,
        },
      });
    }

    // Create JWT token and session based on user's 2FA status
    const jwtPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      name: user.name || undefined,
      picture: user.picture || undefined,
      type: user.totpEnabled ? SessionType.VERIFY_2FA : SessionType.SETUP_2FA,
    };

    await createSession(jwtPayload);

    // Delete the OAuth session
    await prisma.oAuthSession.delete({
      where: { id: oauthSession.id },
    });

    // Redirect to 2FA page
    return NextResponse.redirect(new URL('/auth/2fa', request.url));
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(new URL('/auth/login?error=authentication_failed', request.url));
  }
}
