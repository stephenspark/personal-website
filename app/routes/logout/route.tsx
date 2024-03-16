import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'

import { getSession, destroySession } from '../../sessions'

interface ILoginError {
  email: string
  password: string
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  if (!session.has('connect.sid')) {
    // Redirect to login page if session doesn't exist
    return redirect('/login')
  }

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

  return json({
    uuid: responseData.uuid,
    firstName: responseData.first_name,
    lastName: responseData.last_name,
    fullName: `${responseData.first_name} ${responseData.last_name}`,
    email: responseData.email,
    avatarUrl: `${responseData.avatar_url}`,
    createdAt: `${responseData.created_at}`,
  })
}

export async function action({ request }: ActionFunctionArgs) {
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
    return json({
      errors: {} as ILoginError,
      message: responseData.message,
    })
  }

  // Redirect to root if validation is successful
  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}

export default function Login() {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <div id="logout" className="prose prose-lg dark:prose-invert">
      <h1>Logout</h1>
      <p>
        You are currently logged in as {loaderData.fullName} ({loaderData.email}
        )
      </p>
      <p>Are you sure you want to log out?</p>
      <Form method="post">
        <button>Logout</button>
      </Form>
    </div>
  )
}
