// src/lib/server/cloudinary-upload-helper.ts
import crypto from 'crypto'

// ============================================
// CLOUDINARY UPLOAD (Base64 → Cloudinary)
// ============================================

interface UploadToCloudinaryParams {
  dataUrl: string // base64 data URL
  folder?: string
  filename?: string
}

interface CloudinaryUploadResult {
  public_id: string
  version: number
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  bytes: number
  type: string
  url: string
  secure_url: string
}

export async function uploadToCloudinary({
  dataUrl,
  folder = 'suasana/profiles',
  filename,
}: UploadToCloudinaryParams): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary credentials not configured')
  }

  try {
    // Generate signature for secure upload
    const timestamp = Math.round(Date.now() / 1000)
    const paramsToSign: Record<string, string | number> = {
      timestamp,
      folder,
    }

    if (filename) {
      paramsToSign.public_id = `${folder}/${filename.replace(/\.[^/.]+$/, '')}`
    }

    // Create signature
    const signature = crypto
      .createHash('sha1')
      .update(
        Object.keys(paramsToSign)
          .sort()
          .map((key) => `${key}=${paramsToSign[key]}`)
          .join('&') + apiSecret,
      )
      .digest('hex')

    // Prepare form data
    const formData = new FormData()
    formData.append('file', dataUrl)
    formData.append('api_key', apiKey)
    formData.append('timestamp', timestamp.toString())
    formData.append('signature', signature)
    formData.append('folder', folder)

    if (filename) {
      formData.append('public_id', paramsToSign.public_id as string)
    }

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Cloudinary upload failed: ${error}`)
    }

    const result: CloudinaryUploadResult = await response.json()
    return result
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}
