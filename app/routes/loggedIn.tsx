import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { Button } from '~/components/ui/button';
import { authenticator } from '~/services/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const user = await authenticator.isAuthenticated(request, {
      failureRedirect: '/login',
    });

    invariant(user, 'User must be defined in the loader');

    return user;
  } catch (err) {
    console.error(err);
  }
}

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.logout(request, { redirectTo: '/login' });
}

export default function Page() {
  const user = useLoaderData<typeof loader>();

  invariant(user, 'User must be defined in the component');

  return (
    <div>
      <p>{user.id}</p>
      <p>{user.name}</p>
      <p>{user.locationId}</p>
      <Form method="post">
        <Button type="submit">logout</Button>
      </Form>
    </div>
  );
}
