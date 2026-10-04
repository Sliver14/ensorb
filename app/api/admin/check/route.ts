import { NextRequest, NextResponse } from 'next/server'
import { isCloudinaryConfigured } from '@/lib/cloudinary'

export async function GET(req: NextRequest) {
  const session = req.cookies.get('ensorb_admin_session')?.value
  const isAuthenticated = session === 'authenticated_couple_session'

  return NextResponse.json({
    authenticated: isAuthenticated,
    cloudinaryConfigured: isCloudinaryConfigured(),
    emailProviderConfigured: Boolean(process.env.RESEND_API_KEY),
  })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' })
  response.cookies.delete('ensorb_admin_session')
  return response
}
