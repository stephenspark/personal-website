import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'

import setCookie from 'set-cookie-parser'

import { getSession, commitSession } from '../../sessions'

interface ILoginError {
  email: string
  password: string
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))

  if (session.has('connect.sid')) {
    return redirect('/')
  }

  return null
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))

  const errors = {} as ILoginError

  // Validation
  if (!email.includes('@')) {
    errors.email = 'Invalid email address'
  }

  if (password.length < 12) {
    errors.password = 'Password should be at least 12 characters'
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors })
  }

  // Attempt login with API
  const response = await fetch(`${process.env.API_URL}/auth/login/password`, {
    method: 'post',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email: email, password: password }),
  })
  const responseData = await response.json()

  if (response.status !== 200) {
    return json({
      errors: {} as ILoginError,
      message: responseData.message,
    })
  }

  const setCookieHeader = response.headers.get('Set-Cookie')

  if (!setCookieHeader) {
    return json({
      errors: {} as ILoginError,
      message: 'Set cookie not found >:(',
    })
  }

  const parsedResponseCookies = setCookie.parse(
    setCookie.splitCookiesString(setCookieHeader)
  )

  const sessionIdCookie = parsedResponseCookies.find(
    (cookie) => cookie.name === 'connect.sid'
  )

  if (!sessionIdCookie) {
    return json({
      errors: {} as ILoginError,
      message: 'SessionId not found >:(',
    })
  }

  session.set('connect.sid', sessionIdCookie.value)

  // Redirect to root if validation is successful
  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

export default function Login() {
  const actionData = useActionData<typeof action>()

  return (
    <div id="login" className="prose prose-lg dark:prose-invert">
      <h1>Login</h1>
      <Form method="post">
        <p>
          <input type="email" name="email" />
          {actionData?.errors?.email ? (
            <em>{actionData?.errors.email}</em>
          ) : null}
        </p>

        <p>
          <input type="password" name="password" />
          {actionData?.errors?.password ? (
            <em>{actionData?.errors.password}</em>
          ) : null}
        </p>

        <button type="submit">Login</button>
      </Form>
    </div>
  )
}
