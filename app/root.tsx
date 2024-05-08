import type { LinksFunction, MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

import Home from './components/ui/Home'
import Photography from './components/ui/Photography'
import Loading from './components/ui/Loading'
import Cogwheel from './components/ui/Cogwheel'
import styles from './tailwind.css'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export const meta: MetaFunction = () => {
  return [
    { title: 'Stephen Park' },
    {
      name: 'description',
      content: 'Welcome to my personal website and photography portfolio',
    },
  ]
}

export default function App() {
  return (
    <html
      data-theme="dark"
      lang="en"
      className="mx-auto max-w-screen-xl overflow-y-scroll"
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
          <ul className="menu menu-horizontal menu-xs rounded-box bg-base-200 md:menu-md">
            <li>
              <NavLink to="/">
                <Home />
              </NavLink>
            </li>
            <li>
              <NavLink to="/photography">
                <Photography />
              </NavLink>
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
