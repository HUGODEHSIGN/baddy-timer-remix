import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, redirect, useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { Button } from '~/components/ui/button';
import { lucia } from '~/db/lucia.server';
import validateRequest from '~/services/auth/validateRequest.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, user, headers } = await validateRequest(request);

  return json(
    { session, user },
    {
      headers,
    }
  );
}

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

export default function LoggedInPage() {
  const data = useLoaderData<typeof loader>();
  console.log(data.session?.expiresAt);
  return (
    <>
      <div>{data.user?.username}</div>
      <Form method="post">
        <Button type="submit">Sign Out</Button>
      </Form>
    </>
  );
}
