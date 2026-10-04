import { NextRequest, NextResponse } from 'next/server'
import {
  getAllInvites,
  createInvite,
  batchCreateInvites,
  generateBareInvites,
  getAdminStats,
} from '@/lib/invites-store'
import { CreateInviteInput } from '@/lib/types'

export async function GET() {
  try {
    const [invites, stats] = await Promise.all([
      getAllInvites(),
      getAdminStats(),
    ])
    return NextResponse.json({ success: true, invites, stats })
  } catch (err) {
    console.error('Error in GET /api/invites:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invites' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 1. Bare multi-link generator mode (e.g. generate 5 or 10 links at once)
    if (body.count && Number(body.count) > 1) {
      const count = Number(body.count)
      const created = await generateBareInvites(count, {
        maxGuests: Number(body.maxGuests) || 2,
        tableNumber: body.tableNumber,
        category: body.category || 'General',
      })
      const stats = await getAdminStats()
      return NextResponse.json({
        success: true,
        count: created.length,
        invites: created,
        stats,
      })
    }

    // 2. Batch names creation mode
    if (Array.isArray(body.names) && body.names.length > 0) {
      const created = await batchCreateInvites(body.names, {
        maxGuests: Number(body.maxGuests) || 2,
        tableNumber: body.tableNumber,
        category: body.category || 'General',
      })
      const stats = await getAdminStats()
      return NextResponse.json({
        success: true,
        count: created.length,
        invites: created,
        stats,
      })
    }

    // 3. Single bare/custom invite creation mode (table is automatically assigned if empty)
    const input = body as CreateInviteInput
    const created = await createInvite(input)
    const stats = await getAdminStats()
    return NextResponse.json({ success: true, invite: created, stats })
  } catch (err) {
    console.error('Error in POST /api/invites:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to create invite' },
      { status: 500 }
    )
  }
}
