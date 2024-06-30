// app/services/session.server.ts
import { createCookieSessionStorage } from '@remix-run/node';

// export the whole sessionStorage object
export const adminSessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'admin_session', // use any name you want here
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [process.env.SESSION_SECRET!], // replace this with an actual secret
    secure: process.env.NODE_ENV === 'production', // enable this in prod only
  },
});

export const { getSession, commitSession, destroySession } =
  adminSessionStorage;
