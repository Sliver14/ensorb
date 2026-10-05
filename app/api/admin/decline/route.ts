import { NextRequest, NextResponse } from 'next/server'
import { declineInvite, getAdminStats } from '@/lib/invites-store'

export async function POST(req: NextRequest) {
  try {
    const session = req.cookies.get('ensorb_admin_session')?.value
    if (session !== 'authenticated_couple_session') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { code, id, reason = 'Capacity limit reached' } = body
    const target = code || id

    if (!target) {
      return NextResponse.json(
        { success: false, error: 'Target invite code or ID is required' },
        { status: 400 }
      )
    }

    const result = await declineInvite(target, reason)
    if (!result.success || !result.invite) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to decline guest' },
        { status: 400 }
      )
    }

    const stats = await getAdminStats()

    return NextResponse.json({
      success: true,
      message: 'Guest reservation declined.',
      invite: result.invite,
      stats,
    })
  } catch (err) {
    console.error('Error in POST /api/admin/decline:', err)
    return NextResponse.json({ success: false, error: 'Server error while declining' }, { status: 500 })
  }
}
