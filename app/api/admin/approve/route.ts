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

    const updated = await approveInvite(target, {
      tableNumber,
      maxGuests,
      category,
      sendAccessCardEmail,
    })

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Failed to approve guest' },
        { status: 400 }
      )
    }

    const stats = await getAdminStats()

    return NextResponse.json({
      success: true,
      message: `Guest ${updated.guestName || updated.targetName || 'Guest'} approved successfully! Access Card issued.`,
      invite: updated,
      stats,
    })
  } catch (err) {
    console.error('Error in POST /api/admin/approve:', err)
    return NextResponse.json({ success: false, error: 'Server error during approval' }, { status: 500 })
  }
}
