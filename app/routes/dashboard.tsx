import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { getPrimaryPlayer } from '~/services/auth/getPlayers';
import { parseNotification } from '~/services/auth/notifications';

export async function loader({ request }: LoaderFunctionArgs) {
  const cookies = request.headers.get('Cookie');
  const notification = await parseNotification(cookies);
  const { session, user, primaryPlayer } = await getPrimaryPlayer(request);
  invariant(session && user, 'User not found');

  return { primaryPlayer, notification };
}

export default function DashboardLayout() {
  const { primaryPlayer, notification } = useLoaderData<typeof loader>();
  return (
    <>
      <p>
        {primaryPlayer?.firstName}
        {primaryPlayer?.lastName}
      </p>
      {notification?.message && notification.message}
      <Outlet />
    </>
  );
}
