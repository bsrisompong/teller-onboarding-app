import { db } from './db';

export const seedDb = () => {
  db.user.create({
    googleId: '123456789',
    email: 'john.doe@example.com',
    name: 'John Doe',
    totpEnabled: false,
  });

  db.user.create({
    googleId: '987654321',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    totpEnabled: false,
  });
};
