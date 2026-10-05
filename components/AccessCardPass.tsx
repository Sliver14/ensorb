'use client'

import React, { useRef, useState } from 'react'
import { Invite } from '@/lib/types'
import {
  Download,
  Calendar,
  Share2,
  Mail,
  Check,
  Sparkles,
  ShieldCheck,
  Lock,
  QrCode as QrCodeIcon,
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

  const guestName = (invite.guestName || invite.targetName || 'Valued Guest').toUpperCase()
  const guestCount = invite.actualGuestCount || invite.maxGuests || 1
  const accessCode = invite.accessCode || invite.passId || invite.code
  const passUrl = typeof window !== 'undefined' ? `${window.location.origin}/invite/${invite.code}` : `https://ensorb.com/invite/${invite.code}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    passUrl
  )}`

  // Download high-resolution PNG pass card directly onto HTML5 Canvas
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

      // 4. Header Rings Emblem & ACCESS CARD
      ctx.fillStyle = '#4A1525'
      ctx.textAlign = 'center'
      ctx.font = 'bold 44px "Cinzel", Georgia, serif'
      ctx.letterSpacing = '12px'
      ctx.fillText('ACCESS CARD', 540, 260)

      // 5. Couple Headline
      ctx.font = '800 62px "Cinzel", Georgia, serif'
      ctx.letterSpacing = '4px'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('NGOZI & SORBARIS', 540, 370)

      ctx.font = '600 30px "Montserrat", sans-serif'
      ctx.letterSpacing = '8px'
      ctx.fillStyle = '#7D6B64'
      ctx.fillText('WEDDING CEREMONY PASS', 540, 430)

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
      ctx.fillText('SATURDAY, 31ST OCTOBER, 2026', 540, 530)

      ctx.font = '500 26px "Montserrat", sans-serif'
      ctx.letterSpacing = '2px'
      ctx.fillStyle = '#7D6B64'
      ctx.fillText('11:00 AM (CHURCH) | 1:00 PM (RECEPTION)', 540, 574)

      // 7. GUEST DETAILS Box
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.roundRect(120, 650, 840, 530, 20)
      ctx.fill()
      ctx.strokeStyle = '#D4AF37'
      ctx.lineWidth = 6
      ctx.stroke()

      ctx.font = 'bold 36px "Cinzel", Georgia, serif'
      ctx.letterSpacing = '8px'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('— GUEST DETAILS —', 540, 725)

      ctx.textAlign = 'left'
      const startX = 170
      let curY = 810

      ctx.font = 'bold 30px "Montserrat", sans-serif'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('Name:', startX, curY)
      ctx.font = '600 30px "Montserrat", sans-serif'
      ctx.fillStyle = '#2B2725'
      ctx.fillText(guestName, startX + 130, curY)

      curY += 75
      ctx.font = 'bold 30px "Montserrat", sans-serif'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('Seat Number:', startX, curY)
      ctx.font = '600 30px "Montserrat", sans-serif'
      ctx.fillStyle = '#2B2725'
      ctx.fillText(`${invite.tableNumber} (${invite.category})`, startX + 240, curY)

      curY += 75
      ctx.font = 'bold 30px "Montserrat", sans-serif'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('Number of Guests:', startX, curY)
      ctx.font = '600 30px "Montserrat", sans-serif'
      ctx.fillStyle = '#2B2725'
      ctx.fillText(`${guestCount} ${guestCount === 1 ? 'Guest (1 Seat)' : 'Guests'}`, startX + 310, curY)

      curY += 75
      ctx.font = 'bold 30px "Montserrat", sans-serif'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('Access Code:', startX, curY)
      ctx.font = 'bold 34px monospace'
      ctx.fillStyle = '#4A1525'
      ctx.fillText(accessCode, startX + 230, curY)

      // 8. Load & Draw QR Code
      const qrImg = new Image()
      qrImg.crossOrigin = 'anonymous'
      qrImg.src = qrCodeUrl

      await new Promise<void>((resolve) => {
        qrImg.onload = () => {
          ctx.fillStyle = '#FFFFFF'
          ctx.beginPath()
          ctx.roundRect(390, 1220, 300, 300, 16)
          ctx.fill()
          ctx.strokeStyle = '#D4AF37'
          ctx.lineWidth = 6
          ctx.stroke()
          ctx.drawImage(qrImg, 410, 1240, 260, 260)
          resolve()
        }
        qrImg.onerror = () => resolve()
      })

      // 9. Bottom Prompts & Invitation Pill
      ctx.textAlign = 'center'
      ctx.font = 'bold 28px "Montserrat", sans-serif'
      ctx.letterSpacing = '6px'
      ctx.fillStyle = '#4A1525'
      ctx.fillText('PLEASE PRESENT THIS CARD AT ENTRY', 540, 1590)

      // Strictly by invitation pill
      ctx.fillStyle = '#4A1525'
      ctx.beginPath()
      ctx.roundRect(310, 1640, 460, 70, 12)
      ctx.fill()
      ctx.strokeStyle = '#D4AF37'
      ctx.lineWidth = 4
      ctx.stroke()

      ctx.font = 'bold 26px "Cinzel", Georgia, serif'
      ctx.letterSpacing = '8px'
      ctx.fillStyle = '#FAF7F2'
      ctx.fillText('STRICTLY BY INVITATION', 540, 1686)

      // Trigger Download
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `Ngozi-Sorbari-Wedding-Pass-${accessCode}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error downloading card pass image:', err)
      alert('Could not generate pass image automatically. You can take a screenshot or view via email.')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Google Calendar Link
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding:+Ngozi+%26+Sorbari&dates=20261031T100000Z/20261031T180000Z&details=Official+Wedding+Celebration+of+Ngozi+Emele+Kalu+and+Sorbari+Godwin+Uebari.+Access+Code:+${accessCode}+|+Table:+${encodeURIComponent(
    invite.tableNumber
  )}&location=Christ+Embassy+Ogba+1,+Lagos,+Nigeria`

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Ngozi & Sorbari Wedding Pass',
        text: `Here is my official Access Card pass for Ngozi & Sorbari's Wedding Celebration! Access Code: ${accessCode}`,
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
          <h2 className="access-card-title">ACCESS CARD</h2>
          <h1 className="access-card-couple">NGOZI &amp; SORBARIS</h1>
          <p className="access-card-subtitle">WEDDING CEREMONY PASS</p>
        </div>

        {/* Date & Venue Bar */}
        <div className="access-card-date-bar">
          <span className="date-highlight">SATURDAY, 31ST OCTOBER, 2026</span>
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

        {/* QR Code Section */}
        <div className="access-card-qr-section">
          <div className="qr-frame">
            <img
              src={qrCodeUrl}
              alt={`Access QR Code for ${accessCode}`}
              className="qr-image"
              loading="eager"
            />
          </div>
          <span className="qr-caption">Scan for entry verification</span>
        </div>

        {/* Bottom Banner */}
        <div className="access-card-footer">
          <p className="entry-notice">PLEASE PRESENT THIS CARD AT ENTRY</p>
          <div className="strictly-by-invitation-badge">
            <span>STRICTLY BY INVITATION</span>
          </div>
        </div>
      </div>

      {/* Interactive Pass Action Controls */}
      <div className="pass-actions-panel">
        <button
          type="button"
          className="pass-btn primary-gold-btn"
          onClick={handleDownloadCard}
          disabled={isGeneratingImage}
        >
          <Download size={18} />
          <span>{isGeneratingImage ? 'Generating High-Res Image...' : 'Save Pass Image (PNG)'}</span>
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
          <span>{copiedLink ? 'Link Copied!' : 'Share Pass'}</span>
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
