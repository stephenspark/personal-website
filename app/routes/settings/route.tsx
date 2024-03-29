import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { getSession, retrieveSessionUserData } from '~/sessions'
import Avatar from '~/components/ui/Avatar'

interface IUpdateError {
  firstName: string
  lastName: string
  email: string
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

    if (firstName.length < 1) {
      errors.firstName = 'Invalid first name'
    }

    if (lastName.length < 1) {
      errors.lastName = 'Invalid last name'
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
    console.log(responseData)

    if (response.status !== 200) {
      return json({
        errors: errors,
        message: responseData.message,
      })
    }

    // Redirect to root if validation is successful
    return json({
      errors: errors,
      message: responseData.message,
    })
  }

  if (_action === 'updatePassword') {
    //
    console.log('huh2')
  }

  return null
}

export default function Settings() {
  const fetcher = useFetcher()
  const data = useLoaderData<typeof loader>()

  return (
    <div id="settings" className="prose prose-lg dark:prose-invert">
      <h2>Settings</h2>
      <p>
        Hello! You are currently logged in as {data.firstName} {data.lastName} (
        {data.email})
      </p>
      <Link to="/logout">Logout</Link>
      <h3>Profile</h3>
      <h4>Avatar</h4>
      <fetcher.Form method="post">
        <div className="flex flex-col">
          <input type="hidden" name="uuid" value={data.uuid} />
          {!data.avatarUrl && <Avatar />}
          {data.avatarUrl && <p>{data.avatarUrl}</p>}
          <input
            type="file"
            name="avatar"
            className="file-input file-input-bordered w-full max-w-xs"
          />
        </div>
      </fetcher.Form>
      <hr />
      <h4>Information</h4>
      <fetcher.Form method="post">
        <div className="flex flex-col gap-4">
          <input type="hidden" name="uuid" value={data.uuid} />
          <label className="input input-bordered flex items-center gap-2">
            First Name
            <input
              type="text"
              name="firstName"
              maxLength={255}
              minLength={1}
              defaultValue={data.firstName}
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
              defaultValue={data.lastName}
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
              defaultValue={data.email}
              className="grow"
            />
          </label>
          <button
            type="submit"
            name="_action"
            value="updateInformation"
            className="btn"
          >
            Update Information
          </button>
        </div>
      </fetcher.Form>
      <hr />
      <h4>Password</h4>
      <fetcher.Form method="post">
        <div className="flex flex-col gap-4">
          <input type="hidden" name="uuid" value={data.uuid} />
          <label className="input input-bordered flex items-center gap-2">
            Current Password
            <input
              type="password"
              name="currentPassword"
              maxLength={255}
              minLength={1}
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            New Password
            <input
              type="password"
              name="newPassword"
              maxLength={255}
              minLength={1}
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Confirm New Password
            <input
              type="password"
              name="confirmNewPassword"
              maxLength={255}
              minLength={1}
              className="grow"
            />
          </label>
          <button
            type="submit"
            name="_action"
            value="updatePassword"
            className="btn"
          >
            Update Password
          </button>
        </div>
      </fetcher.Form>
    </div>
  )
}
