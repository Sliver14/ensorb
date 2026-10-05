'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navLinks } from '@/lib/data'
import { MonogramLogo } from '@/components/WeddingIcons'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollYRef = useRef(0)
  const pathname = usePathname()

  // Smart sticky header: hide when scrolling down, reveal immediately when scrolling back up
  useEffect(() => {
    lastScrollYRef.current = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const lastScrollY = lastScrollYRef.current
      const deltaY = currentScrollY - lastScrollY

      // Elevation styling when scrolled past top threshold
      setIsScrolled(currentScrollY > 15)

      // Handle bounce / overscroll on mobile
      if (currentScrollY <= 40 || isMobileMenuOpen) {
        setIsVisible(true)
      } else if (deltaY > 6 && currentScrollY > 90) {
        // Scrolling DOWN away from header -> hide smoothly
        setIsVisible(false)
      } else if (deltaY < -4) {
        // Scrolling UP -> reveal immediately so user can navigate
        setIsVisible(true)
      }

      lastScrollYRef.current = currentScrollY
    }

    // Initialize on mount
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobileMenuOpen])

  // Reset visibility and close menu on route change
  useEffect(() => {
    setIsVisible(true)
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Auto-close mobile menu on desktop window resize and handle Escape key
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Lock body scroll only when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Don't render public navbar on admin dashboard
  if (pathname && pathname.startsWith('/admin')) {
    return null
  }

  return (
    <>
      <header
        className={`burgundy-site-header ${
          isVisible ? 'is-visible' : 'is-hidden'
        } ${isScrolled ? 'is-scrolled' : ''}`}
      >
        <div className="header-inner">
          {/* Left: Botanical Monogram N & S */}
          <Link
            className="header-monogram-link"
            href="/"
            aria-label="Ngozi & Sorbari Wedding Home"
          >
            <MonogramLogo size={42} />
          </Link>

          {/* Right: Navigation Tabs (Home, Wishlist, RSVP) - visible on Desktop */}
          <nav className="header-nav-tabs" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`nav-tab-item ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className={`burgundy-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="menu-bar" />
            <span className="menu-bar" />
            <span className="menu-bar" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer (Only active/visible on mobile screens) */}
      <div
        className={`burgundy-drawer-backdrop ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      />
      <aside
        className={`burgundy-drawer ${isMobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="drawer-top">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <MonogramLogo size={44} />
          </Link>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="drawer-links">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`drawer-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

