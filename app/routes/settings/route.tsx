import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useFetcher, useLoaderData } from '@remix-run/react'
import { getSession, retrieveSessionUserData } from '~/sessions'
import Avatar from '~/components/ui/avatar'

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
      <h1>Settings</h1>
      <h2>Profile</h2>
      <h3>Avatar</h3>
      <fetcher.Form method="post">
        <div className="flex flex-col">
          <input type="hidden" name="uuid" value={data.uuid} />
          {!data.avatarUrl && <Avatar />}
          {data.avatarUrl && <p>{data.avatarUrl}</p>}
          <input type="file" name="avatar" />
        </div>
      </fetcher.Form>
      <h3>Information</h3>
      <fetcher.Form method="post">
        <div className="flex flex-col">
          <input type="hidden" name="uuid" value={data.uuid} />
          <label
            htmlFor="firstName"
            className="text-sm font-medium leading-6 text-gray-900"
          >
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            maxLength={255}
            minLength={1}
            defaultValue={data.firstName}
            className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <label
            htmlFor="lastName"
            className="text-sm font-medium leading-6 text-gray-900"
          >
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            maxLength={255}
            minLength={1}
            defaultValue={data.lastName}
            className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <label
            htmlFor="email"
            className="text-sm font-medium leading-6 text-gray-900"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            maxLength={255}
            minLength={1}
            defaultValue={data.email}
            className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <button
          type="submit"
          name="_action"
          value="updateInformation"
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Update Information
        </button>
      </fetcher.Form>
      <h3>Password</h3>
      <fetcher.Form method="post">
        <div className="flex flex-col">
          <input type="hidden" name="uuid" value={data.uuid} />
          <label
            htmlFor="currentPassword"
            className="text-sm font-medium leading-6 text-gray-900"
          >
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            maxLength={255}
            minLength={1}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <label
            htmlFor="newPassword"
            className="text-sm font-medium leading-6 text-gray-900"
          >
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            maxLength={255}
            minLength={1}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <label
            htmlFor="confirmNewPassword"
            className="text-sm font-medium leading-6 text-gray-900"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmNewPassword"
            maxLength={255}
            minLength={1}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <button
          type="submit"
          name="_action"
          value="updatePassword"
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Update Password
        </button>
      </fetcher.Form>
      <div>
        <ul>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
