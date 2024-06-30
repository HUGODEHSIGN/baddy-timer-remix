import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { Button } from '~/components/ui/button';
import { adminAuthenticator } from '~/services/admin/adminAuth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  return await adminAuthenticator.isAuthenticated(request, {
    failureRedirect: $path('/admin/signup'),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  return await adminAuthenticator.logout(request, {
    redirectTo: $path('/admin/login'),
  });
}

export default function Page() {
  const admin = useLoaderData<typeof loader>();

  invariant(admin, 'Admin must be defined in the component');

  return (
    <div>
      <p>{admin.id}</p>
      <Form method="post">
        <Button type="submit">Logout</Button>
      </Form>
    </div>
  );
}
