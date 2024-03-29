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
  useLoaderData,
  useSubmit,
} from '@remix-run/react'
import clsx from 'clsx'

import Blog from './components/ui/Blog'
import Home from './components/ui/Home'
import Photography from './components/ui/Photography'
import Loading from './components/ui/Loading'
import Cogwheel from './components/ui/Cogwheel'
import DarkMode from './components/ui/DarkMode'
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
    darkmodeEnabled: cookie.darkmodeEnabled,
  })
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) || {}
  const formData = await request.formData()
  const { _action } = Object.fromEntries(formData)

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
  const data = useLoaderData<typeof loader>()
  const submit = useSubmit()

  return (
    <html
      data-theme={`${data.darkmodeEnabled ? 'dark' : 'light'}`}
      lang="en"
      className={clsx('mx-auto max-w-screen-xl overflow-y-scroll', {
        dark: data.darkmodeEnabled,
      })}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Loading />
        <div id="header" className="sticky top-0 px-16 py-4">
          <ul className="menu menu-xs md:menu-md menu-horizontal bg-base-200 rounded-box">
            <li>
              <NavLink to="/">
                <Home />
              </NavLink>
            </li>
            <li>
              <NavLink to="/blog">
                <Blog />
              </NavLink>
            </li>
            <li>
              <NavLink to="/photography">
                <Photography />
              </NavLink>
            </li>
            <li>
              <button
                onClick={() => {
                  submit({ _action: 'darkmodeToggle' }, { method: 'post' })
                }}
              >
                <DarkMode enabled={data.darkmodeEnabled} />
              </button>
            </li>
            <li>
              <NavLink to="/settings">
                <Cogwheel />
              </NavLink>
            </li>
          </ul>
        </div>
        <div id="detail" className="px-16 py-8">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
