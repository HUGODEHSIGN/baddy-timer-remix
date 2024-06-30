import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { Button } from '~/components/ui/button';
import { userAuthenticator } from '~/services/user/userAuth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  return await userAuthenticator.isAuthenticated(request, {
    failureRedirect: $path('/signup'),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  return await userAuthenticator.logout(request, {
    redirectTo: $path('/signup'),
  });
}

export default function Page() {
  const user = useLoaderData<typeof loader>();

  invariant(user, 'User must be defined in the component');

  return (
    <div>
      <p>{user.id}</p>
      <Form method="post">
        <Button type="submit">logout</Button>
      </Form>
    </div>
  );
}
