// app/services/auth.server.ts
import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import invariant from 'tiny-invariant';
import { db } from '~/db/drizzle.server';
import { InsertUser, user } from '~/db/schemas/user';
import { sessionStorage } from '~/services/session.server';

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session

export const authenticator = new Authenticator<InsertUser>(sessionStorage);

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    console.log(form);
    const name = form.get('name')!.toString();
    const locationId = form.get('locationId')!.toString();
    const phone = form.get('phone')!.toString();
    const userData = { name, locationId, phone: phone ? phone : null };
    // the type of this user must match the type you pass to the Authenticator
    const newUser = await db
      .insert(user)
      .values(userData)
      .returning({ id: user.id, name: user.name, locationId: user.locationId });

    invariant(newUser, 'Failed to insert new user');

    return newUser[0];
  }),
  // each strategy has a name and can be changed to use another one
  'user'
);
