import { User } from '@/features/auth';
import { db } from './db';

export const createUser = (user: User) => {
  db.user.create(user);
};
