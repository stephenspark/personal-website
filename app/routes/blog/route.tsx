import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [{ title: 'Blog' }, { name: 'description', content: 'blog' }]
}

export default function Blog() {
  return (
    <div id="blog">
      <div>Blog page</div>
    </div>
  )
}
