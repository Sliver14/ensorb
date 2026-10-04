import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json()
    const validPin = process.env.ADMIN_PIN || 'ensorb2026'

    if (pin && pin.trim().toLowerCase() === validPin.toLowerCase()) {
      const response = NextResponse.json({ success: true, message: 'Authenticated' })
      // Set secure admin cookie
      response.cookies.set('ensorb_admin_session', 'authenticated_couple_session', {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })
      return response
    }

    return NextResponse.json(
      { success: false, error: 'Incorrect Passcode. Please check your wedding PIN.' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}
