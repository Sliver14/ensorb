import { NextRequest, NextResponse } from 'next/server'
import {
  createInvite,
  registerInvite,
  getInviteByCode,
  getAllInvites,
  updateInvite,
} from '@/lib/invites-store'
import { sendAdminRsvpNotificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const siteUrl = req.nextUrl.origin || process.env.NEXT_PUBLIC_SITE_URL || 'https://ensorb.com'
    const body = await req.json()
    const {
      fullName,
      email,
      phone,
      attending = 'attending',
      guestCount = 1,
      message = '',
      inviteCode,
    } = body

    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { success: false, error: 'Full name is required.' },
        { status: 400 }
      )
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email address is required.' },
        { status: 400 }
      )
    }

    const targetCode = inviteCode ? inviteCode.trim().toUpperCase() : ''

    // Case 1: Guest provided an authorized unique invite code
    if (targetCode) {
      const existing = await getInviteByCode(targetCode)
      if (!existing) {
        return NextResponse.json(
          { success: false, error: `Invitation code "${targetCode}" is invalid.` },
          { status: 404 }
        )
      }
      if (existing.isRegistered) {
        return NextResponse.json({
          success: true,
          invite: existing,
          alreadyRegistered: true,
          message: 'You have already confirmed your RSVP for this wedding.',
        })
      }

      // Complete registration
      const registered = await registerInvite(targetCode, {
        guestName: fullName.trim(),
        guestEmail: email.trim(),
        guestPhone: phone?.trim() || '',
        attendance: attending === 'declined' ? 'declined' : 'attending',
        actualGuestCount: Math.max(1, Number(guestCount) || 1),
        dietaryOrNotes: message?.trim() || '',
      })

      if (!registered) {
        return NextResponse.json(
          { success: false, error: 'Failed to submit RSVP.' },
          { status: 400 }
        )
      }

      // Send admin email notification to engysorbari@gmail.com
      try {
        await sendAdminRsvpNotificationEmail(registered, siteUrl)
      } catch (notifyErr) {
        console.warn('Failed to send admin RSVP notification email:', notifyErr)
      }

      return NextResponse.json({
        success: true,
        invite: registered,
        message: 'RSVP confirmed and Access Card registered successfully!',
      })
    }

    // Case 2: General RSVP from the website (requires admin approval)
    const all = await getAllInvites()
    const existingByEmail = all.find(
      (inv) => inv.guestEmail?.toLowerCase() === email.trim().toLowerCase()
    )

    if (existingByEmail) {
      return NextResponse.json({
        success: true,
        invite: existingByEmail,
        alreadyRegistered: true,
        isPending: existingByEmail.approvalStatus === 'pending',
        message:
          existingByEmail.approvalStatus === 'pending'
            ? 'Your RSVP is currently pending approval by the couple. Your Access Card will be emailed as soon as approved!'
            : 'You have already confirmed your RSVP for this celebration.',
      })
    }

    // Create new pending RSVP record
    const newPendingInvite = await createInvite({
      targetName: fullName.trim(),
      targetEmail: email.trim(),
      maxGuests: Math.max(1, Number(guestCount) || 1),
      category: 'General',
      source: 'rsvp_form',
    })

    // Fill in the guest details
    const updated = await updateInvite(newPendingInvite.id, {
      guestName: fullName.trim(),
      guestEmail: email.trim(),
      guestPhone: phone?.trim() || '',
      attendance: attending === 'declined' ? 'declined' : 'attending',
      actualGuestCount: Math.max(1, Number(guestCount) || 1),
      dietaryOrNotes: message?.trim() || '',
      isRegistered: true,
      registeredAt: new Date().toISOString(),
      approvalStatus: 'pending',
    })

    const finalInvite = updated || newPendingInvite

    // Send admin email notification to engysorbari@gmail.com
    try {
      await sendAdminRsvpNotificationEmail(finalInvite, siteUrl)
    } catch (notifyErr) {
      console.warn('Failed to send admin RSVP notification email:', notifyErr)
    }

    return NextResponse.json({
      success: true,
      invite: finalInvite,
      isPending: true,
      message:
        'Thank you! Your RSVP has been submitted and is awaiting approval by Ngozi & Sorbari. Your official Access Card and table assignment will be delivered directly to your email upon confirmation.',
    })
  } catch (err) {
    console.error('Error in POST /api/rsvp:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error while processing RSVP.' },
      { status: 500 }
    )
  }
}
