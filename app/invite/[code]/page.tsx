'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessCardPass } from '@/components/AccessCardPass'
import { Invite } from '@/lib/types'
import {
  Check,
  Mail,
  Printer,
  Calendar,
  Share2,
  AlertCircle,
  Copy,
  Sparkles,
  Camera,
  UserCheck,
  QrCode,
  ShieldCheck,
  Lock,
} from 'lucide-react'

interface PageProps {
  params: Promise<{ code: string }>
}

export default function UniqueInvitePage({ params }: PageProps) {
  const resolvedParams = use(params)
  const code = resolvedParams.code

  const [invite, setInvite] = useState<Invite | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Registration form state
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    attendance: 'attending' as 'attending' | 'declined',
    actualGuestCount: 1,
    photoDataUrl: '',
    dietaryOrNotes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  // Fetch invite on mount
  useEffect(() => {
    async function loadInvite() {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/invites/${encodeURIComponent(code)}`)
        const data = await res.json()

        if (!res.ok || !data.success || !data.invite) {
          setNotFound(true)
        } else {
          setInvite(data.invite)
          // Pre-populate target name and max seats if not registered
          if (!data.invite.isRegistered) {
            setFormData((prev) => ({
              ...prev,
              guestName: data.invite.targetName || '',
              actualGuestCount: data.invite.maxGuests || 1,
            }))
          }
        }
      } catch (err) {
        console.error('Error fetching invite:', err)
        setNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }
    loadInvite()
  }, [code])

  // Handle local photo selection with real-time base64 preview
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Please choose an image under 8MB.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photoDataUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle registration submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/invites/${encodeURIComponent(code)}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          actualGuestCount: Number(formData.actualGuestCount) || 1,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Registration failed. Please try again.')
        if (data.invite) {
          setInvite(data.invite)
        }
      } else {
        setInvite(data.invite)
        window.scrollTo({ top: 120, behavior: 'smooth' })
      }
    } catch (err) {
      console.error('Error during registration:', err)
      setErrorMessage('A network error occurred. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Resend Email Pass
  const handleResendEmail = async () => {
    if (!invite || isResending) return
    setIsResending(true)
    setResendStatus(null)

    try {
      const res = await fetch(`/api/invites/${encodeURIComponent(code)}/resend`, {
        method: 'POST',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setResendStatus(`✓ Pass successfully sent to ${invite.guestEmail || 'your email'}!`)
        setTimeout(() => setResendStatus(null), 6000)
      } else {
        setResendStatus(`✕ ${data.error || 'Failed to resend pass.'}`)
      }
    } catch {
      setResendStatus('✕ Network error while sending email.')
    } finally {
      setIsResending(false)
    }
  }

  // Copy link
  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 3000)
    }
  }

  // Generate Google Calendar Link
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding:+Ngozi+%26+Sorbari&dates=20261031T130000Z/20261031T200000Z&details=Official+Wedding+Celebration+of+Ngozi+Emele+Kalu+and+Sorbari+Godwin+Uebari.+Pass+ID:+${invite?.passId || ''}&location=Christ+Embassy+Ogba+1,+Lagos,+Nigeria`

  return (
    <main className="elegant-burgundy-theme unique-invite-page">
      <Navbar />

      {/* Hero Section */}
      <section className="subpage-hero section-shell">
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/rsvp">RSVP</Link>
          <span>/</span>
          <strong>Personal Invitation ({code})</strong>
        </div>
        <p className="eyebrow">The Holy Matrimony Of</p>
        <h1>Ngozi &amp; Sorbari</h1>
        <p className="subpage-hero-desc">
          Saturday, October 31, 2026 • 2:00 PM • Christ Embassy Ogba 1, Lagos, Nigeria
        </p>
      </section>

      <section className="invite-main-container section-shell">
        {isLoading ? (
          <div className="invite-loading-card">
            <div className="loading-spinner" />
            <p>Retrieving your personalized invitation details...</p>
          </div>
        ) : notFound || !invite ? (
          <div className="invite-error-card">
            <AlertCircle className="error-icon" size={48} />
            <h2>Invitation Code Not Found</h2>
            <p>
              The invitation code <strong>&quot;{code}&quot;</strong> could not be found or has expired.
              Please check the exact link sent to you by the couple or reach out to them for an updated invite.
            </p>
            <div className="error-actions">
              <Link href="/rsvp" className="primary-btn">
                Visit General RSVP Page ↗
              </Link>
              <Link href="/" className="secondary-btn">
                Return to Home
              </Link>
            </div>
          </div>
        ) : !invite.isRegistered ? (
          /* =========================================================================
             UNREGISTERED STATE: PERSONALIZED INVITATION & REGISTRATION FORM
             ========================================================================= */
          <div className="invite-registration-wrapper">
            {/* Formal Invitation Header Banner */}
            <div className="personalized-invite-banner">
              <div className="banner-monogram">
                <img src="/logo.png" alt="ENSORB 2026" style={{ height: 48, width: 'auto', margin: '0 auto 8px', objectFit: 'contain' }} />
              </div>
              <span className="banner-tag">OFFICIAL WEDDING INVITATION</span>
              <h2>{invite.targetName ? `Warmly Inviting ${invite.targetName}` : 'You Are Cordially Invited'}</h2>
              <p className="banner-welcome">
                Ngozi Emele Kalu &amp; Sorbari Godwin Uebari joyfully invite you to share in the celebration of their holy matrimony.
              </p>

              <div className="reserved-perks-grid">
                <div className="perk-box">
                  <span className="perk-label">Your Assigned Table</span>
                  <strong className="perk-val">{invite.tableNumber}</strong>
                </div>
                <div className="perk-box">
                  <span className="perk-label">Reserved Seat Allowance</span>
                  <strong className="perk-val">
                    {invite.maxGuests} {invite.maxGuests === 1 ? 'Guest (1 Seat)' : `Guests (${invite.maxGuests} Seats)`}
                  </strong>
                </div>
                <div className="perk-box">
                  <span className="perk-label">Invitation Category</span>
                  <strong className="perk-val">{invite.category} Honor Guest</strong>
                </div>
              </div>

              {invite.customNote && (
                <div className="banner-custom-note">
                  <Sparkles size={16} className="sparkle-icon" />
                  <span>&quot;{invite.customNote}&quot;</span>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="invite-alert-banner error">
                <AlertCircle size={20} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Registration Form Card */}
            <div className="rsvp-form-container invite-form-card">
              <div className="rsvp-form-header">
                <h3>Confirm Attendance &amp; Receive Your Digital Pass</h3>
                <p>
                  Please fill in your details below. Your custom pass card with table assignment ({invite.tableNumber}) will generate instantly and be emailed to you.
                </p>
              </div>

              <form onSubmit={handleRegister} className="rsvp-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="guestName">
                      Your Full Name / Family Name <span>*</span>
                    </label>
                    <input
                      id="guestName"
                      type="text"
                      required
                      placeholder="e.g. Dr. Samuel Adeleke &amp; Partner"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="guestEmail">
                      Email Address (To Receive Your Card) <span>*</span>
                    </label>
                    <input
                      id="guestEmail"
                      type="email"
                      required
                      placeholder="e.g. samuel@example.com"
                      value={formData.guestEmail}
                      onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                    />
                    <small className="field-hint">Your official digital card &amp; QR pass will be emailed here.</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="guestPhone">
                      Phone / WhatsApp Number <span>*</span>
                    </label>
                    <input
                      id="guestPhone"
                      type="tel"
                      required
                      placeholder="e.g. +234 802 345 6789"
                      value={formData.guestPhone}
                      onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="actualGuestCount">
                      Number of Guests Attending
                    </label>
                    <select
                      id="actualGuestCount"
                      value={formData.actualGuestCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          actualGuestCount: Number(e.target.value),
                        })
                      }
                    >
                      {Array.from({ length: invite.maxGuests }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest (1 Seat)' : `Guests (${num} Seats)`}
                        </option>
                      ))}
                    </select>
                    <small className="field-hint">
                      Maximum reserved limit for this invite is {invite.maxGuests} seat{invite.maxGuests > 1 ? 's' : ''}.
                    </small>
                  </div>
                </div>

                {/* Attendance Options */}
                <div className="form-group attendance-group">
                  <label>Will you be celebrating with us? <span>*</span></label>
                  <div className="attendance-options">
                    <label
                      className={`attendance-option ${
                        formData.attendance === 'attending' ? 'active' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value="attending"
                        checked={formData.attendance === 'attending'}
                        onChange={() => setFormData({ ...formData, attendance: 'attending' })}
                      />
                      <span>✓ Joyfully Attending</span>
                    </label>
                    <label
                      className={`attendance-option ${
                        formData.attendance === 'declined' ? 'active' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value="declined"
                        checked={formData.attendance === 'declined'}
                        onChange={() => setFormData({ ...formData, attendance: 'declined' })}
                      />
                      <span>✕ Regretfully Declining</span>
                    </label>
                  </div>
                </div>

                {/* Cloudinary Guest Photo Upload */}
                <div className="form-group photo-upload-group">
                  <label>
                    Guest Photo / Portrait <span className="label-badge">Featured on Card</span>
                  </label>
                  <p className="photo-instructions">
                    Upload your favorite portrait. It will be custom-embedded onto your official wedding pass card!
                  </p>

                  <div className="photo-upload-container">
                    {formData.photoDataUrl ? (
                      <div className="photo-preview-wrap">
                        <img
                          src={formData.photoDataUrl}
                          alt="Guest preview"
                          className="photo-preview-img"
                        />
                        <div className="photo-preview-overlay">
                          <button
                            type="button"
                            className="photo-remove-btn"
                            onClick={() => setFormData({ ...formData, photoDataUrl: '' })}
                          >
                            Change Photo ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="photo-dropzone">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoSelect}
                          className="photo-file-input"
                        />
                        <div className="dropzone-icon-ring">
                          <Camera size={28} />
                        </div>
                        <span className="photo-dropzone-text">Click or drag a portrait photo to upload</span>
                        <span className="photo-dropzone-hint">PNG, JPG, WEBP • Cloudinary Optimized</span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Dietary & Wishes */}
                <div className="form-group">
                  <label htmlFor="dietaryOrNotes">
                    Wishes for Ngozi &amp; Sorbari / Dietary Preferences (Optional)
                  </label>
                  <textarea
                    id="dietaryOrNotes"
                    rows={3}
                    placeholder="Send your warm blessings to the couple or mention any dietary requirements..."
                    value={formData.dietaryOrNotes}
                    onChange={(e) =>
                      setFormData({ ...formData, dietaryOrNotes: e.target.value })
                    }
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="rsvp-submit-button invite-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="btn-loading-content">
                      <span className="spinner-mini" /> Activating Pass &amp; Sending Email...
                    </span>
                  ) : (
                    'Activate RSVP & Generate Official Wedding Pass ↗'
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* =========================================================================
             REGISTERED STATE: DESIGN CARD / WEDDING PASS & ACTIONS (LINK LOCKED)
             ========================================================================= */
          <div className="registered-pass-container">
            {/* Security banner informing that the link is verified */}
            <div className="link-locked-notice">
              <div className="lock-icon-wrap">
                <Lock size={18} />
              </div>
              <div className="lock-text">
                <strong>Invitation Registered &amp; Verified</strong>
                <span>
                  This unique invitation link is registered to <strong>{invite.guestName}</strong>. You can view, save, or download your official lanyard Access Card below.
                </span>
              </div>
            </div>

            {/* Official Luxury Access Card / Wedding Pass (Sample Design Match) */}
            <AccessCardPass
              invite={invite}
              onResendEmail={handleResendEmail}
              isResending={isResending}
              resendStatus={resendStatus}
            />

            {/* Dress code and ceremony notes */}
            <div className="rsvp-info-cards-grid pass-guidelines">
              <div className="rsvp-info-card">
                <span className="info-icon">🎨</span>
                <h4>Official Dress Code</h4>
                <p>Burgundy, Blush, Mint Green, or Olive Green. Formal, traditional, or black-tie elegant.</p>
              </div>
              <div className="rsvp-info-card">
                <span className="info-icon">🎁</span>
                <h4>Wedding Wishlist</h4>
                <p>
                  Explore our curated wishlist or send contributions directly via the{' '}
                  <Link href="/wishlist" style={{ textDecoration: 'underline', color: '#6B1D2F' }}>
                    Wishlist Page
                  </Link>.
                </p>
              </div>
              <div className="rsvp-info-card">
                <span className="info-icon">⏰</span>
                <h4>Arrival Time</h4>
                <p>Kindly be seated by 1:30 PM. Prelude begins ahead of the 2:00 PM bridal procession.</p>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
