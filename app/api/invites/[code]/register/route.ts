import { NextRequest, NextResponse } from 'next/server'
import { registerInvite, getInviteByCode } from '@/lib/invites-store'
import { uploadToCloudinary } from '@/lib/cloudinary'
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
            'This invitation link is already registered and cannot register a new person. You can view your wedding pass below.',
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
      photoDataUrl,
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

    // Process photo upload to Cloudinary (or fallback)
    let uploadedPhotoUrl = ''
    if (photoDataUrl && photoDataUrl.startsWith('data:image')) {
      const uploadRes = await uploadToCloudinary(photoDataUrl, 'ensorb-wedding/guests')
      uploadedPhotoUrl = uploadRes.secureUrl || uploadRes.url
    } else if (photoDataUrl && typeof photoDataUrl === 'string') {
      uploadedPhotoUrl = photoDataUrl
    }

    // Complete registration in database / storage
    const regResult = await registerInvite(code, {
      guestName,
      guestEmail,
      guestPhone: guestPhone || '',
      attendance: attendance === 'declined' ? 'declined' : 'attending',
      actualGuestCount: Number(actualGuestCount) || 1,
      guestPhoto: uploadedPhotoUrl,
      dietaryOrNotes,
    })

    if (!regResult.success || !regResult.invite) {
      return NextResponse.json(
        { success: false, error: regResult.error || 'Registration failed' },
        { status: 400 }
      )
    }

    // Automatically send wedding pass email
    const siteUrl = req.nextUrl.origin || 'https://ensorb.com'
    if (regResult.invite.attendance === 'attending' && regResult.invite.guestEmail) {
      try {
        await sendWeddingPassEmail(regResult.invite, siteUrl)
      } catch (emailErr) {
        console.warn('Failed to send instant pass email:', emailErr)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Your wedding pass is ready.',
      invite: regResult.invite,
    })
  } catch (err) {
    console.error('Error in POST /api/invites/[code]/register:', err)
    return NextResponse.json(
      { success: false, error: 'Server error during registration.' },
      { status: 500 }
    )
  }
}
