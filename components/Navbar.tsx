'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navLinks } from '@/lib/data'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Prevent background scrolling when mobile menu is open & handle Escape key
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsMobileMenuOpen(false)
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header className="site-header">
        <Link className="monogram" href="/" aria-label="Back to home">
          ENSORB
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.label}
                href={link.href}
                className={isActive ? 'active-nav-link' : ''}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="header-actions">
          <Link className="rsvp-button" href="/rsvp">
            RSVP &amp; Tickets
          </Link>
          <button
            type="button"
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`mobile-nav-backdrop ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <aside
        className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-brand">ENSORB</span>
          <button
            type="button"
            className="mobile-drawer-close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="mobile-drawer-links">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.label}
                href={link.href}
                className={isActive ? 'active-mobile-link' : ''}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/rsvp"
            className="mobile-drawer-rsvp"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            RSVP &amp; Tickets ↗
          </Link>
        </nav>
      </aside>
    </>
  )
}
