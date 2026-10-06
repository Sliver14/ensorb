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
      guestName,
      guestEmail,
      guestPhone,
      maxGuests = 2,
      tableNumber = 'Table 01 - Emerald VIP',
      category = 'General',
      customNote,
      autoApprove = true,
    } = body

    if (!guestName || !guestName.trim()) {
      return NextResponse.json(
        { success: false, error: 'Guest name is required.' },
        { status: 400 }
      )
    }

    const input: CreateInviteInput = {
      targetName: guestName.trim(),
      targetEmail: guestEmail?.trim() || undefined,
      maxGuests: Number(maxGuests) || 1,
      tableNumber: tableNumber?.trim() || 'Table 01 - Emerald VIP',
      category: category || 'General',
      customNote: customNote?.trim() || undefined,
      source: 'admin_direct',
      sendEmailNow: false,
    }

    const newInvite = await createInvite(input)

    // If autoApprove is true, update the invite record to approved and registered
    if (autoApprove && newInvite) {
      const { updateInvite } = await import('@/lib/invites-store')
      await updateInvite(newInvite.code, {
        approvalStatus: 'approved',
        approvedAt: new Date().toISOString(),
        guestName: guestName.trim(),
        guestEmail: guestEmail?.trim() || undefined,
        guestPhone: guestPhone?.trim() || undefined,
        attendance: 'attending',
        actualGuestCount: Number(maxGuests) || 1,
        isRegistered: true,
        registeredAt: new Date().toISOString(),
        tableNumber: tableNumber?.trim() || 'Table 01 - Emerald VIP',
        category: category || 'General',
      })
    }

    const stats = await getAdminStats()

    return NextResponse.json({
      success: true,
      message: `Guest "${guestName}" successfully added and confirmed!`,
      invite: newInvite,
      stats,
    })
  } catch (err: any) {
    console.error('Error in POST /api/admin/manual-guest:', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to add guest' },
      { status: 500 }
    )
  }
}
