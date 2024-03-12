import { createCookie } from '@remix-run/node' // or cloudflare/deno

export const userPrefs = createCookie('user-preferences', {
  maxAge: 604_800, // one week
})
