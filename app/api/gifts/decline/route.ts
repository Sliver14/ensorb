import { NextRequest, NextResponse } from 'next/server'
import { declineGiftContribution, deleteGiftContribution } from '@/lib/gifts-store'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { contributionId, action } = body

    if (!contributionId) {
      return NextResponse.json(
        { success: false, error: 'Contribution ID is required' },
        { status: 400 }
      )
    }

    if (action === 'delete') {
      await deleteGiftContribution(contributionId)
      return NextResponse.json({
        success: true,
        message: 'Gift contribution deleted successfully',
      })
    } else {
      const contribution = await declineGiftContribution(contributionId)
      return NextResponse.json({
        success: true,
        contribution,
        message: 'Gift contribution declined',
      })
    }
  } catch (error) {
    console.error('Error declining gift contribution:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to decline contribution' },
      { status: 500 }
    )
  }
}
