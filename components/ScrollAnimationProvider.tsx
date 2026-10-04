'use client'

import { useEffect } from 'react'

export function ScrollAnimationProvider({ children }: { children: React.ReactNode }) {
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
          threshold: 0.08,
          rootMargin: '0px 0px -20px 0px',
        }
      )

      elements.forEach((el) => {
        el.classList.add('scroll-animated')
        observer.observe(el)
      })

      // Stagger children inside .reveal-stagger
      document.querySelectorAll('.reveal-stagger').forEach((container) => {
        Array.from(container.children).forEach((child, index) => {
          ;(child as HTMLElement).style.setProperty('--stagger-delay', `${index * 0.1}s`)
        })
      })

      return () => {
        observer.disconnect()
      }
    }

    const cleanup = setupObserver()

    // Re-observe when unlock event fires
    const handleUnlock = () => {
      setTimeout(() => {
        setupObserver()
      }, 400)
    }

    // Also re-check when DOM changes (e.g. navigation or tabs)
    const handleRouteChange = () => {
      setTimeout(() => {
        setupObserver()
      }, 100)
    }

    window.addEventListener('ensorb-portal-unlocked', handleUnlock)
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      if (cleanup) cleanup()
      window.removeEventListener('ensorb-portal-unlocked', handleUnlock)
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  return <>{children}</>
}
