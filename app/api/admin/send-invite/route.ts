import { NextRequest, NextResponse } from 'next/server'
import { createInvite, getAdminStats } from '@/lib/invites-store'
import { CreateInviteInput } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const session = req.cookies.get('ensorb_admin_session')?.value
    if (session !== 'authenticated_couple_session') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      targetName,
      targetEmail,
      maxGuests = 2,
      tableNumber,
      category = 'General',
      customNote,
      sendEmailNow = true,
    } = body

    if (!targetName || !targetName.trim()) {
      return NextResponse.json(
        { success: false, error: 'Guest name is required.' },
        { status: 400 }
      )
    }

    if (sendEmailNow && (!targetEmail || !targetEmail.trim())) {
      return NextResponse.json(
        { success: false, error: 'Guest email is required to send the invitation link.' },
        { status: 400 }
      )
    }

    const siteUrl = req.nextUrl.origin || 'https://ensorb.com'
    const input: CreateInviteInput = {
      targetName: targetName.trim(),
      targetEmail: targetEmail?.trim(),
      maxGuests: Number(maxGuests) || 2,
      tableNumber: tableNumber?.trim(),
      category,
      customNote: customNote?.trim(),
      source: 'admin_direct',
      sendEmailNow: Boolean(sendEmailNow && targetEmail),
    }

    const newInvite = await createInvite(input)
    const stats = await getAdminStats()

    return NextResponse.json({
      success: true,
      message: newInvite.inviteEmailSent
        ? `Unique invitation link created and emailed directly to ${targetEmail}!`
        : 'Unique invitation link generated successfully!',
      invite: newInvite,
      stats,
    })
  } catch (err) {
    console.error('Error in POST /api/admin/send-invite:', err)
    return NextResponse.json(
      { success: false, error: 'Server error while generating and sending invitation link' },
      { status: 500 }
    )
  }
}
