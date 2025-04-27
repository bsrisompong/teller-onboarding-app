export interface GoogleAuthResponse {
  success: boolean;
  authUrl: string;
  sessionId: string;
}

export interface GoogleCallbackRequest {
  code: string;
  state: string;
  sessionId: string;
}

export interface GoogleCallbackResponse {
  success: boolean;
  session: {
    id: string;
    userId: string;
    type: 'pending-2FA' | 'full-access';
    token: string;
    expiresAt: string;
    createdAt: string;
  };
  user: {
    id: string;
    googleId: string;
    email: string;
    name: string;
    totpEnabled: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export type TotpGenerateResponse = {
  uri: string;
};

export type TotpVerifyResponse = {
  success: boolean;
};
