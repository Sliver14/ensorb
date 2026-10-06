import { NextResponse } from 'next/server'
import { resetAllGiftsAndContributions } from '@/lib/gifts-store'

export async function POST() {
  try {
    const result = await resetAllGiftsAndContributions()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error resetting gifts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset gifts' },
      { status: 500 }
    )
  }
}
