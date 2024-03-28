import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  LinksFunction,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
  useSubmit,
} from '@remix-run/react'

import Loading from './components/ui/loading'
import Hamburger from './components/ui/hamburger'
import Cogwheel from './components/ui/cogwheel'
import DarkMode from './components/ui/darkmode'
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

  const healthcheck = await fetch(`${process.env.API_URL}/healthcheck`)

  return json({
    sidebarEnabled: cookie.sidebarEnabled,
    darkmodeEnabled: cookie.darkmodeEnabled,
    healthcheck: await healthcheck.json(),
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
        <Loading />
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
                    <NavLink to="/" className="aria-[current=page]:font-bold">
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/blog"
                      className="aria-[current=page]:font-bold"
                    >
                      Blog
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/photography"
                      className="aria-[current=page]:font-bold"
                    >
                      Photography
                    </NavLink>
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
                    <NavLink to="/settings" className="hover:animate-spin">
                      <Cogwheel />
                    </NavLink>
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
