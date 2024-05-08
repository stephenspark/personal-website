import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'

import { retrieveSessionUserData, sessionLogout } from '../../sessions'

export async function loader({ request }: LoaderFunctionArgs) {
  return await retrieveSessionUserData(request)
}

export async function action({ request }: ActionFunctionArgs) {
  return await sessionLogout(request)
}

export default function Logout() {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <div id="logout" className="prose prose-lg dark:prose-invert">
      <h2>Logout</h2>
      <p>
        You are currently logged in as {loaderData.fullName} ({loaderData.email}
        )
      </p>
      <p>Are you sure you want to log out?</p>
      <Form method="post">
        <button className="btn">Logout</button>
      </Form>
    </div>
  )
}
