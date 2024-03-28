import { createCookieSessionStorage, redirect } from '@remix-run/node'

export interface ISessionUser {
  uuid: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  avatarUrl: string
  createdAt: string
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: '__session',
      path: '/',
      secrets: [process.env.API_SESSION_SECRET ?? 'sample_secret'],
      secure: process.env.NODE_ENV !== 'development',
    },
  })

export async function retrieveSessionUserData(
  request: Request
): Promise<void | ISessionUser> {
  const session = await getSession(request.headers.get('Cookie'))
  if (!session.has('connect.sid')) {
    // Redirect to login page if session doesn't exist
    /* @ts-expect-error We need to return to prevent downstream execution */
    return redirect('/login')
  }

  // TODO: Cache this because this is horrendous otherwise
  const response = await fetch(`${process.env.API_URL}/users/session/user`, {
    method: 'get',
    headers: {
      credentials: 'same-origin',
      Cookie: Object.entries(session.data)
        .map(([key, value]) => `${key}=${value}`)
        .join('; '),
    },
  })

  const responseData = await response.json()

  return {
    uuid: responseData.uuid,
    firstName: responseData.first_name,
    lastName: responseData.last_name,
    fullName: `${responseData.first_name} ${responseData.last_name}`,
    email: responseData.email,
    avatarUrl: responseData.avatar_url,
    createdAt: responseData.created_at,
  } as ISessionUser
}

export async function sessionLogout(request: Request): Promise<void | object> {
  const session = await getSession(request.headers.get('Cookie'))

  // Logout with API
  const response = await fetch(`${process.env.API_URL}/auth/logout`, {
    method: 'delete',
    headers: {
      credentials: 'same-origin',
      Cookie: Object.entries(session.data)
        .map(([key, value]) => `${key}=${value}`)
        .join('; '),
    },
  })
  const responseData = await response.json()

  if (response.status !== 200) {
    return {
      error: responseData.message,
    }
  }

  // Redirect to root if validation is successful
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}
