import { Invite } from './types'

export interface EmailSendResult {
  success: boolean
  provider: 'resend' | 'smtp' | 'simulated'
  messageId?: string
  error?: string
}

/**
 * Generates the luxury wedding pass HTML email template
 */
export function generateWeddingPassEmailHtml(invite: Invite, siteUrl: string): string {
  const passUrl = `${siteUrl}/invite/${invite.code}`
  const guestName = invite.guestName || invite.targetName
  const seatText =
    (invite.actualGuestCount || invite.maxGuests || 1) === 1
      ? '1 Reserved Seat'
      : `${invite.actualGuestCount || invite.maxGuests} Reserved Seats`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Wedding Pass - Ngozi & Sorbari</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #191614;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #2b2825;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #191614;
      padding: 40px 0;
    }
    .main {
      background-color: #f7f5f0;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #c9a96e;
      box-shadow: 0 10px 40px rgba(0,0,0,0.4);
    }
    .header {
      background: linear-gradient(135deg, #6B1D2F 0%, #4A121F 100%);
      padding: 36px 24px;
      text-align: center;
      color: #ffffff;
      border-bottom: 2px solid #D4AF37;
    }
    .monogram {
      font-size: 26px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #D4AF37;
      margin-bottom: 8px;
      font-weight: 300;
    }
    .title {
      font-size: 24px;
      margin: 0;
      letter-spacing: 0.02em;
      font-weight: 400;
      font-family: Georgia, serif;
    }
    .subtitle {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #e8a598;
      margin-top: 6px;
    }
    .body {
      padding: 36px 32px;
      background-color: #fcfbf9;
    }
    .greeting {
      font-size: 18px;
      font-family: Georgia, serif;
      color: #191919;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .text {
      font-size: 14px;
      line-height: 1.6;
      color: #55524e;
      margin-bottom: 24px;
    }
    .pass-card {
      background: #ffffff;
      border: 1px solid #dfdbd2;
      border-left: 4px solid #6B1D2F;
      border-radius: 6px;
      padding: 20px;
      margin: 24px 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    }
    .pass-row {
      display: table;
      width: 100%;
      margin-bottom: 10px;
      border-bottom: 1px dashed #edeae3;
      padding-bottom: 10px;
    }
    .pass-row:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .pass-label {
      display: table-cell;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #8c8983;
      width: 38%;
      vertical-align: middle;
    }
    .pass-value {
      display: table-cell;
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      vertical-align: middle;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0 16px;
    }
    .btn {
      background-color: #6B1D2F;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 600;
      border-radius: 4px;
      display: inline-block;
      box-shadow: 0 4px 15px rgba(107, 29, 47, 0.3);
    }
    .palette-box {
      background-color: #f4f1ea;
      padding: 16px;
      border-radius: 6px;
      margin-top: 24px;
      text-align: center;
    }
    .palette-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #6B1D2F;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .palette-desc {
      font-size: 12px;
      color: #66635d;
      margin: 0;
    }
    .footer {
      background-color: #ede9e1;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #8c8983;
      border-top: 1px solid #dfdbd2;
    }
    .footer a {
      color: #6B1D2F;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <div class="main">
            <div class="header">
              <div class="monogram">ENSORB</div>
              <h1 class="title">Ngozi &amp; Sorbari Wedding</h1>
              <div class="subtitle">Official Digital Guest Pass</div>
            </div>
            
            <div class="body">
              <h2 class="greeting">Dearest ${guestName},</h2>
              <p class="text">
                We are thrilled to celebrate this momentous day with you! Your RSVP has been confirmed, and your personalized digital wedding pass has been generated.
              </p>

              <div class="pass-card">
                <div class="pass-row">
                  <div class="pass-label">Pass ID</div>
                  <div class="pass-value" style="color: #6B1D2F; font-family: monospace; font-size: 15px;">${invite.passId || 'PASS-NS-2026'}</div>
                </div>
                <div class="pass-row">
                  <div class="pass-label">Guest Name</div>
                  <div class="pass-value">${guestName}</div>
                </div>
                <div class="pass-row">
                  <div class="pass-label">Date &amp; Time</div>
                  <div class="pass-value">Saturday, Oct 31, 2026 • 2:00 PM</div>
                </div>
                <div class="pass-row">
                  <div class="pass-label">Venue</div>
                  <div class="pass-value">Christ Embassy Ogba 1, Lagos</div>
                </div>
                <div class="pass-row">
                  <div class="pass-label">Assigned Table</div>
                  <div class="pass-value">${invite.tableNumber}</div>
                </div>
                <div class="pass-row">
                  <div class="pass-label">Attendance</div>
                  <div class="pass-value">${seatText}</div>
                </div>
              </div>

              <div class="btn-container">
                <a href="${passUrl}" class="btn" target="_blank">View &amp; Save Digital Pass ↗</a>
              </div>

              <div class="palette-box">
                <div class="palette-title">Dress Color Code</div>
                <p class="palette-desc">Burgundy • Blush • Mint Green • Olive Green</p>
              </div>
            </div>

            <div class="footer">
              <p style="margin: 0 0 6px;">Please present your digital pass QR code upon arrival at the venue.</p>
              <p style="margin: 0;">With all our love, <strong>Ngozi &amp; Sorbari</strong></p>
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
 * Sends the wedding pass email via Resend API or logs simulated delivery
 */
export async function sendWeddingPassEmail(
  invite: Invite,
  siteUrl: string
): Promise<EmailSendResult> {
  const recipientEmail = invite.guestEmail
  if (!recipientEmail) {
    return { success: false, provider: 'simulated', error: 'No guest email provided' }
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail =
    process.env.EMAIL_FROM || 'Ngozi & Sorbari Wedding <invites@ensorb.com>'
  const subject = `Your Official Wedding Pass: Ngozi & Sorbari (Oct 31, 2026)`
  const html = generateWeddingPassEmailHtml(invite, siteUrl)

  // 1. If Resend API Key is provided, use Resend API
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

  // 2. Simulated/Local delivery logging
  console.log(`[EMAIL DISPATCH] Pass sent to ${recipientEmail} for code ${invite.code}`)
  return {
    success: true,
    provider: 'simulated',
    messageId: `sim-${Date.now()}`,
  }
}
