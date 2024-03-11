import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [
    { title: 'Photography' },
    { name: 'description', content: 'photography' },
  ]
}

export default function Photography() {
  return (
    <div id="photography">
      <div>Photography</div>
    </div>
  )
}
