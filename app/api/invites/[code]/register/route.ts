import { NextRequest, NextResponse } from 'next/server'
import { registerInvite, getInviteByCode } from '@/lib/invites-store'
import { sendWeddingPassEmail } from '@/lib/email'

interface RouteContext {
  params: Promise<{ code: string }>
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { code } = await context.params
    const body = await req.json()

    // Verify invite existence
    const existing = await getInviteByCode(code)
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found or invalid code.' },
        { status: 404 }
      )
    }

    // If already registered, reject new registration
    if (existing.isRegistered) {
      return NextResponse.json(
        {
          success: false,
          error:
            'This invitation link is already registered. You can view your digital pass below.',
          invite: existing,
        },
        { status: 400 }
      )
    }

    const {
      guestName,
      guestEmail,
      guestPhone,
      attendance,
      actualGuestCount,
      dietaryOrNotes,
    } = body

    if (!guestName || !guestName.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please provide your full name.' },
        { status: 400 }
      )
    }

    if (!guestEmail || !guestEmail.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    // Complete registration in database
    const registeredInvite = await registerInvite(code, {
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone?.trim() || '',
      attendance: attendance === 'declined' ? 'declined' : 'attending',
      actualGuestCount: Number(actualGuestCount) || 1,
      dietaryOrNotes: dietaryOrNotes?.trim() || '',
    })

    if (!registeredInvite) {
      return NextResponse.json(
        { success: false, error: 'Registration failed.' },
        { status: 400 }
      )
    }

    // Send wedding pass email if guest is attending
    const siteUrl = req.nextUrl.origin || 'https://ensorb.com'
    if (registeredInvite.attendance === 'attending' && registeredInvite.guestEmail) {
      try {
        await sendWeddingPassEmail(registeredInvite, siteUrl)
      } catch (emailErr) {
        console.warn('Failed to send instant pass email:', emailErr)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Your digital wedding pass is ready.',
      invite: registeredInvite,
    })
  } catch (err) {
    console.error('Error in POST /api/invites/[code]/register:', err)
    return NextResponse.json(
      { success: false, error: 'Server error during registration.' },
      { status: 500 }
    )
  }
}
