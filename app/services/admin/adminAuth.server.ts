// app/services/auth.server.ts
import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import invariant from 'tiny-invariant';
import { db } from '~/db/drizzle.server';
import { admin, InsertAdmin } from '~/db/schemas/admin.server';
import { adminSessionStorage } from '~/services/admin/adminSession.server';

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session

type AdminAuthenticator = Pick<InsertAdmin, 'id'>;

export const adminAuthenticator = new Authenticator<AdminAuthenticator>(
  adminSessionStorage
);

// Tell the Authenticator to use the form strategy
adminAuthenticator.use(
  new FormStrategy(async ({ form }) => {
    const firstName = form.get('firstName')!.toString();
    const lastName = form.get('lastName')!.toString();
    const password = form.get('password')!.toString();
    const adminData = { firstName, lastName, password };
    // the type of this user must match the type you pass to the Authenticator
    const newAdmin = await db.insert(admin).values(adminData).returning({
      id: admin.id,
    });

    invariant(newAdmin, 'Failed to insert new admin');

    return newAdmin[0];
  }),
  // each strategy has a name and can be changed to use another one
  'admin'
);
