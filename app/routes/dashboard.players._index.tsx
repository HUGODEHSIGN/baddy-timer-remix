import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { parseNotification } from '~/services/auth/notifications';

export async function loader({ request }: LoaderFunctionArgs) {
  const notification = request.headers.get('Cookie');
  return await parseNotification(notification);
}
export default function PlayersPage() {
  const notification = useLoaderData<typeof loader>();
  return (
    <>
      <p>here is an error message</p>
      {notification?.message && notification.message}
    </>
  );
}
