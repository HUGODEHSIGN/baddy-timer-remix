import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { getPrimaryPlayer } from '~/services/auth/getPlayers';

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, user, primaryPlayer } = await getPrimaryPlayer(request);
  invariant(session && user, 'User not found');

  return { primaryPlayer };
}

export default function DashboardLayout() {
  const { primaryPlayer } = useLoaderData<typeof loader>();
  return (
    <>
      <Outlet />
      <p>
        {primaryPlayer?.firstName}
        {primaryPlayer?.lastName}
      </p>
    </>
  );
}
