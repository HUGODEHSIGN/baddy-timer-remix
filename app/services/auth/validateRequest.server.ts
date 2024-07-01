import { lucia } from '~/db/lucia.server';

export default async function validateRequest(request: Request) {
  const cookies = request.headers.get('Cookie') ?? '';

  const sessionId = lucia.readSessionCookie(cookies) ?? '';

  const result = await lucia.validateSession(sessionId);
  const { session, user } = result;

  const headers = new Headers();

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    headers.append('Set-Cookie', sessionCookie.serialize());
  }

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    headers.append('Set-Cookie', sessionCookie.serialize());
  }

  return { session, user, headers };
}
