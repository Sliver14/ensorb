import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const { image, folder } = await req.json()

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image data provided' },
        { status: 400 }
      )
    }

    const result = await uploadToCloudinary(image, folder || 'ensorb-wedding/guests')

    return NextResponse.json({
      success: true,
      url: result.secureUrl || result.url,
      isCloudinary: result.isCloudinary,
      publicId: result.publicId,
    })
  } catch (err) {
    console.error('Error in POST /api/upload:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
