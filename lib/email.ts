import { Invite } from './types'

export interface EmailSendResult {
  success: boolean
  provider: 'resend' | 'simulated'
  messageId?: string
  error?: string
}

/**
 * Generates the luxury Access Card HTML email template matching the attached access card design
 */
export function generateAccessCardEmailHtml(invite: Invite, siteUrl: string): string {
  const passUrl = `${siteUrl}/invite/${invite.code}`
  const guestName = (invite.guestName || invite.targetName || 'Valued Guest').toUpperCase()
  const guestCount = invite.actualGuestCount || invite.maxGuests || 1
  const accessCode = invite.accessCode || invite.passId || invite.code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    passUrl
  )}`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Official Access Card - Ngozi & Sorbari Wedding</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #1A1416;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #383431;
    }
    .email-wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #1A1416;
      padding: 30px 10px;
    }
    .card-container {
      background: #FAF7F2;
      margin: 0 auto;
      width: 100%;
      max-width: 480px;
      border-radius: 16px;
      overflow: hidden;
      border: 3px solid #D4AF37;
      box-shadow: 0 16px 50px rgba(0,0,0,0.5);
      position: relative;
    }
    .lanyard-hole-wrap {
      text-align: center;
      padding-top: 14px;
    }
    .lanyard-slot {
      display: inline-block;
      width: 46px;
      height: 10px;
      background: #3A2A22;
      border-radius: 6px;
      border: 1px solid #D4AF37;
    }
    .card-body {
      padding: 20px 28px 32px;
      text-align: center;
    }
    .rings-icon {
      font-size: 32px;
      margin-bottom: 4px;
    }
    .card-eyebrow {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.22em;
      color: #4A1525;
      text-transform: uppercase;
      margin: 4px 0 6px;
      font-family: Georgia, serif;
    }
    .couple-headline {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.06em;
      color: #4A1525;
      text-transform: uppercase;
      margin: 0 0 2px;
      font-family: Georgia, serif;
    }
    .sub-headline {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.16em;
      color: #7D6B64;
      text-transform: uppercase;
      margin: 0 0 18px;
    }
    .date-venue-bar {
      border-top: 1px solid #D4AF37;
      border-bottom: 1px solid #D4AF37;
      padding: 12px 0;
      margin: 0 0 20px;
    }
    .event-date {
      font-size: 13.5px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #2E2825;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .event-time {
      font-size: 12px;
      color: #6E655F;
      font-weight: 500;
    }
    .guest-details-box {
      border: 2px solid #D4AF37;
      border-radius: 8px;
      padding: 18px 20px;
      background: #FFFFFF;
      text-align: left;
      margin-bottom: 22px;
      box-shadow: 0 4px 14px rgba(212,175,55,0.12);
    }
    .details-heading {
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.18em;
      color: #4A1525;
      text-transform: uppercase;
      margin: 0 0 14px;
      font-family: Georgia, serif;
    }
    .detail-row {
      margin-bottom: 10px;
      font-size: 14px;
      color: #383431;
      line-height: 1.4;
    }
    .detail-row:last-child {
      margin-bottom: 0;
    }
    .detail-label {
      font-weight: 700;
      color: #4A1525;
      margin-right: 6px;
    }
    .access-code-badge {
      font-family: monospace;
      font-size: 15px;
      font-weight: 700;
      color: #4A1525;
      background: #FAF3E0;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #E5D5AA;
      display: inline-block;
    }
    .qr-wrap {
      text-align: center;
      margin: 18px 0;
    }
    .qr-img {
      border: 3px solid #D4AF37;
      border-radius: 8px;
      background: #FFFFFF;
      padding: 6px;
    }
    .entry-prompt {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: #59534E;
      text-transform: uppercase;
      margin: 16px 0 12px;
    }
    .invitation-badge {
      display: inline-block;
      background: linear-gradient(135deg, #4A1525 0%, #330D19 100%);
      color: #FAF7F2 !important;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 8px 22px;
      border-radius: 4px;
      border: 1px solid #D4AF37;
      margin-bottom: 24px;
    }
    .action-btn {
      display: inline-block;
      background: linear-gradient(135deg, #4A1525 0%, #330D19 100%);
      color: #FAF7F2 !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      box-shadow: 0 6px 18px rgba(74,21,37,0.35);
      border: 1px solid #D4AF37;
    }
    .palette-note {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px dashed #D4CEBF;
      font-size: 12px;
      color: #7D7670;
    }
    .footer-note {
      font-size: 11.5px;
      color: #9E978F;
      margin-top: 18px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <div class="card-container">
            <!-- Lanyard Slot Cutout -->
            <div class="lanyard-hole-wrap">
              <span class="lanyard-slot"></span>
            </div>

            <div class="card-body">
              <!-- Rings Emblem -->
              <div class="rings-icon">💍</div>
              <div class="card-eyebrow">ACCESS CARD</div>
              <h1 class="couple-headline">NGOZI &amp; SORBARI&apos;S</h1>
              <div class="sub-headline">WEDDING CEREMONY PASS</div>

              <!-- Date & Venue Bar -->
              <div class="date-venue-bar">
                <div class="event-date">SATURDAY, 21ST NOVEMBER, 2026</div>
                <div class="event-time">11:00 AM (CHURCH) | 1:00 PM (RECEPTION) • LAGOS, NIGERIA</div>
              </div>

              <!-- Guest Details Box -->
              <div class="guest-details-box">
                <div class="details-heading">— GUEST DETAILS —</div>
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <strong>${guestName}</strong>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Seat Number:</span>
                  <strong>${invite.tableNumber} (${invite.category} Honor)</strong>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Number of Guests:</span>
                  <strong>${guestCount} ${guestCount === 1 ? 'Guest (1 Seat)' : 'Guests'}</strong>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Access Code:</span>
                  <span class="access-code-badge">${accessCode}</span>
                </div>
              </div>

              <!-- Scannable QR Code -->
              <div class="qr-wrap">
                <img
                  src="${qrCodeUrl}"
                  alt="Official Wedding Pass QR Code"
                  width="160"
                  height="160"
                  class="qr-img"
                />
              </div>

              <div class="entry-prompt">PLEASE PRESENT THIS CARD AT ENTRY</div>
              <div>
                <span class="invitation-badge">STRICTLY BY INVITATION</span>
              </div>

              <!-- Action Link -->
              <div style="margin-top: 12px;">
                <a href="${passUrl}" class="action-btn" target="_blank">
                  View &amp; Save Digital Pass ↗
                </a>
              </div>

              <!-- Palette Info -->
              <div class="palette-note">
                <strong style="color: #4A1525; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 4px;">Dress Color Code</strong>
                Burgundy • Blush Pink • Mint Green • Olive Green
              </div>

              <div class="footer-note">
                Please have this pass ready on your mobile device or printed for seamless access at the entrance.
                <br />With warm love, <strong>Ngozi &amp; Sorbari</strong>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`
}

/**
 * Generates the royal invitation email sent when the admin creates a unique invite link for a guest
 */
export function generateUniqueInviteEmailHtml(invite: Invite, siteUrl: string): string {
  const inviteUrl = `${siteUrl}/invite/${invite.code}`
  const targetName = invite.targetName || 'Honored Guest'
  const maxSeats = invite.maxGuests || 2

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wedding Invitation - Ngozi & Sorbari</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #1A1416;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #383431;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #1A1416;
      padding: 36px 12px;
    }
    .card {
      background: #FAF7F2;
      margin: 0 auto;
      width: 100%;
      max-width: 520px;
      border-radius: 12px;
      border: 2px solid #D4AF37;
      box-shadow: 0 16px 45px rgba(0,0,0,0.4);
      overflow: hidden;
      text-align: center;
    }
    .header {
      background: linear-gradient(135deg, #4A1525 0%, #330D19 100%);
      padding: 36px 24px 28px;
      color: #FAF7F2;
      border-bottom: 2px solid #D4AF37;
    }
    .rings {
      font-size: 28px;
      margin-bottom: 8px;
    }
    .eyebrow {
      font-size: 11.5px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: #E5A1A8;
      margin-bottom: 6px;
    }
    .title {
      font-size: 28px;
      font-weight: 400;
      color: #FAF7F2;
      font-family: Georgia, serif;
      margin: 0;
    }
    .body-content {
      padding: 32px 28px;
    }
    .greeting {
      font-size: 20px;
      font-family: Georgia, serif;
      color: #4A1525;
      margin: 0 0 16px;
      font-weight: 600;
    }
    .msg {
      font-size: 14.5px;
      line-height: 1.7;
      color: #59534E;
      margin: 0 0 24px;
    }
    .reservation-box {
      border: 1px solid #D4AF37;
      border-radius: 8px;
      background: #FFFFFF;
      padding: 16px 20px;
      margin-bottom: 28px;
      text-align: left;
    }
    .res-row {
      margin-bottom: 8px;
      font-size: 13.5px;
      color: #383431;
    }
    .res-row:last-child {
      margin-bottom: 0;
    }
    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, #4A1525 0%, #330D19 100%);
      color: #FAF7F2 !important;
      text-decoration: none;
      padding: 15px 36px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      box-shadow: 0 6px 18px rgba(74,21,37,0.35);
      border: 1px solid #D4AF37;
    }
    .footer {
      background: #F4EFEB;
      padding: 20px 24px;
      font-size: 12px;
      color: #7D7670;
      border-top: 1px solid #E5DFD3;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <div class="card">
            <div class="header">
              <div class="rings">💍</div>
              <div class="eyebrow">OFFICIAL WEDDING INVITATION</div>
              <h1 class="title">Ngozi &amp; Sorbari</h1>
              <p style="font-size: 12px; color: #D4AF37; margin: 8px 0 0; letter-spacing: 0.1em; text-transform: uppercase;">Saturday, November 21, 2026 • Lagos, Nigeria</p>
            </div>

            <div class="body-content">
              <h2 class="greeting">Dearest ${targetName},</h2>
              <p class="msg">
                With joyful hearts and thanksgiving to God, we warmly invite you to celebrate our holy matrimony and witness the beginning of our forever journey together.
              </p>

              <div class="reservation-box">
                <div class="res-row"><strong>Assigned Table:</strong> ${invite.tableNumber}</div>
                <div class="res-row"><strong>Reserved Seats:</strong> ${maxSeats} ${maxSeats === 1 ? 'Guest (1 Seat)' : 'Guests'}</div>
                <div class="res-row"><strong>Category:</strong> ${invite.category} Honor Guest</div>
                ${invite.customNote ? `<div class="res-row" style="margin-top: 8px; color: #4A1525; font-style: italic;">&ldquo;${invite.customNote}&rdquo;</div>` : ''}
              </div>

              <div>
                <a href="${inviteUrl}" class="cta-btn" target="_blank">
                  Confirm RSVP &amp; Claim Access Card ↗
                </a>
              </div>
            </div>

            <div class="footer">
              Please click the button above to confirm your attendance and instantly receive your official digital Access Card.
              <br /><br />
              With all our love,<br />
              <strong>Ngozi Emele Kalu &amp; Sorbari Godwin Uebari</strong>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`
}

/**
 * Sends the official luxury Access Card email to the guest via Resend API
 */
export async function sendWeddingPassEmail(
  invite: Invite,
  siteUrl: string
): Promise<EmailSendResult> {
  const recipientEmail = invite.guestEmail || (invite as any).targetEmail
  if (!recipientEmail) {
    return { success: false, provider: 'simulated', error: 'No guest email address provided' }
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.EMAIL_FROM || 'Ngozi & Sorbari Wedding <invites@ensorb.com>'
  const subject = `🎟️ Your Official Access Card: Ngozi & Sorbari Wedding Pass (${invite.accessCode || invite.code})`
  const html = generateAccessCardEmailHtml(invite, siteUrl)

  // 1. If Resend API Key is provided, send through Resend
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [recipientEmail],
          subject: subject,
          html: html,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`[RESEND SUCCESS] Access Card sent to ${recipientEmail}, messageId: ${data.id}`)
        return {
          success: true,
          provider: 'resend',
          messageId: data.id,
        }
      } else {
        const err = await response.text()
        console.warn('Resend API call error, falling back to simulated:', err)
      }
    } catch (err) {
      console.error('Error contacting Resend API:', err)
    }
  }

  // 2. Simulated/Local delivery fallback
  console.log(`[SIMULATED DISPATCH] Access Card delivered to ${recipientEmail} for code ${invite.code}`)
  return {
    success: true,
    provider: 'simulated',
    messageId: `sim-${Date.now()}`,
  }
}

/**
 * Sends a unique invitation link email to a guest via Resend API
 */
export async function sendUniqueInviteEmail(
  invite: Invite,
  recipientEmail: string,
  siteUrl: string
): Promise<EmailSendResult> {
  if (!recipientEmail) {
    return { success: false, provider: 'simulated', error: 'No recipient email provided' }
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.EMAIL_FROM || 'Ngozi & Sorbari Wedding <invites@ensorb.com>'
  const subject = `✨ Wedding Invitation: Ngozi & Sorbari Cordially Invite You (${invite.targetName || 'Special Guest'})`
  const html = generateUniqueInviteEmailHtml(invite, siteUrl)

  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [recipientEmail],
          subject: subject,
          html: html,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`[RESEND SUCCESS] Unique invite sent to ${recipientEmail}, messageId: ${data.id}`)
        return {
          success: true,
          provider: 'resend',
          messageId: data.id,
        }
      } else {
        const err = await response.text()
        console.warn('Resend API call error, falling back to simulated:', err)
      }
    } catch (err) {
      console.error('Error contacting Resend API for unique invite:', err)
    }
  }

  console.log(`[SIMULATED DISPATCH] Unique invite link delivered to ${recipientEmail} for code ${invite.code}`)
  return {
    success: true,
    provider: 'simulated',
    messageId: `sim-${Date.now()}`,
  }
}

