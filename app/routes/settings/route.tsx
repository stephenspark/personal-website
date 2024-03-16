import { Link } from '@remix-run/react'

export default function Settings() {
  return (
    <div id="settings" className="prose prose-lg dark:prose-invert">
      <h1>Settings</h1>
      <div>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
