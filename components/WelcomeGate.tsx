'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { MonogramLogo } from '@/components/WeddingIcons'

export function WelcomeGate() {
  const [isUnlocked, setIsUnlocked] = useState(true) // default true for SSR safety
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [cardRevealed, setCardRevealed] = useState(false)
  const [cardFloating, setCardFloating] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const pathname = usePathname()
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    // Check session storage on client mount
    if (typeof window !== 'undefined') {
      const unlocked = sessionStorage.getItem('ensorb_wedding_unlocked')
      if (pathname && pathname.startsWith('/admin')) {
        setIsUnlocked(true)
      } else if (!unlocked) {
        setIsUnlocked(false)
      }
    }
  }, [pathname])

  // Play a rich, extended celestial harp / chime arpeggio on unsealing
  const playUnsealSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = audioContextRef.current || new AudioCtx()
      audioContextRef.current = ctx
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      // Elegant harmonic arpeggio extended: C5, E5, G5, B5, C6, E6, G6, B6 (523, 659, 784, 987, 1046, 1318, 1568, 1975 Hz)
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51, 1567.98, 1975.53]
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12)

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12)
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + idx * 0.12 + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 2.0)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(ctx.currentTime + idx * 0.12)
        osc.stop(ctx.currentTime + idx * 0.12 + 2.1)
      })
    } catch {
      // Non-blocking audio fallback
    }
  }

  const handleUnlock = () => {
    if (isUnlocking) return
    setIsUnlocking(true)
    playUnsealSound()

    // Step 1: Flap lifts, seal glints, inner card begins rising (0.75s)
    setTimeout(() => {
      setCardRevealed(true)
    }, 750)

    // Step 2: Inner card reaches peak and floats gracefully in center with light rays (2.0s)
    setTimeout(() => {
      setCardFloating(true)
    }, 2000)

    // Step 3: Store in session storage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ensorb_wedding_unlocked', 'true')
    }

    // Step 4: Golden light dissolve begins (3.6s)
    setTimeout(() => {
      setIsFadingOut(true)
    }, 3600)

    // Step 5: Full portal reveal (4.4s)
    setTimeout(() => {
      setIsUnlocked(true)
      setIsUnlocking(false)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('ensorb-portal-unlocked'))
      }
    }, 4400)
  }

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ensorb_wedding_unlocked', 'true')
      window.dispatchEvent(new Event('ensorb-portal-unlocked'))
    }
    setIsUnlocked(true)
  }

  // Bypass on admin or if already unlocked
  if (isUnlocked || (pathname && pathname.startsWith('/admin'))) {
    return null
  }

  return (
    <div
      className={`wedding-journey-gate ${isUnlocking ? 'is-opening' : ''} ${
        cardRevealed ? 'card-out' : ''
      } ${cardFloating ? 'card-floating-stage' : ''} ${isFadingOut ? 'is-fading-out' : ''}`}
      onClick={handleUnlock}
      role="button"
      tabIndex={0}
      aria-label="Tap to unlock wedding journey"
    >
      {/* Background Ambience & Moving Light Beams */}
      <div className="journey-bg-layer" />
      <div className="journey-lighting-vignette" />

      {/* Moving Ambient Light Beams & Sunburst Rays */}
      <div className="journey-moving-lights-container" aria-hidden="true">
        <div className="moving-light-beam beam-1" />
        <div className="moving-light-beam beam-2" />
        <div className="moving-light-beam beam-3" />
        <div className="aurora-glow-drift" />
        {isUnlocking && <div className="moving-sunburst-rays" />}
      </div>

      {/* Floating Rose Petals & Golden Shimmer Bokeh */}
      <div className="journey-floating-elements" aria-hidden="true">
        <span className="petal petal-1" />
        <span className="petal petal-2" />
        <span className="petal petal-3" />
        <span className="petal petal-4" />
        <span className="petal petal-5" />
        <span className="gold-bokeh bokeh-1" />
        <span className="gold-bokeh bokeh-2" />
        <span className="gold-bokeh bokeh-3" />
        <span className="gold-bokeh bokeh-4" />
        <span className="gold-bokeh bokeh-5" />
        <span className="gold-bokeh bokeh-6" />
      </div>

      {/* Quick Skip Intro Button */}
      <button
        type="button"
        className="gate-skip-btn"
        onClick={handleSkip}
        title="Skip intro animation"
      >
        <span>Enter Site ✕</span>
      </button>

      {/* Main Foreground Container */}
      <div className="journey-content-shell">
        {/* TOP HEADER */}
        <header className="journey-header">
          {/* Centered Monogram Logo */}
          <div className="journey-logo-wrap">
            <MonogramLogo size={58} className="journey-monogram" />
          </div>

          <span className="journey-eyebrow">WELCOME TO OUR</span>
          <h1 className="journey-title">Wedding Journey</h1>

          {/* Heart Divider */}
          <div className="journey-heart-divider">
            <span className="line" />
            <span className="heart">♡</span>
            <span className="line" />
          </div>

          <p className="journey-subtitle">Two hearts. One beautiful journey.</p>
        </header>

        {/* CENTER INTERACTIVE ENVELOPE */}
        <div className="journey-envelope-stage">
          <div className="journey-envelope-3d">
            {/* Inner Wedding Invitation Letter (Slides Up & Floats on Opening) */}
            <div className="journey-inner-card">
              <div className="card-sheen-sweep" />
              <div className="inner-card-deckle-border">
                <span className="inner-card-eyebrow">A CELEBRATION OF LOVE</span>
                <h3 className="inner-card-names">Ngozi &amp; Sorbari</h3>
                <div className="inner-card-divider">
                  <span className="line" />
                  <span className="dot">✦</span>
                  <span className="line" />
                </div>
                <p className="inner-card-date">OCTOBER 31, 2026 • LAGOS</p>
                <p className="inner-card-blessing">
                  We are blessed to share our forever with you ♡
                </p>
                {cardFloating && (
                  <div className="card-opening-sparkle-stars">
                    <span className="mini-star star-1">✦</span>
                    <span className="mini-star star-2">✦</span>
                    <span className="mini-star star-3">✦</span>
                  </div>
                )}
              </div>
            </div>

            {/* Envelope Back Base */}
            <div className="envelope-back-pocket" />

            {/* Envelope Flap (Flips Open 180deg on Click) */}
            <div className="envelope-top-flap">
              <svg viewBox="0 0 540 240" fill="none" preserveAspectRatio="none" className="flap-svg">
                <path
                  d="M0,0 L270,165 C275,168 280,168 285,165 L540,0 L540,15 C540,15 285,185 270,185 C255,185 0,15 0,15 Z"
                  fill="#F5EFE6"
                />
                <path
                  d="M0,0 L270,165 C275,168 280,168 285,165 L540,0"
                  stroke="#E2D7C8"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Envelope Front Body with Deckled Linen Texture */}
            <div className="envelope-front-body">
              {/* Twine Gold Strings */}
              <div className="envelope-twine-cross">
                <div className="twine-line twine-horizontal" />
                <div className="twine-line twine-diagonal" />
              </div>

              {/* Baby's Breath Floral Sprig */}
              <div className="envelope-babys-breath">
                <svg viewBox="0 0 160 120" fill="none" className="floral-svg">
                  <path d="M10 80 C 50 60, 90 40, 140 10" stroke="#7A8050" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
                  <path d="M60 55 C 80 40, 100 35, 120 20" stroke="#7A8050" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
                  <path d="M40 65 C 55 52, 70 48, 85 36" stroke="#7A8050" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
                  {/* Delicate White Flower Buds */}
                  <circle cx="140" cy="10" r="4.5" fill="#FFFFFF" stroke="#DCD5C8" strokeWidth="0.8" />
                  <circle cx="132" cy="18" r="3.5" fill="#FFFFFF" />
                  <circle cx="120" cy="20" r="4" fill="#FFFFFF" stroke="#DCD5C8" strokeWidth="0.8" />
                  <circle cx="112" cy="28" r="3" fill="#FFFFFF" />
                  <circle cx="102" cy="32" r="3.8" fill="#FFFFFF" stroke="#DCD5C8" strokeWidth="0.8" />
                  <circle cx="85" cy="36" r="3.5" fill="#FFFFFF" />
                  <circle cx="75" cy="45" r="3" fill="#FFFFFF" />
                  <circle cx="68" cy="50" r="3.8" fill="#FFFFFF" stroke="#DCD5C8" strokeWidth="0.8" />
                  <circle cx="55" cy="56" r="3" fill="#FFFFFF" />
                  <circle cx="48" cy="62" r="3.2" fill="#FFFFFF" />
                </svg>
              </div>

              {/* Deep Burgundy Glossy Wax Seal */}
              <div className="envelope-wax-seal">
                <div className="seal-glow-halo" />
                {isUnlocking && <div className="seal-burst-flare" />}
                <div className="seal-medallion-body">
                  <span className="seal-monogram">N&amp;S</span>
                </div>
              </div>

              {/* Hand-lettered Inscription */}
              <p className="envelope-script-message">A special message awaits...</p>
            </div>
          </div>
        </div>

        {/* BOTTOM TAP TO UNLOCK CONTROLLER */}
        <footer className="journey-footer">
          <div className="tap-unlock-controller">
            {/* Pulsing Ray Accents */}
            <div className="tap-rays rays-left">
              <span className="ray r1" />
              <span className="ray r2" />
              <span className="ray r3" />
            </div>

            {/* Glowing Circular Button */}
            <div className="tap-envelope-circle">
              <div className="circle-ripple-ring ring-a" />
              <div className="circle-ripple-ring ring-b" />
              <div className="circle-inner-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="envelope-icon-svg">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
            </div>

            {/* Pulsing Ray Accents Right */}
            <div className="tap-rays rays-right">
              <span className="ray r1" />
              <span className="ray r2" />
              <span className="ray r3" />
            </div>
          </div>

          <span className="tap-unlock-caption">
            {isUnlocking ? 'UNSEALING WEDDING INVITATION...' : 'TAP TO UNLOCK'}
          </span>
        </footer>
      </div>
    </div>
  )
}
