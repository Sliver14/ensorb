import { NextRequest, NextResponse } from 'next/server'
import {
  getInviteByCode,
  updateInvite,
  deleteInvite,
  getAdminStats,
} from '@/lib/invites-store'

interface RouteContext {
  params: Promise<{ code: string }>
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { code } = await context.params
    const invite = await getInviteByCode(code)

    if (!invite) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found or expired' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, invite })
  } catch (err) {
    console.error('Error fetching invite:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve invitation' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { code } = await context.params
    const updates = await req.json()
    const updated = await updateInvite(code, updates)

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Invite not found' },
        { status: 404 }
      )
    }

    const stats = await getAdminStats()
    return NextResponse.json({ success: true, invite: updated, stats })
  } catch (err) {
    console.error('Error updating invite:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to update invite' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { code } = await context.params
    const deleted = await deleteInvite(code)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Invite not found or already deleted' },
        { status: 404 }
      )
    }

    const stats = await getAdminStats()
    return NextResponse.json({ success: true, message: 'Invite revoked', stats })
  } catch (err) {
    console.error('Error deleting invite:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to delete invite' },
      { status: 500 }
    )
  }
}
