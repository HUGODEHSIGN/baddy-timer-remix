import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { adminAuthenticator } from '~/services/admin/adminAuth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  return await adminAuthenticator.isAuthenticated(request, {
    failureRedirect: $path('/admin/signup'),
  });
}

export default function Page() {
  const admin = useLoaderData<typeof loader>();

  invariant(admin, 'Admin must be defined in the component');

  return (
    <div>
      <p>{admin.id}</p>
    </div>
  );
}
