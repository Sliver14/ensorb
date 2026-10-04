import crypto from 'crypto'

export interface CloudinaryUploadResult {
  url: string
  publicId?: string
  secureUrl: string
  format?: string
  width?: number
  height?: number
  isCloudinary: boolean
}

/**
 * Checks if Cloudinary credentials are configured in environment
 */
export function isCloudinaryConfigured(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  return Boolean(cloudName && ((apiKey && apiSecret) || uploadPreset))
}

/**
 * Uploads a base64 image or data-url to Cloudinary via REST API,
 * with automatic fallback if Cloudinary is not configured.
 */
export async function uploadToCloudinary(
  base64OrDataUrl: string,
  folder: string = 'ensorb-wedding/guests'
): Promise<CloudinaryUploadResult> {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const uploadPreset =
    process.env.CLOUDINARY_UPLOAD_PRESET ||
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName) {
    // Graceful fallback: return the optimized data URL so flow continues uninterrupted
    return {
      url: base64OrDataUrl,
      secureUrl: base64OrDataUrl,
      isCloudinary: false,
    }
  }

  try {
    const timestamp = Math.round(Date.now() / 1000).toString()
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

    const formData = new FormData()
    formData.append('file', base64OrDataUrl)
    formData.append('folder', folder)

    if (uploadPreset) {
      // Unsigned upload using upload preset
      formData.append('upload_preset', uploadPreset)
    } else if (apiKey && apiSecret) {
      // Signed upload
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
      const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex')

      formData.append('timestamp', timestamp)
      formData.append('api_key', apiKey)
      formData.append('signature', signature)
    } else {
      // Fallback
      return {
        url: base64OrDataUrl,
        secureUrl: base64OrDataUrl,
        isCloudinary: false,
      }
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errText = await response.text()
      console.warn('Cloudinary upload warning, falling back to direct asset:', errText)
      return {
        url: base64OrDataUrl,
        secureUrl: base64OrDataUrl,
        isCloudinary: false,
      }
    }

    const result = await response.json()
    return {
      url: result.url || result.secure_url,
      secureUrl: result.secure_url || result.url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      isCloudinary: true,
    }
  } catch (error) {
    console.error('Error during Cloudinary upload, using direct preview:', error)
    return {
      url: base64OrDataUrl,
      secureUrl: base64OrDataUrl,
      isCloudinary: false,
    }
  }
}
