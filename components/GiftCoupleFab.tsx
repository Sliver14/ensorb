'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gift } from 'lucide-react'

export function GiftCoupleFab() {
  const pathname = usePathname()

  // Don't render on admin page
  if (pathname && pathname.startsWith('/admin')) {
    return null
  }

  return (
    <div className="gift-couple-fab-container">
      <Link
        href="/wishlist"
        className="gift-couple-fab-btn"
        aria-label="Gift the Couple - Ngozi & Sorbari"
        title="Gift the Couple - Browse wedding registry"
      >
        <span className="fab-shimmer-sweep" />
        <span className="fab-gift-icon-wrap">
          <Gift size={18} className="fab-lucide-gift" />
          <span className="fab-sparkle-dot">✨</span>
        </span>
        <span className="fab-text-wrap">
          <span className="fab-text-primary">Gift the Couple</span>
          <span className="fab-text-sub">Bless Ngozi &amp; Sorbari</span>
        </span>
      </Link>
    </div>
  )
}


