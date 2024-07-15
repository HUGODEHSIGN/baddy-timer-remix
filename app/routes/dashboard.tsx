import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, redirect } from '@remix-run/react';
import { $path } from 'remix-routes';
import { getPrimaryPlayer } from '~/services/auth/getPlayers.server';
import validateRequest from '~/services/auth/validateRequest.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await validateRequest(request);

  if (!session) throw redirect($path('/login'));

  const { primaryPlayer } = await getPrimaryPlayer(request);
  if (!primaryPlayer) throw redirect($path('/get-started'));

  return null;
}

export default function DashboardLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}
