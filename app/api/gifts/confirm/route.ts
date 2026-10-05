import { NextRequest, NextResponse } from 'next/server'
import { confirmGiftContribution } from '@/lib/gifts-store'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { contributionId, confirmedBy } = body

    if (!contributionId) {
      return NextResponse.json(
        { success: false, error: 'Contribution ID is required' },
        { status: 400 }
      )
    }

    const result = await confirmGiftContribution(contributionId, confirmedBy || 'Admin')

    return NextResponse.json({
      success: true,
      contribution: result.contribution,
      updatedGift: result.updatedGift,
      message: 'Gift contribution confirmed successfully and registry progress updated!',
    })
  } catch (error) {
    console.error('Error confirming gift contribution:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to confirm gift contribution' },
      { status: 500 }
    )
  }
}
