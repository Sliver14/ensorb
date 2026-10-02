'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function RsvpPage() {
  const [rsvpData, setRsvpData] = useState({
    fullName: '',
    email: '',
    phone: '',
    attendance: 'attending',
    guestCount: '1',
    note: '',
    photo: '',
  })
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false)
  const [ticketPass, setTicketPass] = useState<{
    id: string
    name: string
    email: string
    phone: string
    attendance: string
    guestCount: string
    photo: string
    date: string
  } | null>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setRsvpData((prev) => ({ ...prev, photo: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rsvpData.fullName || !rsvpData.email) return

    setIsSubmittingRsvp(true)
    setTimeout(() => {
      const passId = `PASS-NS-${Math.floor(1000 + Math.random() * 9000)}`
      setTicketPass({
        id: passId,
        name: rsvpData.fullName,
        email: rsvpData.email,
        phone: rsvpData.phone || '+234 800 000 0000',
        attendance: rsvpData.attendance,
        guestCount: rsvpData.guestCount,
        photo: rsvpData.photo || '',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      })
      setIsSubmittingRsvp(false)
    }, 600)
  }

  const resetRsvp = () => {
    setTicketPass(null)
    setRsvpData({
      fullName: '',
      email: '',
      phone: '',
      attendance: 'attending',
      guestCount: '1',
      note: '',
      photo: '',
    })
  }

  return (
    <main className="wedding-site">
      <Navbar />

      <section className="subpage-hero section-shell">
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <strong>RSVP &amp; Tickets</strong>
        </div>
        <p className="eyebrow">We Hope You Can Join Us</p>
        <h1>Guest Registration &amp; Tickets</h1>
        <p className="subpage-hero-desc">
          We would be honored by your presence as we exchange our vows and celebrate our love. Please register your attendance below to generate your personalized digital wedding pass.
        </p>
      </section>

      <section className="rsvp-main-section section-shell">
        {!ticketPass ? (
          <div className="rsvp-form-container">
            <div className="rsvp-form-header">
              <h2>Confirm Your Attendance</h2>
              <p>Please provide your details so we can reserve your seat and prepare your welcome pass.</p>
            </div>

            <form onSubmit={handleRsvpSubmit} className="rsvp-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name <span>*</span></label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="e.g. Samuel Adeleke"
                    value={rsvpData.fullName}
                    onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address <span>*</span></label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="e.g. samuel@example.com"
                    value={rsvpData.email}
                    onChange={(e) => setRsvpData({ ...rsvpData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone / WhatsApp <span>*</span></label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="e.g. +234 801 234 5678"
                    value={rsvpData.phone}
                    onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="guestCount">Number of Reserved Seats</label>
                  <select
                    id="guestCount"
                    value={rsvpData.guestCount}
                    onChange={(e) => setRsvpData({ ...rsvpData, guestCount: e.target.value })}
                  >
                    <option value="1">1 Guest (Solo)</option>
                    <option value="2">2 Guests (With Plus One)</option>
                    <option value="3">3 Guests (Family)</option>
                    <option value="4">4 Guests (Family)</option>
                  </select>
                </div>
              </div>

              <div className="form-group attendance-group">
                <label>Will you be attending? <span>*</span></label>
                <div className="attendance-options">
                  <label className={`attendance-option ${rsvpData.attendance === 'attending' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="attendance"
                      value="attending"
                      checked={rsvpData.attendance === 'attending'}
                      onChange={() => setRsvpData({ ...rsvpData, attendance: 'attending' })}
                    />
                    <span>✓ Joyfully Attending</span>
                  </label>
                  <label className={`attendance-option ${rsvpData.attendance === 'declined' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="attendance"
                      value="declined"
                      checked={rsvpData.attendance === 'declined'}
                      onChange={() => setRsvpData({ ...rsvpData, attendance: 'declined' })}
                    />
                    <span>✕ Regretfully Declining</span>
                  </label>
                </div>
              </div>

              <div className="form-group photo-upload-group">
                <label>Guest Photo / Avatar (for your digital ticket)</label>
                <div className="photo-upload-container">
                  {rsvpData.photo ? (
                    <div className="photo-preview-wrap">
                      <img src={rsvpData.photo} alt="Guest preview" className="photo-preview-img" />
                      <button
                        type="button"
                        className="photo-remove-btn"
                        onClick={() => setRsvpData({ ...rsvpData, photo: '' })}
                      >
                        Change Photo ✕
                      </button>
                    </div>
                  ) : (
                    <label className="photo-dropzone">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="photo-file-input"
                      />
                      <span className="photo-dropzone-icon">📷</span>
                      <span className="photo-dropzone-text">Click or drag an image to upload</span>
                      <span className="photo-dropzone-hint">PNG, JPG, WEBP up to 5MB</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="note">Wishes for the Couple / Dietary Preferences (Optional)</label>
                <textarea
                  id="note"
                  rows={3}
                  placeholder="Share a warm congratulatory note or any special requests..."
                  value={rsvpData.note}
                  onChange={(e) => setRsvpData({ ...rsvpData, note: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="rsvp-submit-button"
                disabled={isSubmittingRsvp}
              >
                {isSubmittingRsvp ? 'Generating Ticket Pass...' : 'Register & Generate Wedding Pass ↗'}
              </button>
            </form>
          </div>
        ) : (
          <div className="ticket-result-container">
            <div className="ticket-success-message">
              <span className="success-icon">✓</span>
              <h2>Registration Confirmed!</h2>
              <p>Your digital wedding pass has been generated. Please save or present this pass at the reception.</p>
            </div>

            <div className="digital-ticket-pass" id="digital-wedding-pass">
              <div className="ticket-pass-header">
                <div className="ticket-monogram">ENSORB</div>
                <span className="ticket-badge">VIP GUEST PASS</span>
              </div>

              <div className="ticket-pass-body">
                <div className="ticket-guest-profile">
                  {ticketPass.photo ? (
                    <img src={ticketPass.photo} alt={ticketPass.name} className="ticket-avatar" />
                  ) : (
                    <div className="ticket-avatar-placeholder">
                      {ticketPass.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="ticket-guest-info">
                    <span className="ticket-label">Guest Name</span>
                    <h3 className="ticket-guest-name">{ticketPass.name}</h3>
                    <span className="ticket-guest-details">{ticketPass.email} • {ticketPass.phone}</span>
                  </div>
                </div>

                <div className="ticket-divider-notch" />

                <div className="ticket-event-grid">
                  <div className="ticket-meta-box">
                    <span className="ticket-meta-label">Event</span>
                    <strong className="ticket-meta-val">Ngozi &amp; Sorbari Wedding</strong>
                  </div>
                  <div className="ticket-meta-box">
                    <span className="ticket-meta-label">Date &amp; Time</span>
                    <strong className="ticket-meta-val">Saturday, Oct 31, 2026 • 2:00 PM</strong>
                  </div>
                  <div className="ticket-meta-box">
                    <span className="ticket-meta-label">Venue</span>
                    <strong className="ticket-meta-val">Christ Embassy Ogba 1, Lagos</strong>
                  </div>
                  <div className="ticket-meta-box">
                    <span className="ticket-meta-label">Seats Reserved</span>
                    <strong className="ticket-meta-val">{ticketPass.guestCount} {ticketPass.guestCount === '1' ? 'Seat' : 'Seats'} (Table 07)</strong>
                  </div>
                </div>

                <div className="ticket-pass-footer">
                  <div className="ticket-barcode-wrap">
                    <div className="ticket-barcode-lines" />
                    <span className="ticket-pass-id">{ticketPass.id}</span>
                  </div>
                  <div className="ticket-qr-box">
                    <div className="ticket-qr-sim">QR</div>
                    <span className="ticket-qr-label">SCAN AT ENTRANCE</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="ticket-actions">
              <button
                type="button"
                className="ticket-print-btn"
                onClick={() => window.print()}
              >
                Print / Save Wedding Pass 🖨
              </button>
              <button
                type="button"
                className="ticket-new-btn"
                onClick={resetRsvp}
              >
                Register Another Guest ↺
              </button>
            </div>
          </div>
        )}

        <div className="rsvp-info-cards-grid">
          <div className="rsvp-info-card">
            <span className="info-icon">📍</span>
            <h4>Ceremony &amp; Venue</h4>
            <p>Christ Embassy Ogba 1, Lagos. Complimentary parking and security are available on site.</p>
          </div>
          <div className="rsvp-info-card">
            <span className="info-icon">🎨</span>
            <h4>Dress Color Code</h4>
            <p>Burgundy, Blush, Mint Green, or Olive Green. Black-tie formal or contemporary traditional.</p>
          </div>
          <div className="rsvp-info-card">
            <span className="info-icon">⏰</span>
            <h4>Punctuality</h4>
            <p>Kindly arrive and be seated by 1:30 PM for the prelude and bridal entrance at 2:00 PM prompt.</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
