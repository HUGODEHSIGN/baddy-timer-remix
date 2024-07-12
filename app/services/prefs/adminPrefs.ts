import { createCookie } from '@remix-run/node';

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
  return await adminPrefs.parse(cookieHeader);
}
