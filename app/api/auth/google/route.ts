import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { CodeChallengeMethod, OAuth2Client } from 'google-auth-library';
import { prisma } from '@/libs/prisma';

// import { db } from '@/testing/mocks/db';

export async function GET() {
  try {
    // Initialize OAuth2Client
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_REDIRECT_URI!
    );

    // Generate state
    const state = Math.random().toString(36).substring(2, 15);

    // Generate PKCE code verifier and challenge
    const codeVerifier = Math.random().toString(36).substring(2, 15);
    const codeChallenge = createHash('sha256')
      .update(codeVerifier)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // Store OAuth session in database
    await prisma.oAuthSession.create({
      data: {
        state,
        codeVerifier,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // Generate auth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile'],
      state,
      code_challenge: codeChallenge,
      code_challenge_method: CodeChallengeMethod.S256,
      prompt: 'consent',
    });

    return NextResponse.json({
      success: true,
      authUrl,
      state,
    });
  } catch (error) {
    console.error('Google OAuth initialization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize Google OAuth',
      },
      { status: 500 }
    );
  }
}
