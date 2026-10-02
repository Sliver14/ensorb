'use client'

import Link from 'next/link'
import { navLinks } from '@/lib/data'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand-wrap">
          <span className="footer-brand">ENSORB</span>
          <h3 className="footer-title">Ngozi &amp; Sorbari</h3>
          <p className="footer-text">
            We are so excited to celebrate our love with you! Now, we’re stepping into our next chapter, hand in hand, with hearts full of gratitude for the love that surrounds us.
          </p>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <span className="footer-nav-title">Navigation</span>
          <div className="footer-nav-links">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Ngozi &amp; Sorbari. All rights reserved.</p>
        <a href="#top" className="back-to-top">
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
