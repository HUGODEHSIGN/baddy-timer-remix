import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { eq } from 'drizzle-orm';
import { $path } from 'remix-routes';
import { db } from '~/db/drizzle.server';
import { lucia } from '~/db/lucia.server';
import { user as userTable } from '~/db/schemas/user.server';
import validateRequest from '~/services/auth/validateRequest.server';

export async function action({ request }: ActionFunctionArgs) {
  const { user } = await validateRequest(request);

  if (!user) throw redirect($path('/login'));

  const result = await db.delete(userTable).where(eq(userTable.id, user.id));
  if (result.rowCount === 0) console.log('Do something here');
  // TODO: add error handling
  const headers = new Headers();

  const sessionCookie = lucia.createBlankSessionCookie();
  headers.append('Set-Cookie', sessionCookie.serialize());

  return redirect($path('/signup'), { headers });
}
