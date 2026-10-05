'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AmbientAtmosphere } from '@/components/AmbientAtmosphere'
import {
  MonogramLogo,
  BotanicalSprig,
  HeroCornerFlower,
  ChurchIcon,
  ChampagneIcon,
  CalendarEventIcon,
  HeroBottomTornWithWash,
  TornBannerEdge,
} from '@/components/WeddingIcons'

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 207, hours: 16, minutes: 42, seconds: 18 })

  useEffect(() => {
    const weddingDate = new Date('2026-11-21T11:00:00+01:00').getTime()
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
    <div className="layout-countdown-grid" aria-label="Countdown to wedding">
      <div className="countdown-col">
        <strong className="count-num">{timeLeft.days}</strong>
        <span className="count-label">DAYS</span>
      </div>
      <span className="count-divider" />
      <div className="countdown-col">
        <strong className="count-num">{String(timeLeft.hours).padStart(2, '0')}</strong>
        <span className="count-label">HOURS</span>
      </div>
      <span className="count-divider" />
      <div className="countdown-col">
        <strong className="count-num">{String(timeLeft.minutes).padStart(2, '0')}</strong>
        <span className="count-label">MINUTES</span>
      </div>
      <span className="count-divider" />
      <div className="countdown-col">
        <strong className="count-num">{String(timeLeft.seconds).padStart(2, '0')}</strong>
        <span className="count-label">SECONDS</span>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const handleCopyColor = (colorName: string, hex: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hex)
      setCopiedColor(colorName)
      setTimeout(() => setCopiedColor(null), 2000)
    }
  }

  const faqItems = [
    {
      question: 'How do I RSVP?',
      answer:
        'Simply click the RSVP tab or button, enter your unique invitation code, and your digital wedding pass will generate instantly for easy download and gate verification.',
    },
    {
      question: 'Can I bring a plus-one?',
      answer:
        'Your personalized digital wedding pass reflects the number of reserved seats allocated to your invitation. Please check your pass details or contact us directly if you have inquiries.',
    },
    {
      question: 'What is the dress code?',
      answer:
        'Our official wedding colors are Burgundy, Blush, Mint Green, and Olive Green. We warmly invite you to dress in formal, traditional, or black-tie elegant attire reflecting this palette!',
    },
    {
      question: 'How does the wedding wishlist and cash contributions work?',
      answer:
        'You can browse our curated home wishlist on the Wishlist page to gift an entire item or make a partial contribution of any amount. You may also transfer monetary blessings directly using our designated Parallex Bank details.',
    },
    {
      question: 'When will the reception details be available?',
      answer:
        'The church ceremony begins at 11:00 AM at Christ Embassy Ogba 1 (25 Odusanmi Street, Ogba), followed by the grand reception at 1:00 PM at CELVZ Youth Church (24 Sanyaolu Street, Oregun, Ikeja). For RSVP inquiries, contact Bright (09066157126) or Faith (08079071291).',
    },
  ]

  const paletteColors = [
    { name: 'Burgundy', hex: '#5C1D2E', colorClass: 'swatch-burgundy' },
    { name: 'Blush', hex: '#E5A1A8', colorClass: 'swatch-blush' },
    { name: 'Mint Green', hex: '#8FAFA0', colorClass: 'swatch-mint' },
    { name: 'Olive Green', hex: '#5E6140', colorClass: 'swatch-olive' },
  ]

  return (
    <main className="elegant-burgundy-theme">
      {/* Top Header */}
      <Navbar />

      {/* ====================================================================
          SECTION 1: HERO (SPLIT TORN PAPER LAYOUT)
         ==================================================================== */}
      <section className="hero-split-section">
        {/* Left: Romantic Couple Portrait */}
        <div className="hero-photo-wrap">
          <img
            src="/couple/IMG_4784-Recovered.jpg"
            alt="Ngozi & Sorbari Wedding Portrait"
            className="hero-couple-img"
          />
        </div>

        {/* Right: Torn Paper Deckled Card */}
        <div className="hero-deckled-card">
          {/* Vertical Torn Edge Overlap */}
          <div className="hero-vertical-torn-edge" aria-hidden="true" />

          {/* Large Corner Flower draped over top right */}
          <HeroCornerFlower className="hero-corner-flower floating-flower-sway" />

          <div className="hero-card-inner">
            <span className="eyebrow-spaced">THE WEDDING OF</span>

            <h1 className="hero-couple-title">
              Ngozi <span className="script-amp">&amp;</span>
              <br />
              Sorbari
            </h1>

            <div className="hero-date-box">
              <span className="hero-date-text font-serif">21 NOVEMBER 2026</span>
              <span className="hero-time-text">11:00 AM</span>
            </div>

            <p className="hero-script-tagline">
              Two hearts, one beautiful journey.
            </p>

            {/* Countdown Grid */}
            <CountdownTimer />

            {/* CTA Buttons */}
            <div className="hero-buttons-row">
              <Link href="/rsvp" className="btn-burgundy-pill">
                RSVP <span className="btn-arrow">→</span>
              </Link>
              <Link href="/wishlist" className="btn-cream-outline-pill">
                <span className="btn-icon">🎁</span> Gift Registry
              </Link>
            </div>
          </div>
        </div>

        {/* Dual-layer Bottom Torn Paper Edge with Soft Blush Watercolor Wash */}
        <HeroBottomTornWithWash className="hero-bottom-wash-edge" />
      </section>

      {/* ====================================================================
          SECTION 2: OUR STORY (TWO HEARTS, ONE JOURNEY & POLAROID)
         ==================================================================== */}
      <section className="our-story-section">
        {/* Section Scoped Ambient Atmosphere */}
        <AmbientAtmosphere sparkleCount={6} petalCount={4} />

        <div className="story-content-grid">
          {/* Left Text */}
          <div className="story-copy-col reveal-fade-left">
            <span className="eyebrow-spaced">OUR STORY</span>
            <h2 className="story-title">
              Two Hearts,
              <span className="script-title-block">One Journey</span>
            </h2>
            <p className="story-paragraph">
              Sometimes, God begins writing a story long before we realise it is ours to tell. From serving together in Campus Ministry to reconnecting in Lagos, God turned a simple friendship into a lifelong journey of faith and love.
            </p>
            <div className="story-learn-more-wrap">
              <span className="story-hairline" />
              <Link href="/story" className="story-learn-more-link">
                Read Our Story <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right Polaroid Photo */}
          <div className="story-polaroid-col reveal-fade-right">
            <div className="washi-polaroid-frame floating-polaroid-motion">
              {/* Washi Masking Tape on Top */}
              <div className="washi-tape-strip" />

              <div className="polaroid-photo-inner">
                <img
                  src="/couple/story-polaroid.png"
                  alt="Ngozi & Sorbari smiling studio portrait"
                  className="polaroid-img"
                />
              </div>

              {/* Botanical Leaf sprig under Polaroid */}
              <BotanicalSprig className="polaroid-botanical-corner floating-botanical-sway" />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: WEDDING DETAILS (THE BIG DAY - 3 COLUMNS)
         ==================================================================== */}
      <section className="wedding-details-section">
        <div className="details-header-center reveal-fade-up">
          <span className="eyebrow-spaced">WEDDING DETAILS</span>
          <h2 className="section-serif-title">The Big Day</h2>
        </div>

        <div className="details-three-col-grid reveal-stagger">
          {/* 1. CEREMONY */}
          <div className="detail-col-card">
            <div className="detail-icon-wrap">
              <ChurchIcon />
            </div>
            <span className="detail-col-eyebrow">CEREMONY</span>
            <h3 className="detail-col-title">Christ Embassy Ogba 1</h3>
            <p className="detail-col-address">
              25 Odusanmi Street, Ogba, Lagos (Landmark: AY Hotel)
            </p>
            <span className="detail-col-time">11:00 AM Prompt</span>
            <a
              href="https://maps.google.com/?q=25+Odusanmi+Street+Ogba+Lagos"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-detail-pill"
            >
              <span className="pin-icon">📍</span> Get Directions
            </a>
          </div>

          <div className="detail-vertical-divider" />

          {/* 2. RECEPTION */}
          <div className="detail-col-card">
            <div className="detail-icon-wrap">
              <ChampagneIcon />
            </div>
            <span className="detail-col-eyebrow">RECEPTION</span>
            <h3 className="detail-col-title">CELVZ Youth Church</h3>
            <p className="detail-col-address">
              24 Sanyaolu Street, Oregun, Ikeja, Lagos
            </p>
            <span className="detail-col-time">1:00 PM Prompt</span>
            <a
              href="https://maps.google.com/?q=24+Sanyaolu+Street+Oregun+Ikeja+Lagos"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-detail-pill"
            >
              <span className="pin-icon">📍</span> Get Directions
            </a>
          </div>

          <div className="detail-vertical-divider" />

          {/* 3. DATE */}
          <div className="detail-col-card">
            <div className="detail-icon-wrap">
              <CalendarEventIcon />
            </div>
            <span className="detail-col-eyebrow">DATE</span>
            <h3 className="detail-col-title">21 November 2026</h3>
            <p className="detail-col-address">Saturday</p>
            <span className="detail-col-time">11:00 AM (Church) | 1:00 PM (Reception)</span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: OUR WEDDING COLOURS
         ==================================================================== */}
      <section className="wedding-colors-section">
        <BotanicalSprig className="colors-sprig-left floating-botanical-sway" />
        <BotanicalSprig className="colors-sprig-right floating-botanical-sway" />

        <div className="colors-header-center reveal-fade-up">
          <span className="eyebrow-spaced">OUR WEDDING COLOURS</span>
          <p className="colors-subtitle">A combination of love, elegance and nature</p>
        </div>

        <div className="palette-swatches-row reveal-stagger">
          {paletteColors.map((color) => (
            <div
              key={color.name}
              className="swatch-item-wrap reveal-zoom-in"
              onClick={() => handleCopyColor(color.name, color.hex)}
              title={`Click to copy ${color.hex}`}
            >
              <div
                className={`swatch-circle ${color.colorClass}`}
                style={{ backgroundColor: color.hex }}
              />
              <span className="swatch-label">{color.name}</span>
              {copiedColor === color.name && (
                <span className="copied-tag">Copied!</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: FULL-WIDTH TORN-EDGE QUOTE BANNER
         ==================================================================== */}
      <section className="quote-banner-section-wrapper">
        <TornBannerEdge position="top" color="#FAF7F2" />

        <div className="quote-banner-split reveal-fade-up">
          {/* Left: Romantic Portrait Photo */}
          <div className="quote-photo-col">
            <img
              src="/couple/quote-portrait.jpg"
              alt="Ngozi & Sorbari intimate embrace"
              className="quote-couple-img"
            />
          </div>

          {/* Right: Velvet Burgundy Torn Card */}
          <div className="quote-burgundy-card">
            {/* Vertical Torn Edge that organically tears across the couple's photo */}
            <div className="quote-vertical-torn-edge" aria-hidden="true" />

            <div className="quote-burgundy-inner">
              <blockquote className="romantic-script-quote">
                Together
                <br />
                <span>is our favourite</span>
                <br />
                place to be.
              </blockquote>

              <span className="quote-burgundy-hairline" />

              <cite className="quote-author-tag">NGOZI &amp; SORBARI</cite>
            </div>
          </div>
        </div>

        <TornBannerEdge position="bottom" color="#FAF7F2" />
      </section>

      {/* ====================================================================
          SECTION 6: CONTACT & FAQ
         ==================================================================== */}
      <section className="contact-faq-section">
        <div className="faq-content-grid reveal-fade-up">
          {/* Left Column: Get in touch */}
          <div className="faq-contact-col reveal-fade-left">
            <span className="eyebrow-spaced">GET IN TOUCH</span>
            <h2 className="faq-main-title">Contact &amp; FAQ</h2>
            <p className="faq-contact-desc">
              Have a question? We&apos;d love to hear from you.
            </p>
            <a
              href="mailto:hello@ensorb.com?subject=Wedding%20Inquiry%20-%20Ngozi%20%26%20Sorbari"
              className="btn-send-message-pill"
            >
              <span className="mail-icon">✉</span> Send a Message
            </a>
          </div>

          {/* Right Column: Accordion FAQ */}
          <div className="faq-accordion-col reveal-stagger">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index
              return (
                <div
                  key={item.question}
                  className={`faq-accordion-item ${isOpen ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer-pane">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
