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

  // Smart sticky header: detect scroll direction & elevation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const lastScrollY = lastScrollYRef.current
      const deltaY = currentScrollY - lastScrollY

      // Elevation styling when scrolled beyond top
      setIsScrolled(currentScrollY > 15)

      // Always show when near top or if mobile menu is open
      if (currentScrollY <= 80 || isMobileMenuOpen) {
        setIsVisible(true)
      } else if (deltaY > 8 && currentScrollY > 120) {
        // Scrolling down -> hide smoothly to give full content focus
        setIsVisible(false)
      } else if (deltaY < -3) {
        // Scrolling up -> show immediately so navigation is right at hand
        setIsVisible(true)
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobileMenuOpen])

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
        className={`burgundy-site-header ${isScrolled ? 'is-scrolled' : ''} ${
          isVisible ? 'is-visible' : 'is-hidden'
        }`}
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

