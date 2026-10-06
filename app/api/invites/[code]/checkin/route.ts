import { NextRequest, NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Check-in verification is disabled for this event.',
  })
}
