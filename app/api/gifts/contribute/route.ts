import { NextRequest, NextResponse } from 'next/server'
import { recordGiftContribution } from '@/lib/gifts-store'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      giftId,
      giftTitle,
      contributorName,
      contributorEmail,
      contributorPhone,
      amount,
      paymentReference,
      customNote,
    } = body

    if (!contributorName || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, error: 'Please provide your name and a valid gift contribution amount.' },
        { status: 400 }
      )
    }

    const contribution = await recordGiftContribution({
      giftId: giftId || null,
      giftTitle: giftTitle || 'Wedding Cash Blessing',
      contributorName,
      contributorEmail,
      contributorPhone,
      amount: Number(amount),
      paymentReference,
      customNote,
    })

    return NextResponse.json({
      success: true,
      contribution,
      message: 'Your gift contribution has been submitted! Once verified by the couple, the progress bar will update automatically.',
    })
  } catch (error) {
    console.error('Error submitting gift contribution:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record contribution' },
      { status: 500 }
    )
  }
}
