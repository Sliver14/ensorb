'use client'

import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { AsoebiSection } from '@/components/AsoebiSection'
import { ColorCodeSection } from '@/components/ColorCodeSection'

export default function AsoebiPage() {
  return (
    <main className="elegant-burgundy-theme details-page-wrapper">
      {/* Subpage Hero */}
      <section className="subpage-hero section-shell">
        <p className="eyebrow">Official Celebration Attire</p>
        <h1>Order Your Wedding Asoebi</h1>
        <p className="subpage-hero-desc">
          Celebrate with us in elegance! We warmly invite our dear family and friends to join in
          the bridal celebration splendor with our official blush-mauve wedding attire.
        </p>
      </section>

      {/* Main Interactive Asoebi Ordering Section */}
      <AsoebiSection />

      {/* Complimentary Dress Color Palette Section */}
      <ColorCodeSection />

      {/* Celebration CTA Bar */}
      <section className="story-gallery-section" style={{ paddingTop: '20px' }}>
        <div className="story-celebrate-card reveal-fade-up">
          <div className="card-decor-heart">♥</div>
          <h3 className="celebrate-title">Celebrate With Us</h3>
          <p className="celebrate-desc">
            We would be honored to have you share in the joy of our Holy Matrimony on November 21, 2026.
          </p>
          <div className="story-cta-bar">
            <Link href="/rsvp" className="btn-burgundy-pill">
              Reserve Your Seat <span>→</span>
            </Link>
            <Link href="/wishlist" className="btn-cream-outline-pill">
              <span>🎁</span> Send Your Gift
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
