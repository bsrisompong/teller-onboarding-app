import { factory, primaryKey } from '@mswjs/data';
import { v4 as uuidv4 } from 'uuid';

// import { Session, User } from '@/features/auth/types';

const models = {
  user: {
    id: primaryKey(uuidv4),
    googleId: String,
    email: String,
    name: String,
    totpSecret: String,
    totpEnabled: Boolean,
    createdAt: () => new Date().toISOString(),
    updatedAt: () => new Date().toISOString(),
  },
  session: {
    id: primaryKey(uuidv4),
    userId: String,
    type: String,
    token: String,
    expiresAt: String,
    createdAt: () => new Date().toISOString(),
  },
};

export const db = factory(models);
