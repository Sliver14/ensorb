import { NextRequest, NextResponse } from 'next/server'
import { recordGiftContribution } from '@/lib/gifts-store'
import { sendAdminGiftNotificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const siteUrl = req.nextUrl.origin || process.env.NEXT_PUBLIC_SITE_URL || 'https://ensorb.com'
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

    // Send admin email notification to engysorbari@gmail.com
    try {
      await sendAdminGiftNotificationEmail(contribution, siteUrl)
    } catch (notifyErr) {
      console.warn('Failed to send admin gift notification email:', notifyErr)
    }

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
