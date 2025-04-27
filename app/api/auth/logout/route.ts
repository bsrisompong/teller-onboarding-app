import { NextResponse } from 'next/server';
import { deleteSession, getSession } from '@/features/auth';

export async function POST() {
  try {
    const session = await getSession();

    if (session) {
      await deleteSession(session.userId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
