// =============================================================================
// CLOUDINARY UPLOAD HOOK - SUASANA
// =============================================================================
// Custom hook for client-side direct upload to Cloudinary with signed URLs.

import { useState, useCallback } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { generateCloudinarySignature } from '@/lib/cloudinary/cloudinary-actions'

// ============================================
// TYPES
// ============================================

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  url: string
  resource_type: 'image' | 'video' | 'raw'
  format: string
  width?: number
  height?: number
  bytes: number
  created_at: string
  original_filename: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface UseCloudinaryUploadOptions {
  folder?: string
  onProgress?: (progress: UploadProgress) => void
  onSuccess?: (result: CloudinaryUploadResult) => void
  onError?: (error: Error) => void
  maxFileSize?: number // in bytes (default: 10MB)
  acceptedTypes?: string[] // e.g., ['image/jpeg', 'image/png']
}

export interface UseCloudinaryUploadReturn {
  upload: (file: File) => Promise<CloudinaryUploadResult | null>
  uploadMultiple: (files: File[]) => Promise<CloudinaryUploadResult[]>
  isUploading: boolean
  progress: UploadProgress | null
  error: Error | null
  reset: () => void
}

// ============================================
// DEFAULT VALUES
// ============================================

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const DEFAULT_ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]

// ============================================
// HOOK IMPLEMENTATION
// ============================================

export function useCloudinaryUpload(
  options: UseCloudinaryUploadOptions = {},
): UseCloudinaryUploadReturn {
  const {
    folder = 'uploads',
    onProgress,
    onSuccess,
    onError,
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  } = options

  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const getSignature = useServerFn(generateCloudinarySignature)

  /**
   * Validate file before upload
   */
  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      // Check file size
      if (file.size > maxFileSize) {
        const maxSizeMB = (maxFileSize / 1024 / 1024).toFixed(1)
        return {
          valid: false,
          error: `File size exceeds ${maxSizeMB}MB limit`,
        }
      }

      // Check file type
      if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
        return {
          valid: false,
          error: `File type ${file.type} is not accepted. Allowed: ${acceptedTypes.join(', ')}`,
        }
      }

      return { valid: true }
    },
    [maxFileSize, acceptedTypes],
  )

  /**
   * Upload a single file to Cloudinary
   */
  const upload = useCallback(
    async (file: File): Promise<CloudinaryUploadResult | null> => {
      // Validate file
      const validation = validateFile(file)
      if (!validation.valid) {
        const err = new Error(validation.error)
        setError(err)
        onError?.(err)
        return null
      }

      setIsUploading(true)
      setError(null)
      setProgress({ loaded: 0, total: file.size, percentage: 0 })

      try {
        // Step 1: Get signature from server
        const signatureResponse = await getSignature({
          data: { folder },
        })

        if (!signatureResponse.success) {
          throw new Error('Failed to get upload signature')
        }

        const {
          signature,
          timestamp,
          apiKey,
          cloudName,
          folder: signedFolder,
        } = signatureResponse.data

        // Step 2: Create FormData for Cloudinary upload
        const formData = new FormData()
        formData.append('file', file)
        formData.append('api_key', apiKey)
        formData.append('timestamp', timestamp.toString())
        formData.append('signature', signature)
        if (signedFolder) {
          formData.append('folder', signedFolder)
        }

        // Step 3: Upload directly to Cloudinary
        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

        const response = await new Promise<CloudinaryUploadResult>(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest()

            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                const progressData: UploadProgress = {
                  loaded: event.loaded,
                  total: event.total,
                  percentage: Math.round((event.loaded / event.total) * 100),
                }
                setProgress(progressData)
                onProgress?.(progressData)
              }
            }

            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                try {
                  const result = JSON.parse(xhr.responseText)
                  resolve(result)
                } catch {
                  reject(new Error('Failed to parse Cloudinary response'))
                }
              } else {
                try {
                  const errorResponse = JSON.parse(xhr.responseText)
                  reject(
                    new Error(errorResponse.error?.message || 'Upload failed'),
                  )
                } catch {
                  reject(new Error(`Upload failed with status ${xhr.status}`))
                }
              }
            }

            xhr.onerror = () => {
              reject(new Error('Network error during upload'))
            }

            xhr.open('POST', uploadUrl)
            xhr.send(formData)
          },
        )

        setProgress({ loaded: file.size, total: file.size, percentage: 100 })
        onSuccess?.(response)

        return response
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Upload failed')
        setError(error)
        onError?.(error)
        return null
      } finally {
        setIsUploading(false)
      }
    },
    [folder, getSignature, validateFile, onProgress, onSuccess, onError],
  )

  /**
   * Upload multiple files to Cloudinary
   */
  const uploadMultiple = useCallback(
    async (files: File[]): Promise<CloudinaryUploadResult[]> => {
      const results: CloudinaryUploadResult[] = []

      for (const file of files) {
        const result = await upload(file)
        if (result) {
          results.push(result)
        }
      }

      return results
    },
    [upload],
  )

  /**
   * Reset the upload state
   */
  const reset = useCallback(() => {
    setIsUploading(false)
    setProgress(null)
    setError(null)
  }, [])

  return {
    upload,
    uploadMultiple,
    isUploading,
    progress,
    error,
    reset,
  }
}

export default useCloudinaryUpload
