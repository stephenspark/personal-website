import * as React from 'react'
import { useNavigation } from '@remix-run/react'
import clsx from 'clsx'

export default function Loading() {
  const navigation = useNavigation()
  const active = navigation.state !== 'idle'

  const ref = React.useRef<HTMLDivElement>(null)
  const [animationComplete, setAnimationComplete] = React.useState(true)

  React.useEffect(() => {
    if (!ref.current) return
    if (active) setAnimationComplete(false)

    Promise.allSettled(
      ref.current.getAnimations().map(({ finished }) => finished)
    ).then(() => !active && setAnimationComplete(true))
  }, [active])

  return (
    <div
      role="progressbar"
      aria-hidden={!active}
      aria-valuetext={active ? 'Loading' : undefined}
      className="fixed inset-x-0 top-0 z-50 h-1 animate-pulse"
    >
      <div
        className={clsx(
          'h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-in-out',
          {
            'w-0 opacity-0 transition-none':
              navigation.state === 'idle' && animationComplete,
            'w-4/12': navigation.state === 'submitting',
            'w-10/12': navigation.state === 'loading',
            'w-full': navigation.state === 'idle' && !animationComplete,
          }
        )}
      />
    </div>
  )
}
