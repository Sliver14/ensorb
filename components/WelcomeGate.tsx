'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { MonogramLogo } from '@/components/WeddingIcons'

export function WelcomeGate() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [cardRevealed, setCardRevealed] = useState(false)
  const [cardFloating, setCardFloating] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const pathname = usePathname()
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    // Check session storage on client mount
    if (typeof window !== 'undefined') {
      const isAdm = window.location.pathname.startsWith('/admin')
      const unlocked = sessionStorage.getItem('ensorb_wedding_unlocked')
      if (isAdm || unlocked === 'true') {
        setIsUnlocked(true)
        document.documentElement.classList.remove('ensorb-locked')
        document.documentElement.classList.add('ensorb-unlocked')
      } else {
        setIsUnlocked(false)
        document.documentElement.classList.remove('ensorb-unlocked')
        document.documentElement.classList.add('ensorb-locked')
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
        document.documentElement.classList.remove('ensorb-locked')
        document.documentElement.classList.add('ensorb-unlocked')
        window.dispatchEvent(new Event('ensorb-portal-unlocked'))
      }
    }, 4400)
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
                <p className="inner-card-date">NOVEMBER 21, 2026 • LAGOS</p>
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

              {/* Baby's Breath & Rosebud Floral Sprig */}
              <div className="envelope-babys-breath">
                <svg viewBox="0 0 170 130" fill="none" className="floral-svg">
                  <defs>
                    <linearGradient id="gateStemGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#434B24" />
                      <stop offset="60%" stopColor="#677338" />
                      <stop offset="100%" stopColor="#8F9C52" />
                    </linearGradient>
                    <linearGradient id="gateLeafSage" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C4DDD2" />
                      <stop offset="60%" stopColor="#87B09F" />
                      <stop offset="100%" stopColor="#4A7060" />
                    </linearGradient>
                    <linearGradient id="gateRoseBlush" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="40%" stopColor="#FDE6EA" />
                      <stop offset="80%" stopColor="#E59CA8" />
                      <stop offset="100%" stopColor="#B3364E" />
                    </linearGradient>
                    <radialGradient id="gateGoldDot" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#FFF9E0" />
                      <stop offset="50%" stopColor="#E5C158" />
                      <stop offset="100%" stopColor="#8C660B" />
                    </radialGradient>
                  </defs>

                  {/* Main Arched Stems */}
                  <path d="M12 90 C 50 68, 95 44, 150 14" stroke="url(#gateStemGrad)" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M65 62 C 85 46, 110 40, 130 22" stroke="url(#gateStemGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
                  <path d="M42 74 C 60 58, 80 52, 98 38" stroke="url(#gateStemGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
                  <path d="M90 48 C 105 38, 120 42, 138 34" stroke="url(#gateStemGrad)" strokeWidth="1.1" strokeLinecap="round" opacity="0.75" />

                  {/* Delicate Sage Leaves */}
                  <path d="M38 74 C 28 66, 32 56, 44 60 C 42 68, 40 72, 38 74 Z" fill="url(#gateLeafSage)" />
                  <path d="M64 58 C 54 48, 60 38, 72 42 C 70 50, 68 56, 64 58 Z" fill="url(#gateLeafSage)" />
                  <path d="M92 44 C 84 34, 90 24, 102 28 C 99 36, 96 42, 92 44 Z" fill="url(#gateLeafSage)" />

                  {/* Miniature Blush Rosebud tucked beside twine */}
                  <g transform="translate(48, 68) rotate(-25)">
                    <path d="M-6 6 C -3 -3, 0 -6, 2 -9 C 4 -6, 7 -3, 10 6 Z" fill="#58632E" />
                    <path d="M-3 -1 C -1 -11, 4 -12, 5 -4 C 4 2, -1 4, -3 -1 Z" fill="url(#gateRoseBlush)" />
                    <circle cx="1" cy="-4" r="1.5" fill="#FFF2F4" />
                  </g>

                  {/* Multi-layered Baby's Breath Florets with Gold Centers */}
                  <circle cx="150" cy="14" r="4.5" fill="#FFFFFF" stroke="#DCD5C8" strokeWidth="0.8" />
                  <circle cx="150" cy="14" r="1.2" fill="url(#gateGoldDot)" />

                  <circle cx="140" cy="22" r="3.6" fill="#FFFDF8" stroke="#DCD5C8" strokeWidth="0.7" />
                  <circle cx="140" cy="22" r="1" fill="url(#gateGoldDot)" />

                  <circle cx="130" cy="22" r="4.2" fill="#FFFFFF" stroke="#DCD5C8" strokeWidth="0.8" />
                  <circle cx="130" cy="22" r="1.1" fill="url(#gateGoldDot)" />

                  <circle cx="138" cy="34" r="3.4" fill="#FFFDF8" />
                  <circle cx="138" cy="34" r="0.9" fill="url(#gateGoldDot)" />

                  <circle cx="120" cy="30" r="3.8" fill="#FFFFFF" stroke="#DCD5C8" strokeWidth="0.8" />
                  <circle cx="120" cy="30" r="1" fill="url(#gateGoldDot)" />

                  <circle cx="110" cy="36" r="3.5" fill="#FFFDF8" />
                  <circle cx="110" cy="36" r="0.9" fill="url(#gateGoldDot)" />

                  <circle cx="98" cy="38" r="4.2" fill="#FFFFFF" stroke="#DCD5C8" strokeWidth="0.8" />
                  <circle cx="98" cy="38" r="1.1" fill="url(#gateGoldDot)" />

                  <circle cx="86" cy="46" r="3.6" fill="#FFFDF8" />
                  <circle cx="86" cy="46" r="0.9" fill="url(#gateGoldDot)" />

                  <circle cx="78" cy="52" r="3.8" fill="#FFFFFF" stroke="#DCD5C8" strokeWidth="0.8" />
                  <circle cx="78" cy="52" r="1" fill="url(#gateGoldDot)" />

                  <circle cx="62" cy="62" r="3.2" fill="#FFFDF8" />
                  <circle cx="62" cy="62" r="0.8" fill="url(#gateGoldDot)" />

                  <circle cx="52" cy="68" r="3.4" fill="#FFFFFF" stroke="#DCD5C8" strokeWidth="0.7" />
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
