import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { getPrimaryPlayer } from '~/services/auth/getPlayers';

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, user, primaryPlayer } = await getPrimaryPlayer(request);
  invariant(session && user, 'User not found');

  return { primaryPlayer };
}

export default function DashboardLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}
