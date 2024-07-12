import { createCookie } from '@remix-run/node';
import getLocations from '~/services/auth/getLocations.server';

export const adminPrefs = createCookie('admin-prefs', {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  secure: true,
  expires: new Date(Date.now() + 60_000),
  maxAge: 60,
});

export async function getAdminPrefs(request: Request) {
  const cookieHeader = request.headers.get('Cookie');
  const adminPrefsCookie = (await adminPrefs.parse(cookieHeader)) ?? {};
  if (!adminPrefsCookie.locationId) {
    const locations = await getLocations(request);
    adminPrefsCookie.locationId = locations[0].id;
  }
  return adminPrefsCookie;
}
