'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { registryGifts, dressColors, galleryPhotos, faqData, GiftItem } from '@/lib/data'

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const weddingDate = new Date('2026-10-31T14:00:00+01:00').getTime()
    const updateCountdown = () => {
      const difference = Math.max(0, weddingDate - Date.now())
      setTimeLeft({
        days: Math.floor(difference / 86400000),
        hours: Math.floor((difference / 3600000) % 24),
        minutes: Math.floor((difference / 60000) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      })
    }
    updateCountdown()
    const timer = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="countdown" aria-label="Countdown to the wedding">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div className="countdown-unit" key={unit}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{unit}</span>
        </div>
      ))}
    </div>
  )
}

export default function Page() {
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const [copiedBank, setCopiedBank] = useState(false)
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const giftScrollRef = useRef<HTMLDivElement>(null)

  const scrollGifts = (direction: 'left' | 'right') => {
    if (giftScrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340
      giftScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleCopyAccount = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedBank(true)
      setTimeout(() => setCopiedBank(false), 2500)
    }
  }

  const handleCopyColor = (hex: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hex)
      setCopiedColor(hex)
      setTimeout(() => setCopiedColor(null), 2000)
    }
  }

  return (
    <main className="wedding-site">
      <Navbar />

      <section id="top" className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">NGOZI <span>&amp;</span> SORBARI</h1>
          <div className="event-meta">
            <span>Christ Embassy Ogba 1</span>
            <i />
            <span>October 31, 2026</span>
            <i />
            <span>Lagos, Nigeria</span>
          </div>
          <Countdown />
          {/* <div className="hero-actions">
            <Link href="/rsvp" className="hero-rsvp-cta">
              RSVP &amp; Get Guest Pass ↗
            </Link>
            <Link href="/gifts" className="hero-gifts-cta">
              Wedding Gifts Registry 🎁
            </Link>
          </div> */}
        </div>
        <img
          className="hero-image"
          src="https://framerusercontent.com/images/daqW7PY9WXmILN7A9MO8bt0TPk.png?width=3280&height=2304"
          alt="A couple holding hands at golden hour"
        />
      </section>

      <section id="about" className="story section-shell">
        <div className="story-art">
          <img
            src="https://framerusercontent.com/images/zeXOnZSDldcYdJLXTGEdVYZei4I.png?width=1000&height=1000"
            alt="Illustrated leafy wreath with ENSORB logo"
          />
          <span className="story-logo-text">ENSORB</span>
        </div>
        <div className="story-copy">
          <p className="eyebrow">Our story</p>
          <h2>A coffee date that became forever.</h2>
          <p>
            Ngozi and Sorbari first met over a simple coffee date which ended up being the start of their forever. Now, they are stepping into their next chapter, hand in hand, with hearts full of gratitude.
          </p>
          <Link href="/story" className="section-explore-link">
            Read Our Full Story &amp; Timeline <span>↗</span>
          </Link>
        </div>
      </section>

      <section className="gallery section-shell" aria-label="Engagement photographs">
        {galleryPhotos.map((photo, index) => (
          <img
            key={photo.src}
            className={index === 3 ? 'wide-photo' : ''}
            src={photo.src}
            alt={photo.alt}
          />
        ))}
      </section>

      <section id="accommodation" className="details section-shell">
        <div>
          <p className="eyebrow">The celebration</p>
          <h2>Come celebrate with us.</h2>
        </div>
        <div className="detail-grid">
          <article>
            <span>01</span>
            <h3>The Program</h3>
            <p>Join us for the solemn exchange of vows at 2:00 PM, followed by cocktails, royal reception banquet, and after-party.</p>
            <Link href="/details" className="article-sub-link">View Full Program &amp; Schedule ↗</Link>
          </article>
          <article id="program">
            <span>02</span>
            <h3>Dress Color Code</h3>
            <p>Our official palette features Burgundy, Blush, Mint Green, and Olive Green for formal and traditional elegance.</p>
            <Link href="/details#dress-code" className="article-sub-link">Explore Palette &amp; HEX Codes ↗</Link>
          </article>
          <article>
            <span>03</span>
            <h3>Gifts &amp; Registry</h3>
            <p>Explore our curated wishlist of home essentials or bless us with a monetary cash gift towards our new beginning.</p>
            <Link href="/gifts" className="article-sub-link">Browse Gift Registry ↗</Link>
          </article>
        </div>
      </section>

      {/* Dress Color Code Section */}
      <section id="dress-code" className="dress-code-section section-shell" aria-labelledby="dress-code-title">
        <div className="dress-code-header">
          <p className="eyebrow">Attire &amp; Palette</p>
          <h2 id="dress-code-title">Dress Color Code</h2>
          <p className="dress-code-desc">
            We invite you to celebrate in style! Our official color palette brings together rich romantic tones and fresh botanical hues. Guests are warmly encouraged to incorporate any of these four curated shades into their wedding attire.
          </p>
        </div>

        <div className="dress-code-grid">
          {dressColors.map((color) => (
            <article
              key={color.name}
              className="color-card"
              onClick={() => handleCopyColor(color.hex)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleCopyColor(color.hex)
              }}
              title="Click to copy HEX code"
            >
              <div
                className="color-swatch-box"
                style={{ backgroundColor: color.hex, color: color.textColor }}
              >
                <span className="color-tag-badge">{color.tag}</span>
                <span className="color-hex-badge">
                  {copiedColor === color.hex ? '✓ Copied!' : color.hex}
                </span>
              </div>
              <div className="color-card-body">
                <div className="color-card-title-row">
                  <h3 className="color-name">{color.name}</h3>
                  <span className="color-dot" style={{ backgroundColor: color.hex }} />
                </div>
                <p className="color-desc">{color.description}</p>
                <div className="color-styling-tip">
                  <span className="styling-label">Style Inspiration</span>
                  <p className="styling-text">{color.styling}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="dress-code-guide-card">
          <div className="guide-icon">✨</div>
          <div className="guide-content">
            <h4>Attire Guidelines &amp; Palette Notes</h4>
            <p>
              <strong>Dress Code:</strong> Formal / Black Tie Elegance &amp; Modern Traditional Glamour.
              Guests are welcome to style in any of our four official shades (Burgundy, Blush, Mint Green, or Olive Green), or pair them gracefully with classic neutrals (black, ivory, gold, or champagne).
            </p>
          </div>
        </div>
      </section>

      {/* Horizontal Scrolling Gifts Registry Section */}
      <section id="gifts" className="registry-section section-shell" aria-labelledby="gifts-title">
        <div className="registry-horizontal-header">
          <div className="registry-horizontal-title-wrap">
            <p className="eyebrow">A little something</p>
            <h2 id="gifts-title">Wedding Gifts</h2>
            <p className="registry-desc">
              We are so grateful to celebrate with you. For loved ones who have asked how to bless our new beginning, here is a preview of our curated wishlist.
            </p>
          </div>
          <div className="registry-horizontal-actions">
            <div className="carousel-nav-buttons">
              <button
                type="button"
                className="carousel-arrow-btn"
                onClick={() => scrollGifts('left')}
                aria-label="Scroll gifts left"
              >
                ←
              </button>
              <button
                type="button"
                className="carousel-arrow-btn"
                onClick={() => scrollGifts('right')}
                aria-label="Scroll gifts right"
              >
                →
              </button>
            </div>
            <Link href="/gifts" className="see-full-registry-link">
              View All {registryGifts.length} Gifts <span>↗</span>
            </Link>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div className="gifts-horizontal-scroller" ref={giftScrollRef}>
          {registryGifts.map((gift) => (
            <article key={gift.id} className="gift-horizontal-card">
              <div className="gift-image-wrap" onClick={() => setSelectedGift(gift)}>
                <img src={gift.image} alt={gift.title} loading="lazy" />
                <span className="gift-category-tag">{gift.categoryLabel}</span>
              </div>
              <div className="gift-card-body">
                <div className="gift-card-main">
                  <h3>{gift.title}</h3>
                  <div className="gift-price-tag">{gift.price}</div>
                  <p>{gift.description}</p>
                </div>
                <div className="gift-card-footer">
                  <button
                    type="button"
                    className="gift-btn"
                    onClick={() => setSelectedGift(gift)}
                  >
                    Gift This Item <span>↗</span>
                  </button>
                </div>
              </div>
            </article>
          ))}

          {/* View More End Card */}
          <Link href="/gifts" className="gift-view-more-card" aria-label="View all items in gift registry">
            <div className="view-more-inner">
              <span className="view-more-icon">🎁</span>
              <span className="view-more-badge">Full Registry</span>
              <h3>Explore All {registryGifts.length} Gifts</h3>
              <p>Filter by categories, search items, and view gifting guidelines.</p>
              <span className="view-more-btn">
                View Full Registry <span>↗</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="cash-blessings-banner">
          <div className="cash-banner-copy">
            <span className="eyebrow">Monetary Gifts</span>
            <h3>Prefer to send cash blessings?</h3>
            <p>
              If you wish to honor us with a cash gift towards our new home, you may transfer directly using our wedding account details:
            </p>
          </div>
          <div className="cash-banner-card">
            <div className="bank-info-item">
              <span className="bank-info-label">Bank</span>
              <strong className="bank-info-val">Guaranty Trust Bank (GTB)</strong>
            </div>
            <div className="bank-info-item">
              <span className="bank-info-label">Account Name</span>
              <strong className="bank-info-val">Ngozi &amp; Sorbari Wedding</strong>
            </div>
            <div className="bank-info-item">
              <span className="bank-info-label">Account Number</span>
              <strong className="bank-info-val font-mono">0123456789</strong>
            </div>
            <button
              type="button"
              className="copy-account-btn"
              onClick={() => handleCopyAccount('0123456789')}
            >
              {copiedBank ? '✓ Account Number Copied!' : 'Copy Account Number'}
            </button>
          </div>
        </div>
      </section>

      {/* Gift Modal */}
      {selectedGift && (
        <div className="gift-modal-backdrop" onClick={() => setSelectedGift(null)}>
          <div className="gift-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className="modal-close-btn" onClick={() => setSelectedGift(null)} aria-label="Close dialog">✕</button>
            <div className="modal-grid">
              <div className="modal-photo">
                <img src={selectedGift.image} alt={selectedGift.title} />
              </div>
              <div className="modal-info">
                <span className="modal-tag">{selectedGift.categoryLabel}</span>
                <h2>{selectedGift.title}</h2>
                <div className="modal-price-tag">{selectedGift.price}</div>
                <p className="modal-summary">{selectedGift.description}</p>

                <div className="modal-gifting-guide">
                  <h4>How to Gift This:</h4>
                  <p>
                    You may purchase this item directly or transfer the value (<strong>{selectedGift.price}</strong>) with the reference <strong>&quot;{selectedGift.title}&quot;</strong>.
                  </p>
                  <div className="modal-bank-box">
                    <div className="bank-line"><span>Bank:</span> <strong>Guaranty Trust Bank (GTB)</strong></div>
                    <div className="bank-line"><span>Account Name:</span> <strong>Ngozi &amp; Sorbari Wedding</strong></div>
                    <div className="bank-line"><span>Account Number:</span> <strong>0123456789</strong></div>
                    <div className="bank-line"><span>Item Value:</span> <strong>{selectedGift.price}</strong></div>
                    <button
                      type="button"
                      className="modal-copy-btn"
                      onClick={() => handleCopyAccount('0123456789')}
                    >
                      {copiedBank ? '✓ Account Copied!' : 'Copy Account Number'}
                    </button>
                  </div>
                </div>

                <div className="modal-actions">
                  <a
                    className="modal-email-btn"
                    href={`mailto:hello@example.com?subject=Wedding%20Gift%20-%20${encodeURIComponent(selectedGift.title)}%20(${encodeURIComponent(selectedGift.price)})&body=Hello%20Ngozi%20%26%20Sorbari,%0A%0AI%20would%20like%20to%20bless%20you%20with%20the%20${encodeURIComponent(selectedGift.title)}%20(${encodeURIComponent(selectedGift.price)})!`}
                  >
                    Notify Couple via Email <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RSVP Call to Action Banner Section */}
      <section id="rsvp" className="rsvp-section section-shell" aria-labelledby="rsvp-title">
        <div className="home-rsvp-card">
          <div className="home-rsvp-content">
            <span className="rsvp-pill-badge">Celebration Attendance</span>
            <h2 id="rsvp-title">Will you celebrate with us?</h2>
            <p className="home-rsvp-desc">
              We would be deeply honored by your presence as we exchange our vows and celebrate our love. Register your attendance in advance to instantly receive your personalized digital wedding pass and reserved table seating.
            </p>

            <div className="home-rsvp-perks">
              <div className="rsvp-perk-item">
                <span className="perk-icon">🎟️</span>
                <div>
                  <strong>Instant Digital Pass</strong>
                  <p>VIP guest pass with entry QR &amp; barcode</p>
                </div>
              </div>
              <div className="rsvp-perk-item">
                <span className="perk-icon">✨</span>
                <div>
                  <strong>Reserved Seating</strong>
                  <p>Guaranteed seating &amp; banquet service</p>
                </div>
              </div>
            </div>

            <div className="home-rsvp-actions">
              <Link href="/rsvp" className="home-rsvp-cta-btn">
                Confirm RSVP &amp; Get Guest Pass ↗
              </Link>
            </div>
          </div>

          <div className="home-rsvp-ticket-preview">
            <div className="sample-ticket-card">
              <div className="sample-ticket-header">
                <span className="sample-monogram">ENSORB</span>
                <span className="sample-badge">VIP GUEST PASS</span>
              </div>
              <div className="sample-ticket-body">
                <div className="sample-guest-row">
                  <div className="sample-avatar">NS</div>
                  <div>
                    <span className="sample-label">VIP Guest Pass</span>
                    <h4>Honored Guest</h4>
                    <span className="sample-meta">Table 07 • Oct 31, 2026</span>
                  </div>
                </div>
                <div className="sample-divider" />
                <div className="sample-venue-line">
                  <strong>Christ Embassy Ogba 1</strong>
                  <span>2:00 PM Prompt • Lagos</span>
                </div>
                <div className="sample-barcode-box">
                  <div className="sample-barcode" />
                  <span className="sample-code">PASS-NS-2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="faq section-shell" aria-labelledby="faq-title">
        <div className="faq-intro">
          <p className="eyebrow">Good to know</p>
          <h2 id="faq-title">A few helpful answers.</h2>
          <p>If there is anything else you would like to know, please get in touch with us.</p>
        </div>
        <div className="faq-list">
          {faqData.map((faq, idx) => (
            <details key={faq.question} open={idx === 0}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
