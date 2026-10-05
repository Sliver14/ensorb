import { NextResponse } from 'next/server'
import { getAllGifts, getGiftAdminStats } from '@/lib/gifts-store'

export async function GET() {
  try {
    const [gifts, stats] = await Promise.all([
      getAllGifts(),
      getGiftAdminStats(),
    ])

    return NextResponse.json({
      success: true,
      gifts,
      stats,
    })
  } catch (error) {
    console.error('Error fetching gifts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gifts' },
      { status: 500 }
    )
  }
}
