import { NextRequest, NextResponse } from 'next/server'
import { approveInvite, getAdminStats } from '@/lib/invites-store'

export async function POST(req: NextRequest) {
  try {
    const session = req.cookies.get('ensorb_admin_session')?.value
    if (session !== 'authenticated_couple_session') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { code, id, tableNumber, maxGuests, category, sendAccessCardEmail = true } = body
    const target = code || id

    if (!target) {
      return NextResponse.json(
        { success: false, error: 'Target invite code or ID is required' },
        { status: 400 }
      )
    }

    const siteUrl = req.nextUrl.origin || 'https://ensorb.com'
    const result = await approveInvite(
      target,
      {
        tableNumber,
        maxGuests,
        category,
        sendAccessCardEmail,
      },
      siteUrl
    )

    if (!result.success || !result.invite) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to approve guest' },
        { status: 400 }
      )
    }

    const stats = await getAdminStats()

    return NextResponse.json({
      success: true,
      message: `Guest ${result.invite.guestName || result.invite.targetName} approved successfully! Access Card sent.`,
      invite: result.invite,
      stats,
    })
  } catch (err) {
    console.error('Error in POST /api/admin/approve:', err)
    return NextResponse.json({ success: false, error: 'Server error during approval' }, { status: 500 })
  }
}
