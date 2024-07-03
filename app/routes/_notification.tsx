import { json, LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { ExternalToast, toast } from 'sonner';
import { Toaster } from '~/components/ui/sonner';
import {
  generateBlankNotification,
  Notification,
  parseNotification,
} from '~/services/auth/notifications';

export async function loader({ request }: LoaderFunctionArgs) {
  const cookies = request.headers.get('Cookie');
  const notification = await parseNotification(cookies);
  return json(notification, {
    headers: { 'Set-Cookie': await generateBlankNotification() },
  });
}

export default function _notification() {
  const notification = useLoaderData<typeof loader>();

  function handleToast(notification: Notification) {
    type ToastLookup = Record<
      string,
      (
        message: string | React.ReactNode,
        data?: ExternalToast
      ) => string | number
    >;

    const toastLookup: ToastLookup = {
      default: toast,
      success: toast.success,
      warning: toast.warning,
      error: toast.error,
    };

    if (!notification.type || !notification.message) {
      return;
    }

    return toastLookup[notification.type](notification.message);
  }

  useEffect(() => {
    handleToast(notification);
  }, [notification]);
  return (
    <>
      <Outlet />
      <Toaster richColors />
    </>
  );
}
