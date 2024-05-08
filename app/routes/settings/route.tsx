import React from 'react'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Link,
  useActionData,
  useFetcher,
  useLoaderData,
} from '@remix-run/react'

import { getSession, retrieveSessionUserData } from '~/sessions'
import PasswordVisilibity from '~/components/ui/PasswordVisibility'
interface IUpdateError {
  email: string
  password: string
}

export async function loader({ request }: LoaderFunctionArgs) {
  return retrieveSessionUserData(request)
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)

  const errors = {} as IUpdateError

  const uuid = String(formData.get('uuid'))

  if (_action === 'updateInformation') {
    const firstName = String(formData.get('firstName'))
    const lastName = String(formData.get('lastName'))
    const email = String(formData.get('email'))

    // Validation
    if (!email.includes('@')) {
      errors.email = 'Invalid email address'
    }

    if (Object.keys(errors).length > 0) {
      return json({ errors })
    }

    const response = await fetch(`${process.env.API_URL}/users/${uuid}`, {
      method: 'put',
      headers: {
        credentials: 'same-origin',
        Cookie: Object.entries(session.data)
          .map(([key, value]) => `${key}=${value}`)
          .join('; '),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        updateType: _action,
        firstName: firstName,
        lastName: lastName,
        email: email,
      }),
    })
    const responseData = await response.json()

    if (response.status !== 200) {
      return json({
        errors: errors,
        message: responseData.message,
      })
    }

    return json({
      errors: errors,
      message: responseData.message,
    })
  }

  if (_action === 'updatePassword') {
    const currentPassword = String(formData.get('currentPassword'))
    const newPassword = String(formData.get('newPassword'))
    const confirmNewPassword = String(formData.get('confirmNewPassword'))

    // Validation
    if (newPassword !== confirmNewPassword) {
      errors.password =
        'New password and new password confirmation do not match'
    }

    if (Object.keys(errors).length > 0) {
      return json({ errors })
    }

    const response = await fetch(`${process.env.API_URL}/users/${uuid}`, {
      method: 'put',
      headers: {
        credentials: 'same-origin',
        Cookie: Object.entries(session.data)
          .map(([key, value]) => `${key}=${value}`)
          .join('; '),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        updateType: _action,
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      }),
    })
    const responseData = await response.json()
    console.log(responseData)

    if (response.status !== 200) {
      return json({
        errors: errors,
        message: responseData.message,
      })
    }

    return json({
      errors: errors,
      message: responseData.message,
    })
  }

  return json({
    errors: errors,
  })
}

export default function Settings() {
  const [currentPasswordVisible, setCurrentPasswordVisible] =
    React.useState(false)
  const [newPasswordVisible, setNewPasswordVisible] = React.useState(false)
  const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] =
    React.useState(false)

  const fetcher = useFetcher()
  const actionData = fetcher.data as ReturnType<
    typeof useActionData<typeof action>
  >
  const loaderData = useLoaderData<typeof loader>()

  return (
    <div id="settings" className="prose prose-lg dark:prose-invert">
      <h2>Settings</h2>
      <p>
        Hello! You are currently logged in as {loaderData.firstName}{' '}
        {loaderData.lastName} ({loaderData.email})
      </p>
      <Link to="/logout">Logout</Link>
      <h3>Profile</h3>
      <hr />
      <h4>Avatar</h4>
      <fetcher.Form method="post">
        <div className="pb-4">
          {!loaderData.avatarUrl && (
            <div className="avatar placeholder">
              <div className="w-16 rounded-full bg-neutral text-neutral-content">
                <span className="cursor-default text-xl">
                  {loaderData.firstName[0]}
                  {loaderData.lastName[0]}
                </span>
              </div>
            </div>
          )}
          {loaderData.avatarUrl && (
            <div className="avatar">{loaderData.avatarUrl}</div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <input type="hidden" name="uuid" value={loaderData.uuid} />
          <input
            type="file"
            name="avatar"
            className="file-input file-input-bordered w-full max-w-xs"
          />
          <button
            type="submit"
            name="_action"
            value="updateAvatar"
            className="btn"
            disabled={fetcher.state !== 'idle'}
          >
            {fetcher.state !== 'idle' && (
              <span className="loading loading-dots loading-sm"></span>
            )}
            {fetcher.state === 'idle' && <span>Update Avatar</span>}
          </button>
        </div>
      </fetcher.Form>
      <hr />
      <h4>Information</h4>
      <fetcher.Form method="post">
        <div className="flex flex-col gap-4">
          <input type="hidden" name="uuid" value={loaderData.uuid} />
          <label className="input input-bordered flex items-center gap-2">
            First Name
            <input
              type="text"
              name="firstName"
              maxLength={255}
              minLength={1}
              defaultValue={loaderData.firstName}
              required
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Last Name
            <input
              type="text"
              name="lastName"
              maxLength={255}
              minLength={1}
              defaultValue={loaderData.lastName}
              required
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Email
            <input
              type="email"
              name="email"
              maxLength={255}
              minLength={1}
              defaultValue={loaderData.email}
              required
              className="grow"
            />
          </label>
          {actionData?.errors.email ? (
            <span className="text-red-400">{actionData.errors.email}</span>
          ) : null}
          <button
            type="submit"
            name="_action"
            value="updateInformation"
            className="btn"
            disabled={fetcher.state !== 'idle'}
          >
            {fetcher.state !== 'idle' && (
              <span className="loading loading-dots loading-sm"></span>
            )}
            {fetcher.state === 'idle' && <span>Update Information</span>}
          </button>
        </div>
      </fetcher.Form>
      <hr />
      <h4>Password</h4>
      <fetcher.Form method="post">
        <div className="flex flex-col gap-4">
          <input type="hidden" name="uuid" value={loaderData.uuid} />
          <label className="input input-bordered flex items-center gap-2">
            Current Password
            <input
              type={currentPasswordVisible ? 'text' : 'password'}
              autoComplete="current-password"
              name="currentPassword"
              maxLength={255}
              minLength={1}
              required
              className="grow"
            />
            <button
              onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}
            >
              <PasswordVisilibity enabled={currentPasswordVisible} />
            </button>
          </label>
          <label className="input input-bordered flex items-center gap-2">
            New Password
            <input
              type={newPasswordVisible ? 'text' : 'password'}
              autoComplete="new-password"
              name="newPassword"
              maxLength={255}
              minLength={1}
              required
              className="grow"
            />
            <button onClick={() => setNewPasswordVisible(!newPasswordVisible)}>
              <PasswordVisilibity enabled={newPasswordVisible} />
            </button>
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Confirm New Password
            <input
              type={confirmNewPasswordVisible ? 'text' : 'password'}
              autoComplete="new-password"
              name="confirmNewPassword"
              maxLength={255}
              minLength={1}
              required
              className="grow"
            />
            <button
              onClick={() =>
                setConfirmNewPasswordVisible(!confirmNewPasswordVisible)
              }
            >
              <PasswordVisilibity enabled={confirmNewPasswordVisible} />
            </button>
          </label>
          {actionData?.errors.password ? (
            <span className="text-red-400">{actionData.errors.password}</span>
          ) : null}
          <button
            type="submit"
            name="_action"
            value="updatePassword"
            className="btn"
            disabled={fetcher.state !== 'idle'}
          >
            {fetcher.state !== 'idle' && (
              <span className="loading loading-dots loading-sm"></span>
            )}
            {fetcher.state === 'idle' && <span>Update Password</span>}
          </button>
        </div>
      </fetcher.Form>
    </div>
  )
}
