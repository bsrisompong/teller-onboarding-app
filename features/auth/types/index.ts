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
  type: 'pending-2FA' | 'full-access';
  token: string;
  expiresAt: string;
  createdAt: string;
}
