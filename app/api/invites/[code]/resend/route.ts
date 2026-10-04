import { NextRequest, NextResponse } from 'next/server'
import { getInviteByCode, recordEmailResend } from '@/lib/invites-store'
import { sendWeddingPassEmail } from '@/lib/email'

interface RouteContext {
  params: Promise<{ code: string }>
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { code } = await context.params
    const invite = await getInviteByCode(code)

    if (!invite) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      )
    }

    if (!invite.isRegistered || !invite.guestEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'This invite has not been registered with an email address yet.',
        },
        { status: 400 }
      )
    }

    const siteUrl = req.nextUrl.origin || 'https://ensorb.com'
    const sendResult = await sendWeddingPassEmail(invite, siteUrl)

    if (sendResult.success) {
      await recordEmailResend(code)
      return NextResponse.json({
        success: true,
        message: `Wedding pass successfully resent to ${invite.guestEmail}!`,
        provider: sendResult.provider,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: sendResult.error || 'Failed to dispatch email pass',
        },
        { status: 500 }
      )
    }
  } catch (err) {
    console.error('Error in POST /api/invites/[code]/resend:', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error while resending email' },
      { status: 500 }
    )
  }
}
