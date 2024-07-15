import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, redirect } from '@remix-run/react';
import { $path } from 'remix-routes';
import validateRequest from '~/services/auth/validateRequest.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await validateRequest(request);
  if (!session) throw redirect($path('/login'));
}

export default function GetStartedLayout() {
  return <Outlet />;
}
