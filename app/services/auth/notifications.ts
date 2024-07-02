import { createCookie } from '@remix-run/node';

export type Notification = {
  type: string | null;
  message: string | null;
};

const notificationCookie = createCookie('notifications');

export function serializeNotification(notification: Notification) {
  return notificationCookie.serialize(notification);
}

export async function parseNotification(cookie?: string | null) {
  if (!cookie) {
    return {
      type: null,
      message: null,
    } as Notification;
  }

  return (await notificationCookie.parse(cookie)) as Notification;
}

export async function generateBlankNotification() {
  return await notificationCookie.serialize({ type: null, message: null });
}
