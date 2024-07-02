import { lucia } from '~/db/lucia.server';

export default async function validateRequest(request: Request) {
  const cookies = request.headers.get('Cookie');

  const sessionId = lucia.readSessionCookie(cookies ?? '');

  const result = await lucia.validateSession(sessionId ?? '');
  const { session, user } = result;

  return { session, user };
}
