'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollAnimationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const setupObserver = () => {
      // Elements that should reveal on scroll
      const selectors = [
        '.reveal-on-scroll',
        '.reveal-fade-up',
        '.reveal-fade-left',
        '.reveal-fade-right',
        '.reveal-zoom-in',
        '.reveal-stagger',
        '.washi-polaroid-frame',
        '.wishlist-fund-card',
        '.story-split-card',
        '.rsvp-form-card',
        '.rsvp-gentle-reminder-card',
        '.traditional-bank-card',
        '.wishlist-faq-item',
        '.detail-event-card',
        '.detail-col-card',
        '.palette-swatch-item',
        '.swatch-item-wrap',
        '.faq-accordion-item',
        '.quote-burgundy-card',
        '.quote-photo-col',
        '.hero-deckled-card',
        '.hero-photo-wrap',
        '.countdown-col',
      ]

      const elements = document.querySelectorAll(selectors.join(', '))

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              // Keep observing or unobserve once visible
              observer.unobserve(entry.target)
            }
          })
        },
        {
          threshold: 0.05,
          rootMargin: '0px 0px -10px 0px',
        }
      )

      elements.forEach((el) => {
        el.classList.add('scroll-animated')
        observer.observe(el)
      })

      // Stagger children inside .reveal-stagger
      document.querySelectorAll('.reveal-stagger').forEach((container) => {
        Array.from(container.children).forEach((child, index) => {
          ;(child as HTMLElement).style.setProperty('--stagger-delay', `${index * 0.08}s`)
        })
      })

      return () => {
        observer.disconnect()
      }
    }

    const cleanup = setupObserver()

    // Smoothly scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' })

    // Re-check shortly after DOM paint
    const timer = setTimeout(() => {
      setupObserver()
    }, 60)

    // Re-observe when unlock event fires
    const handleUnlock = () => {
      setTimeout(() => {
        setupObserver()
      }, 300)
    }

    window.addEventListener('ensorb-portal-unlocked', handleUnlock)

    return () => {
      if (cleanup) cleanup()
      clearTimeout(timer)
      window.removeEventListener('ensorb-portal-unlocked', handleUnlock)
    }
  }, [pathname])

  return <>{children}</>
}
