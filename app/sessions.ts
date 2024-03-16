import { createCookieSessionStorage } from '@remix-run/node'

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: '__session',
      path: '/',
      secrets: [process.env.API_SESSION_SECRET ?? 'sample_secret'],
      secure: process.env.NODE_ENV !== 'development',
    },
  })
