import { NextRequest, NextResponse } from 'next/server'
import { toggleCheckIn, getAdminStats } from '@/lib/invites-store'

interface RouteContext {
  params: Promise<{ code: string }>
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { code } = await context.params
    const updated = await toggleCheckIn(code)

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Invite not found' },
        { status: 404 }
      )
    }

    const stats = await getAdminStats()
    return NextResponse.json({
      success: true,
      invite: updated,
      checkedIn: updated.checkedIn,
      stats,
    })
  } catch (err) {
    console.error('Error toggling check-in:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to update check-in status' },
      { status: 500 }
    )
  }
}
