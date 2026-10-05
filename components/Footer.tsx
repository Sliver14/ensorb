'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navLinks } from '@/lib/data'
import { MonogramLogo, BotanicalSprig } from '@/components/WeddingIcons'

export function Footer() {
  const pathname = usePathname()

  // Hide on admin
  if (pathname && pathname.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="burgundy-site-footer">
      <div className="footer-watercolor-wash" />
      
      <BotanicalSprig className="footer-botanical-left" />
      <BotanicalSprig className="footer-botanical-right" />

      <div className="footer-inner">
        <div className="footer-monogram-wrap">
          <Link href="/" aria-label="Ngozi & Sorbari Wedding">
            <MonogramLogo size={52} />
          </Link>
        </div>

        <p className="footer-appreciation-text">
          Thank you for being a part of our journey.
        </p>

        <div className="footer-heart-divider">
          <span className="divider-line" />
          <span className="heart-icon">♡</span>
          <span className="divider-line" />
        </div>

        <nav className="footer-simple-nav" aria-label="Footer Links">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="footer-copyright">
          © 2026 Ngozi &amp; Sorbari. All rights reserved. • November 21, 2026 • Lagos, Nigeria
        </p>
      </div>
    </footer>
  )
}
