import { NextResponse } from 'next/server'
import { getAllContributions, getGiftAdminStats } from '@/lib/gifts-store'

export async function GET() {
  try {
    const [contributions, stats] = await Promise.all([
      getAllContributions(),
      getGiftAdminStats(),
    ])

    return NextResponse.json({
      success: true,
      contributions,
      stats,
    })
  } catch (error) {
    console.error('Error fetching contributions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gift contributions' },
      { status: 500 }
    )
  }
}
