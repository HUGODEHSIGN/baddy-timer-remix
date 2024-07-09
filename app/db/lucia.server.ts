// auth/lucia.server.ts
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';
import { db } from '~/db/drizzle.server';
import { SelectUser, sessionTable, userTable } from '~/db/schemas/user.server';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

// expect error (see next section)
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => ({
    username: attributes.username,
    admin: attributes.admin,
  }),
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<SelectUser, 'id'>;
  }
}
