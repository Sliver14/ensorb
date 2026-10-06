'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { Invite } from '@/lib/types'
import {
  Download,
  Calendar,
  Share2,
  Mail,
  Check,
  Sparkles,
  Gift,
  Copy,
  ShieldCheck,
  Lock,
} from 'lucide-react'

interface AccessCardPassProps {
  invite: Invite
  onResendEmail?: () => void
  isResending?: boolean
  resendStatus?: string | null
}

export function AccessCardPass({
  invite,
  onResendEmail,
  isResending = false,
  resendStatus = null,
}: AccessCardPassProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState(false)

  const guestName = (invite.guestName || invite.targetName || 'Valued Guest').toUpperCase()
  const guestCount = invite.actualGuestCount || invite.maxGuests || 1
  const accessCode = invite.accessCode || invite.passId || invite.code
  const passUrl = typeof window !== 'undefined' ? `${window.location.origin}/invite/${invite.code}` : `https://ensorb.com/invite/${invite.code}`

  const handleCopyAccount = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText('2003361527')
    setCopiedAccount(true)
    setTimeout(() => setCopiedAccount(false), 2500)
  }

  // Download high-resolution PNG invitation card directly onto HTML5 Canvas
  const handleDownloadCard = async () => {
    try {
      setIsGeneratingImage(true)
      const canvas = document.createElement('canvas')
      canvas.width = 1080
      canvas.height = 1920
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // 1. Background Marble Cream Fill
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 1920)
      bgGrad.addColorStop(0, '#FAF7F2')
      bgGrad.addColorStop(0.5, '#F4EFEB')
      bgGrad.addColorStop(1, '#EFEAE1')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, 1080, 1920)

      // 2. Outer Luxury Gold Border
      ctx.strokeStyle = '#D4AF37'
      ctx.lineWidth = 14
      ctx.strokeRect(40, 40, 1000, 1840)

      // Inner thin gold frame
      ctx.strokeStyle = '#E5D5AA'
      ctx.lineWidth = 4
      ctx.strokeRect(60, 60, 960, 1800)

      // 3. Top Lanyard Slot
      ctx.fillStyle = '#4A1525'
      ctx.beginPath()
      ctx.roundRect(470, 75, 140, 32, 16)
      ctx.fill()
      ctx.strokeStyle = '#D4AF37'
      ctx.lineWidth = 4
      ctx.stroke()

      // 4. Header Rings Emblem & OFFICIAL INVITATION
      ctx.fillStyle = '#4A1525'
      ctx.textAlign = 'center'
      ctx.font = 'bold 42px "Cinzel", Georgia, serif'
      ctx.letterSpacing = '10px'
      ctx.fillText('OFFICIAL INVITATION', 540, 260)

      // 5. Couple Headline
      ctx.font = '800 62px "Cinzel", Georgia, serif'
      ctx.letterSpacing = '4px'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('NGOZI & SORBARI', 540, 370)

      ctx.font = '600 30px "Montserrat", sans-serif'
      ctx.letterSpacing = '8px'
      ctx.fillStyle = '#7D6B64'
      ctx.fillText('WEDDING CEREMONY & ACCESS CARD', 540, 430)

      // 6. Gold Divider Bar
      ctx.strokeStyle = '#D4AF37'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(120, 480)
      ctx.lineTo(960, 480)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(120, 600)
      ctx.lineTo(960, 600)
      ctx.stroke()

      // Event Date & Time
      ctx.font = 'bold 34px "Montserrat", sans-serif'
      ctx.letterSpacing = '4px'
      ctx.fillStyle = '#2B2725'
      ctx.fillText('SATURDAY, 21ST NOVEMBER, 2026', 540, 530)

      ctx.font = '500 26px "Montserrat", sans-serif'
      ctx.letterSpacing = '2px'
      ctx.fillStyle = '#7D6B64'
      ctx.fillText('11:00 AM (CHURCH) | 1:00 PM (RECEPTION)', 540, 574)

      // 7. GUEST DETAILS Box
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.roundRect(120, 640, 840, 490, 20)
      ctx.fill()
      ctx.strokeStyle = '#D4AF37'
      ctx.lineWidth = 6
      ctx.stroke()

      ctx.font = 'bold 36px "Cinzel", Georgia, serif'
      ctx.letterSpacing = '8px'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('— GUEST DETAILS —', 540, 715)

      ctx.textAlign = 'left'
      const startX = 170
      let curY = 795

      ctx.font = 'bold 30px "Montserrat", sans-serif'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('Name:', startX, curY)
      ctx.font = '600 30px "Montserrat", sans-serif'
      ctx.fillStyle = '#2B2725'
      ctx.fillText(guestName, startX + 130, curY)

      curY += 72
      ctx.font = 'bold 30px "Montserrat", sans-serif'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('Seat Number:', startX, curY)
      ctx.font = '600 30px "Montserrat", sans-serif'
      ctx.fillStyle = '#2B2725'
      ctx.fillText(`${invite.tableNumber} (${invite.category})`, startX + 240, curY)

      curY += 72
      ctx.font = 'bold 30px "Montserrat", sans-serif'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('Number of Guests:', startX, curY)
      ctx.font = '600 30px "Montserrat", sans-serif'
      ctx.fillStyle = '#2B2725'
      ctx.fillText(`${guestCount} ${guestCount === 1 ? 'Guest (1 Seat)' : 'Guests'}`, startX + 310, curY)

      curY += 72
      ctx.font = 'bold 30px "Montserrat", sans-serif'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('Access Code:', startX, curY)
      ctx.font = 'bold 34px monospace'
      ctx.fillStyle = '#4A1525'
      ctx.fillText(accessCode, startX + 230, curY)

      // 8. Draw Wedding Gift & Blessing Section (replacing QR code)
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.roundRect(120, 1160, 840, 390, 20)
      ctx.fill()
      ctx.strokeStyle = '#D4AF37'
      ctx.lineWidth = 6
      ctx.stroke()

      ctx.textAlign = 'center'
      ctx.font = 'bold 34px "Cinzel", Georgia, serif'
      ctx.letterSpacing = '4px'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('🎁 HAVE YOU GIFTED THE COUPLE YET?', 540, 1225)

      ctx.font = '600 24px "Montserrat", sans-serif'
      ctx.letterSpacing = '1px'
      ctx.fillStyle = '#7D6B64'
      ctx.fillText('Bless Ngozi & Sorbari with a wedding gift or financial support', 540, 1270)

      // Bank Details Pill inside Canvas
      ctx.fillStyle = '#FAF7F2'
      ctx.beginPath()
      ctx.roundRect(160, 1300, 760, 140, 14)
      ctx.fill()
      ctx.strokeStyle = '#E5D5AA'
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.textAlign = 'left'
      ctx.font = 'bold 22px "Montserrat", sans-serif'
      ctx.fillStyle = '#7D6B64'
      ctx.fillText('DIRECT BANK TRANSFER:', 190, 1340)

      ctx.font = 'bold 30px "Montserrat", sans-serif'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('Parallex Bank • 2003361527', 190, 1380)

      ctx.font = '600 21px "Montserrat", sans-serif'
      ctx.fillStyle = '#2B2725'
      ctx.fillText('SORBARI GODWIN UEBARI AND NGOZI EMELE KALU', 190, 1418)

      // Wishlist Link Notice
      ctx.textAlign = 'center'
      ctx.font = 'bold 23px "Montserrat", sans-serif'
      ctx.letterSpacing = '2px'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('EXPLORE WEDDING WISHLIST & REGISTRY: ENSORB.COM/WISHLIST', 540, 1515)

      // 9. Bottom Prompts & Invitation Pill
      ctx.textAlign = 'center'
      ctx.font = 'bold 28px "Montserrat", sans-serif'
      ctx.letterSpacing = '6px'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('PLEASE PRESENT THIS INVITATION AT ENTRY', 540, 1610)

      // Strictly by invitation pill
      ctx.fillStyle = '#4A1525'
      ctx.beginPath()
      ctx.roundRect(310, 1660, 460, 70, 12)
      ctx.fill()
      ctx.strokeStyle = '#D4AF37'
      ctx.lineWidth = 4
      ctx.stroke()

      ctx.font = 'bold 26px "Cinzel", Georgia, serif'
      ctx.letterSpacing = '8px'
      ctx.fillStyle = '#FAF7F2'
      ctx.fillText('STRICTLY BY INVITATION', 540, 1706)

      // Trigger Download
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `Ngozi-Sorbari-Wedding-Invitation-${accessCode}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error downloading card image:', err)
      alert('Could not generate card image automatically. You can take a screenshot or view via email.')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Google Calendar Link
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding:+Ngozi+%26+Sorbari&dates=20261121T100000Z/20261121T180000Z&details=Official+Wedding+Celebration+of+Ngozi+Emele+Kalu+and+Sorbari+Godwin+Uebari.+Access+Code:+${accessCode}+|+Table:+${encodeURIComponent(
    invite.tableNumber
  )}&location=Christ+Embassy+Ogba+1,+Lagos,+Nigeria`

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Ngozi & Sorbari Wedding Invitation',
        text: `Here is my official Wedding Invitation for Ngozi & Sorbari's Wedding Celebration! Access Code: ${accessCode}`,
        url: passUrl,
      })
    } else {
      navigator.clipboard.writeText(passUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 3000)
    }
  }

  return (
    <div className="access-card-lanyard-wrapper">
      {/* Visual Access Card Container */}
      <div className="access-card-badge" id="access-card-pass-element">
        {/* Top Gold Lanyard Clip Cutout */}
        <div className="lanyard-clip-area" aria-hidden="true">
          <div className="lanyard-ribbon-loop" />
          <div className="lanyard-hole-slot" />
        </div>

        {/* Decorative Corner Filigree */}
        <div className="corner-filigree top-left" aria-hidden="true" />
        <div className="corner-filigree top-right" aria-hidden="true" />
        <div className="corner-filigree bottom-left" aria-hidden="true" />
        <div className="corner-filigree bottom-right" aria-hidden="true" />

        {/* Card Header */}
        <div className="access-card-header">
          <div className="gold-rings-icon">
            <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="rings-svg">
              <ellipse cx="24" cy="28" rx="16" ry="14" stroke="#D4AF37" strokeWidth="4" />
              <ellipse cx="40" cy="24" rx="16" ry="14" stroke="#D4AF37" strokeWidth="4" />
              <polygon points="40,8 44,14 36,14" fill="#D4AF37" />
            </svg>
          </div>
          <h2 className="access-card-title">OFFICIAL INVITATION</h2>
          <h1 className="access-card-couple">NGOZI &amp; SORBARI</h1>
          <p className="access-card-subtitle">WEDDING CEREMONY &amp; ACCESS CARD</p>
        </div>

        {/* Date & Venue Bar */}
        <div className="access-card-date-bar">
          <span className="date-highlight">SATURDAY, 21ST NOVEMBER, 2026</span>
          <span className="time-highlight">11:00 AM (CHURCH) | 1:00 PM (RECEPTION)</span>
        </div>

        {/* Guest Details Box */}
        <div className="access-card-details-box">
          <h3 className="details-box-title">— GUEST DETAILS: —</h3>
          <div className="details-box-row">
            <span className="label">Name:</span>
            <strong className="val">{guestName}</strong>
          </div>
          <div className="details-box-row">
            <span className="label">Seat Number:</span>
            <strong className="val">
              {invite.tableNumber.toUpperCase()}, {invite.category.toUpperCase()}
            </strong>
          </div>
          <div className="details-box-row">
            <span className="label">Number of Guests:</span>
            <strong className="val">{guestCount}</strong>
          </div>
          <div className="details-box-row">
            <span className="label">Access Code:</span>
            <span className="access-code-pill">{accessCode}</span>
          </div>
        </div>

        {/* Have You Gifted The Couple Yet? Section */}
        <div className="access-card-gift-section">
          <div className="card-gift-header">
            <span className="gift-emoji">🎁</span>
            <h4 className="gift-heading">HAVE YOU GIFTED THE COUPLE YET?</h4>
            <p className="gift-subheading">
              Bless Ngozi &amp; Sorbari with a wedding gift or financial support to celebrate their new beginning.
            </p>
          </div>

          <div className="card-gift-bank-box">
            <div className="bank-meta">
              <span className="bank-tag">Direct Bank Transfer</span>
              <div className="bank-details-line">
                <strong className="bank-title">Parallex Bank</strong>
                <span className="bank-acc-num">2003361527</span>
              </div>
              <span className="bank-acc-name">SORBARI GODWIN UEBARI AND NGOZI EMELE KALU</span>
            </div>
            <button
              type="button"
              className="bank-copy-action-btn"
              onClick={handleCopyAccount}
              title="Copy Account Number"
            >
              {copiedAccount ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <Link href="/wishlist" className="card-gift-wishlist-btn">
            <Gift size={16} />
            <span>Explore Wedding Wishlist &amp; Registry →</span>
          </Link>
        </div>

        {/* Bottom Banner */}
        <div className="access-card-footer">
          <p className="entry-notice">PLEASE PRESENT THIS INVITATION AT ENTRY</p>
          <div className="strictly-by-invitation-badge">
            <span>STRICTLY BY INVITATION</span>
          </div>
        </div>
      </div>

      {/* Interactive Pass Action Controls */}
      <div className="pass-actions-panel">
        <a
          href="/api/download-invitation"
          download="Official-Wedding-Invitation-Ngozi-and-Sorbari.jpeg"
          className="pass-btn primary-gold-btn"
          style={{ textDecoration: 'none' }}
        >
          <Download size={18} />
          <span>Download Invitation Card</span>
        </a>

        <button
          type="button"
          className="pass-btn outline-btn"
          onClick={handleDownloadCard}
          disabled={isGeneratingImage}
        >
          <Download size={18} />
          <span>{isGeneratingImage ? 'Generating Pass...' : 'Save Guest Pass (PNG)'}</span>
        </button>

        <a
          href={googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pass-btn outline-btn"
        >
          <Calendar size={18} />
          <span>Add to Calendar</span>
        </a>

        {onResendEmail && (
          <button
            type="button"
            className="pass-btn outline-btn"
            onClick={onResendEmail}
            disabled={isResending}
          >
            <Mail size={18} />
            <span>{isResending ? 'Sending Email...' : 'Resend to My Email'}</span>
          </button>
        )}

        <button type="button" className="pass-btn outline-btn" onClick={handleShare}>
          {copiedLink ? <Check size={18} /> : <Share2 size={18} />}
          <span>{copiedLink ? 'Link Copied!' : 'Share Invitation'}</span>
        </button>
      </div>

      {resendStatus && (
        <div className="pass-status-toast">
          <span>{resendStatus}</span>
        </div>
      )}
    </div>
  )
}
