import { LoaderFunctionArgs } from '@remix-run/node';
import { json, Outlet, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { getPrimaryPlayer } from '~/services/auth/getPlayers';

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, user, primaryPlayer, headers } = await getPrimaryPlayer(
    request
  );
  invariant(session && user, 'User not found');

  return json({ primaryPlayer }, { headers });
}

export default function DashboardLayout() {
  const { primaryPlayer } = useLoaderData<typeof loader>();
  return (
    <>
      <p>
        {primaryPlayer?.firstName}
        {primaryPlayer?.lastName}
      </p>
      <Outlet />
    </>
  );
}
