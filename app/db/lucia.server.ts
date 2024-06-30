// auth/lucia.server.ts
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';
import { db } from '~/db/drizzle.server';
import { SelectUser, session, user } from '~/db/schemas/user.server';

const adapter = new DrizzlePostgreSQLAdapter(db, session, user);

// expect error (see next section)
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => ({ username: attributes.username }),
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<SelectUser, 'id'>;
  }
}
