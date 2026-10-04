'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Smooth reset scroll position when route changes
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    // Trigger smooth fade & rise animation
    setMounted(false)
    const timer = setTimeout(() => {
      setMounted(true)
    }, 20)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div
      key={pathname}
      className={`page-smooth-transition ${mounted ? 'page-enter-active' : 'page-enter'}`}
    >
      {children}
    </div>
  )
}
