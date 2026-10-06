import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

export async function GET(req: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'Ensorb-IV.jpg.jpeg')
    const fileBuffer = await fs.readFile(filePath)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': 'attachment; filename="Official-Wedding-Invitation-Ngozi-and-Sorbari.jpeg"',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving invitation download:', error)
    // Fallback redirect to static asset
    const siteUrl = req.nextUrl.origin || 'https://ensorb.com'
    return NextResponse.redirect(`${siteUrl}/Ensorb-IV.jpg.jpeg`, 302)
  }
}
