import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  LinksFunction,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
  useSubmit,
} from '@remix-run/react'

import Hamburger from '../app/components/hamburger'
import Cogwheel from './components/cogwheel'
import DarkMode from './components/darkmode'
import styles from './tailwind.css'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

import { userPrefs } from './cookies.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'Stephen Park' },
    {
      name: 'description',
      content: 'Welcome to my personal website and photography portfolio',
    },
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) || {}

  return json({
    sidebarEnabled: cookie.sidebarEnabled,
    darkmodeEnabled: cookie.darkmodeEnabled,
  })
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) || {}
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)

  if (_action === 'sidebarToggle') {
    cookie.sidebarEnabled = !cookie.sidebarEnabled
  }

  if (_action === 'darkmodeToggle') {
    cookie.darkmodeEnabled = !cookie.darkmodeEnabled
  }

  return redirect(request.headers.get('Referer') || request.url, {
    headers: {
      'Set-Cookie': await userPrefs.serialize(cookie),
    },
  })
}

export default function App() {
  const fetcher = useFetcher()
  const data = useLoaderData<typeof loader>()
  const submit = useSubmit()

  return (
    <html lang="en" className={data.darkmodeEnabled ? 'dark' : ''}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 dark:bg-gray-950">
        <div className="grid grid-cols-8 gap-4">
          <div
            id="sidebar"
            className="bg-gray-50 dark:bg-gray-950 dark:text-gray-50 col-span-1 p-8 text-right items-end"
          >
            <nav className="flex flex-col flex-nowrap">
              <h1 className="text-xl font-bold pb-8">Stephen Park</h1>
              <fetcher.Form method="post">
                <button
                  type="submit"
                  name="_action"
                  value="sidebarToggle"
                  className="hover:animate-spin"
                >
                  <Hamburger isOpen={data.sidebarEnabled || false} />
                </button>
              </fetcher.Form>
              {data.sidebarEnabled && (
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/blog">Blog</Link>
                  </li>
                  <li>
                    <Link to="/photography">Photography</Link>
                  </li>
                  <div
                    id="sidebar-footer"
                    className="flex flex-row pt-8 gap-4 justify-end"
                  >
                    <button
                      onClick={() => {
                        submit(
                          { _action: 'darkmodeToggle' },
                          { method: 'post' }
                        )
                      }}
                      className="hover:animate-spin"
                    >
                      <DarkMode enabled={data.darkmodeEnabled} />
                    </button>
                    <Link to="/settings" className="hover:animate-spin">
                      <Cogwheel />
                    </Link>
                  </div>
                </ul>
              )}
            </nav>
          </div>
          <div
            id="detail"
            className="bg-gray-100 dark:bg-gray-900 col-span-7 p-8"
          >
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
