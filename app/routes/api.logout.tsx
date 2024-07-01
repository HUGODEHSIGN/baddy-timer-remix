import { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/react';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { lucia } from '~/db/lucia.server';
import validateRequest from '~/services/auth/validateRequest.server';

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await validateRequest(request);
  invariant(session, 'Unauthorized');
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();

  return redirect($path('/login'), {
    headers: {
      'Set-Cookie': sessionCookie.serialize(),
    },
  });
}
