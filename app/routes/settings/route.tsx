import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Link, useFetcher, useLoaderData, useSubmit } from '@remix-run/react'
import { retrieveSessionUserData } from '~/sessions'

export async function loader({ request }: LoaderFunctionArgs) {
  return retrieveSessionUserData(request)
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)

  if (_action === 'sidebarToggle') {
    //
  }

  if (_action === 'darkmodeToggle') {
    //
  }

  return
}

export default function Settings() {
  const fetcher = useFetcher()
  const data = useLoaderData<typeof loader>()
  const submit = useSubmit()

  return (
    <div id="settings" className="prose prose-lg dark:prose-invert">
      <h1>Settings</h1>
      <h2>Profile</h2>
      <h3>Avatar</h3>
      <fetcher.Form method="post">
        <div className="flex flex-col">
          <label htmlFor="avatar">Avatar</label>
          <input type="file" name="avatar" />
        </div>
      </fetcher.Form>
      <h3>Information</h3>
      <fetcher.Form method="post">
        <div className="flex flex-col">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            maxLength={255}
            minLength={1}
            value={data.firstName}
          />
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            maxLength={255}
            minLength={1}
            value={data.lastName}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            maxLength={255}
            minLength={1}
            value={data.email}
          />
        </div>
      </fetcher.Form>
      <h3>Password</h3>
      <fetcher.Form method="post">
        <div className="flex flex-col">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            maxLength={255}
            minLength={1}
          />
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            name="newPassword"
            maxLength={255}
            minLength={1}
          />
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            type="password"
            name="confirmNewPassword"
            maxLength={255}
            minLength={1}
          />
        </div>
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
