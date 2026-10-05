'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import {
  BotanicalSprig,
  CardCornerBotanical,
  HeroBottomTornWithWash,
  PinLocationIcon,
  CalendarEventIcon,
  ChampagneIcon,
  PaperPlaneIcon,
  MonogramLogo,
} from '@/components/WeddingIcons'

export default function RsvpPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [attending, setAttending] = useState<'yes' | 'no'>('yes')
  const [guestCount, setGuestCount] = useState<string>('1')
  const [message, setMessage] = useState('')
  const [inviteCode, setInviteCode] = useState('')

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submittedData, setSubmittedData] = useState<any | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!fullName.trim()) {
      setSubmitError('Please enter your full name.')
      return
    }

    if (!email.trim()) {
      setSubmitError('Please enter your email address.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          attending: attending === 'yes' ? 'attending' : 'declined',
          guestCount: attending === 'yes' ? Number(guestCount) || 1 : 0,
          message: message.trim(),
          inviteCode: inviteCode.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success && data.invite) {
        setSubmittedData(data.invite)
      } else {
        setSubmitError(data.error || 'Failed to submit your RSVP. Please try again.')
      }
    } catch {
      setSubmitError('Network error while processing RSVP. Please check your connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="elegant-burgundy-theme rsvp-page-layout">
      {/* ====================================================================
          SECTION 1: HERO (WE CAN'T WAIT TO CELEBRATE WITH YOU)
         ==================================================================== */}
      <section className="rsvp-hero-split-section">
        <div className="rsvp-hero-split-container">
          {/* Left Column: Couple Photo with Torn Edge */}
          <div className="rsvp-hero-photo-col reveal-fade-left">
            <img
              src="/couple/IMG_6075.png"
              alt="Ngozi & Sorbari loving couple portrait"
              className="rsvp-hero-couple-img"
            />
            {/* Torn Paper Deckled Edge */}
            <div className="rsvp-hero-torn-divider" aria-hidden="true">
              <svg viewBox="0 0 40 800" preserveAspectRatio="none" className="torn-edge-svg">
                <path
                  d="M14,0 C22,40 10,100 24,160 C34,220 16,280 26,340 C34,400 12,460 24,520 C34,580 14,640 26,700 C32,750 18,780 22,800 L40,800 L40,0 Z"
                  fill="#FAF7F2"
                />
              </svg>
            </div>
          </div>

          {/* Right Column: Hero Typography Card */}
          <div className="rsvp-hero-copy-col reveal-fade-right">
            {/* Top-Right Corner Botanical Sprig */}
            <BotanicalSprig className="rsvp-hero-corner-botanical floating-botanical-sway" />

            <div className="rsvp-hero-copy-inner">
              <span className="eyebrow-spaced">— RSVP —</span>

              <h1 className="rsvp-hero-headline">
                We Can&apos;t Wait
                <br />
                <span>to Celebrate With You</span>
              </h1>

              <p className="rsvp-hero-script-desc">
                Kindly let us know if you&apos;ll be joining us
                <br />
                on our special day.
              </p>

              {/* Heart Divider */}
              <div className="rsvp-heart-divider">
                <span className="divider-line" />
                <span className="divider-heart">♡</span>
                <span className="divider-line" />
              </div>
            </div>
          </div>
        </div>

        {/* Soft Watercolor Torn Wash Bottom Transition */}
        <HeroBottomTornWithWash />
      </section>

      {/* ====================================================================
          SECTION 2: MAIN CONTENT (RSVP FORM + EVENT DETAILS / POLAROID)
         ==================================================================== */}
      <section className="rsvp-content-section" id="rsvp-form-section">
        <div className="rsvp-content-grid">
          {/* LEFT COLUMN: RSVP FORM CARD */}
          <div className="rsvp-form-column reveal-fade-left">
            <div className="rsvp-form-card">
              <h2 className="rsvp-form-title">RSVP FORM</h2>
              <p className="rsvp-form-instruction">
                Please fill in the form below to confirm your attendance and let us know if you&apos;ll be joining us for our wedding celebration.
              </p>

              {submitError && (
                <div className="rsvp-alert-box error">
                  <span className="alert-icon">⚠️</span>
                  <span>{submitError}</span>
                </div>
              )}

              {submittedData ? (
                /* Success Confirmation State */
                <div className="rsvp-success-box">
                  <div className="success-badge-icon">
                    {submittedData.approvalStatus === 'pending' ? '⏳' : '✓'}
                  </div>
                  <h3 className="success-heading">
                    {submittedData.attendance === 'declined'
                      ? 'Thank You for Letting Us Know'
                      : submittedData.approvalStatus === 'pending'
                      ? 'RSVP Received & Under Review ✨'
                      : 'RSVP Confirmed & Access Card Ready! 🎟️'}
                  </h3>
                  <p className="success-desc">
                    {submittedData.attendance === 'declined'
                      ? `Dear ${submittedData.guestName}, thank you for your warm wishes. You will be dearly missed on our special day!`
                      : submittedData.approvalStatus === 'pending'
                      ? `Dear ${submittedData.guestName}, thank you for submitting your RSVP! Your reservation is currently being reviewed by Ngozi & Sorbari. Once approved, your official Access Card, assigned table, and entry QR code will be emailed directly to ${submittedData.guestEmail}.`
                      : `Dear ${submittedData.guestName}, we are overjoyed that you will be celebrating with us! Your official wedding Access Card has been activated.`}
                  </p>

                  {submittedData.attendance !== 'declined' && (
                    <div className="rsvp-pass-summary-card">
                      <div className="summary-row">
                        <span className="lbl">Approval Status:</span>
                        <strong
                          style={{
                            color:
                              submittedData.approvalStatus === 'pending' ? '#B87333' : '#2E7D32',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                          }}
                        >
                          {submittedData.approvalStatus === 'pending'
                            ? '⏳ Pending Couple Approval'
                            : '✓ Approved & Access Pass Active'}
                        </strong>
                      </div>
                      <div className="summary-row">
                        <span className="lbl">Assigned Table:</span>
                        <strong className="text-burgundy">
                          {submittedData.approvalStatus === 'pending'
                            ? 'Allocated upon approval'
                            : submittedData.tableNumber}
                        </strong>
                      </div>
                      <div className="summary-row">
                        <span className="lbl">Guests Requested:</span>
                        <strong>{submittedData.actualGuestCount} Guest(s)</strong>
                      </div>
                      <div className="summary-row">
                        <span className="lbl">Email Notification:</span>
                        <span>{submittedData.guestEmail}</span>
                      </div>
                    </div>
                  )}

                  <div className="success-actions">
                    {submittedData.approvalStatus !== 'pending' && (
                      <Link href={`/invite/${submittedData.code}`} className="btn-view-pass">
                        View Digital Pass <span>→</span>
                      </Link>
                    )}
                    <button
                      type="button"
                      className="btn-reset-form"
                      onClick={() => {
                        setSubmittedData(null)
                        setFullName('')
                        setEmail('')
                        setPhone('')
                        setMessage('')
                      }}
                    >
                      Submit Another RSVP
                    </button>
                  </div>
                </div>
              ) : (
                /* Active RSVP Form */
                <form onSubmit={handleSubmit} className="rsvp-actual-form">
                  {/* FULL NAME */}
                  <div className="form-group">
                    <label htmlFor="fullName">
                      FULL NAME <span className="req">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  {/* EMAIL ADDRESS */}
                  <div className="form-group">
                    <label htmlFor="email">
                      EMAIL ADDRESS <span className="req">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  {/* PHONE NUMBER */}
                  <div className="form-group">
                    <label htmlFor="phone">
                      PHONE NUMBER <span className="req">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  {/* WILL YOU BE ATTENDING? */}
                  <div className="form-group">
                    <label className="attending-label">
                      WILL YOU BE ATTENDING? <span className="req">*</span>
                    </label>
                    <div className="attending-toggle-row">
                      <button
                        type="button"
                        className={`attending-pill-btn ${attending === 'yes' ? 'selected' : ''}`}
                        onClick={() => setAttending('yes')}
                      >
                        Yes, I&apos;ll be there
                      </button>
                      <button
                        type="button"
                        className={`attending-pill-btn ${attending === 'no' ? 'selected' : ''}`}
                        onClick={() => setAttending('no')}
                      >
                        No, I can&apos;t make it
                      </button>
                    </div>
                  </div>

                  {/* NUMBER OF GUESTS */}
                  {attending === 'yes' && (
                    <div className="form-group">
                      <label htmlFor="guestCount">
                        NUMBER OF GUESTS (INCL. YOU) <span className="req">*</span>
                      </label>
                      <div className="select-wrap">
                        <select
                          id="guestCount"
                          value={guestCount}
                          onChange={(e) => setGuestCount(e.target.value)}
                          className="form-control select-control"
                        >
                          <option value="1">1 Guest</option>
                          <option value="2">2 Guests</option>
                          <option value="3">3 Guests</option>
                          <option value="4">4 Guests</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* SPECIAL MESSAGE */}
                  <div className="form-group">
                    <label htmlFor="message">SPECIAL MESSAGE (OPTIONAL)</label>
                    <textarea
                      id="message"
                      rows={3}
                      placeholder="Leave us a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="form-control textarea-control"
                    />
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-rsvp-submit"
                  >
                    <PaperPlaneIcon size={16} />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit RSVP'}</span>
                    <span className="btn-arrow">→</span>
                  </button>

                  {/* Bottom Heart Divider */}
                  <div className="form-bottom-divider">
                    <span className="line" />
                    <span className="heart">♡</span>
                    <span className="line" />
                  </div>
                </form>
              )}
            </div>

            {/* Botanical Foliage on bottom left */}
            <CardCornerBotanical className="rsvp-bottom-left-botanical floating-botanical-sway" />
          </div>

          {/* RIGHT COLUMN: POLAROID + EVENT DETAILS + GENTLE REMINDER */}
          <div className="rsvp-details-column reveal-fade-right">
            {/* 1. Tilted Centerpiece Polaroid */}
            <div className="rsvp-polaroid-wrapper">
              <div className="washi-polaroid-frame rsvp-table-polaroid floating-polaroid-motion">
                <div className="washi-tape-strip" />
                <div className="polaroid-photo-inner">
                  <img
                    src="/couple/table-centerpiece.jpg"
                    alt="Romantic wedding dining centerpiece with candle lantern"
                    className="polaroid-img"
                  />
                </div>
                <BotanicalSprig className="polaroid-botanical-corner floating-botanical-sway" />
              </div>
            </div>

            {/* 2. EVENT DETAILS */}
            <div className="rsvp-event-details-block reveal-fade-up">
              <span className="eyebrow-spaced">EVENT DETAILS</span>

              <div className="event-detail-item">
                <div className="event-icon-circle">
                  <CalendarEventIcon className="icon-svg" />
                </div>
                <div className="event-item-text">
                  <span className="detail-tag">Date</span>
                  <strong className="detail-val">21 November 2026</strong>
                  <span className="detail-sub">11:00 AM (Church) | 1:00 PM (Reception)</span>
                </div>
              </div>

              <div className="event-detail-item">
                <div className="event-icon-circle">
                  <PinLocationIcon size={22} className="icon-svg" />
                </div>
                <div className="event-item-text">
                  <span className="detail-tag">Ceremony (11:00 AM)</span>
                  <strong className="detail-val">Christ Embassy Ogba 1</strong>
                  <span className="detail-sub">
                    25 Odusanmi St, Ogba, Lagos (Landmark: AY Hotel)
                  </span>
                </div>
              </div>

              <div className="event-detail-item">
                <div className="event-icon-circle">
                  <ChampagneIcon className="icon-svg" />
                </div>
                <div className="event-item-text">
                  <span className="detail-tag">Reception (1:00 PM)</span>
                  <strong className="detail-val">CELVZ Youth Church</strong>
                  <span className="detail-sub">
                    24 Sanyaolu St, Oregun, Ikeja, Lagos
                  </span>
                </div>
              </div>

              <div className="event-details-divider-line" />
            </div>

            {/* 3. A GENTLE REMINDER CARD */}
            <div className="rsvp-gentle-reminder-card">
              <div className="reminder-heart-top">♥</div>
              <h3 className="reminder-cursive-title">A Gentle Reminder</h3>
              <p className="reminder-body-text">
                Your response helps us plan and make this day even more special. We sincerely hope you can join us!
              </p>
              <div className="reminder-signature">Thank you</div>
              <div className="reminder-names-stamp">— N &amp; S —</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: FOOTER
         ==================================================================== */}
      <Footer />
    </main>
  )
}
