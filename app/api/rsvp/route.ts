import { NextRequest, NextResponse } from 'next/server'
import {
  createInvite,
  registerInvite,
  getInviteByCode,
  getAllInvites,
} from '@/lib/invites-store'
import { generateInviteCode } from '@/lib/invites-store'

export async function POST(req: NextRequest) {
  try {
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

    let targetCode = inviteCode ? inviteCode.trim().toUpperCase() : ''

    if (targetCode) {
      const existing = await getInviteByCode(targetCode)
      if (!existing) {
        return NextResponse.json(
          { success: false, error: `Invitation code "${targetCode}" is invalid.` },
          { status: 404 }
        )
      }
      if (existing.isRegistered) {
        // Already registered, return pass details
        return NextResponse.json({
          success: true,
          invite: existing,
          alreadyRegistered: true,
          message: 'You have already confirmed your RSVP.',
        })
      }
    } else {
      // Check if this email already registered
      const all = await getAllInvites()
      const existingByEmail = all.find(
        (inv) => inv.isRegistered && inv.guestEmail?.toLowerCase() === email.trim().toLowerCase()
      )
      if (existingByEmail) {
        return NextResponse.json({
          success: true,
          invite: existingByEmail,
          alreadyRegistered: true,
          message: 'You have already confirmed your RSVP for this wedding celebration.',
        })
      }

      // Create new invite
      const newInv = await createInvite({
        targetName: fullName.trim(),
        maxGuests: Math.max(1, Number(guestCount) || 1),
        category: 'General',
      })
      targetCode = newInv.code
    }

    // Register the invite
    const registrationResult = await registerInvite(targetCode, {
      guestName: fullName.trim(),
      guestEmail: email.trim(),
      guestPhone: phone?.trim() || '',
      attendance: attending === 'declined' ? 'declined' : 'attending',
      actualGuestCount: Math.max(1, Number(guestCount) || 1),
      dietaryOrNotes: message?.trim() || '',
    })

    if (!registrationResult.success) {
      return NextResponse.json(
        { success: false, error: registrationResult.error || 'Failed to submit RSVP.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      invite: registrationResult.invite,
      message: 'RSVP confirmed successfully!',
    })
  } catch (err) {
    console.error('Error in POST /api/rsvp:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error while processing RSVP.' },
      { status: 500 }
    )
  }
}
