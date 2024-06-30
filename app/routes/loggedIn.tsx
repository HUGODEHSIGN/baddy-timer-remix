import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { lucia } from '~/db/lucia.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = lucia.readSessionCookie(request.headers.get('Cookie')!);

  invariant(cookie, 'Session cookie not found');

  const session = await lucia.validateSession(cookie);
  return session;
}

export default function LoggedInPage() {
  const data = useLoaderData<typeof loader>();
  return <div>{data.user?.username}</div>;
}
