// src/components/ui/fragments/custom-ui/form/form-avatar-upload.tsx
'use client'

import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useStore } from '@tanstack/react-store'
import {
  ArrowLeftIcon,
  CircleUserRoundIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from 'lucide-react'
import { FormBase } from './form-base'
import type { FormControlProps } from './form-base'
import type { CroppedImageData } from '@/lib/validations/profile-validations'
import { useFieldContext } from '@/hooks/form/use-form'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import {
  Cropper,
  CropperCropArea,
  CropperDescription,
  CropperImage,
} from '@/components/ui/fragments/shadcn-ui/cropper'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/fragments/shadcn-ui/dialog'
import { Slider } from '@/components/ui/fragments/shadcn-ui/slider'
import { Input } from '../../shadcn-ui/input'
import MediaItem from '../media/media-item'

// ============================================
// TYPES
// ============================================

type Area = { x: number; y: number; width: number; height: number }

// ============================================
// HELPER: Create cropped blob from canvas
// ============================================

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number = pixelCrop.width,
  outputHeight: number = pixelCrop.height,
): Promise<Blob | null> {
  try {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) return null

    canvas.width = outputWidth
    canvas.height = outputHeight

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputWidth,
      outputHeight,
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95)
    })
  } catch (error) {
    console.error('Error cropping image:', error)
    return null
  }
}

// ============================================
// FORM AVATAR UPLOAD COMPONENT
// ============================================

interface FormAvatarUploadProps extends FormControlProps {
  aspectRatio?: number
  maxSizeMB?: number
}

export function FormAvatarUpload({
  aspectRatio = 1, // 1:1 square by default
  maxSizeMB = 5,
  ...props
}: FormAvatarUploadProps) {
  const field = useFieldContext<CroppedImageData | null>()
  const isSubmitting = useStore(
    field.form.baseStore,
    (state) => state.isSubmitting,
  )

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [zoom, setZoom] = useState(1)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const previousValueRef = useRef<CroppedImageData | null>(null)

  // ============================================
  // SYNC EXISTING VALUE (from DB) TO PREVIEW
  // ============================================

  useEffect(() => {
    const currentValue = field.state.value

    // If value exists and is different from previous, set as final preview
    if (currentValue && currentValue !== previousValueRef.current) {
      if (currentValue.dataUrl) {
        setFinalImageUrl(currentValue.dataUrl)
      }
    }

    previousValueRef.current = currentValue
  }, [field.state.value])

  // ============================================
  // FILE SELECTION
  // ============================================

  const handleFileSelect = useCallback(
    (file: File) => {
      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File size must be less than ${maxSizeMB}MB`)
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setIsDialogOpen(true)
      setZoom(1)
      setCroppedAreaPixels(null)
    },
    [maxSizeMB],
  )

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
    // Reset input
    e.target.value = ''
  }

  // ============================================
  // CROPPER HANDLERS
  // ============================================

  const handleCropChange = useCallback((pixels: Area | null) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const handleApply = async () => {
    if (!previewUrl || !croppedAreaPixels || !selectedFile) {
      console.error('Missing data for crop')
      setIsDialogOpen(false)
      return
    }

    try {
      // 1. Get cropped blob
      const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels)

      if (!croppedBlob) {
        throw new Error('Failed to generate cropped image')
      }

      // 2. Convert blob to base64 data URL
      const reader = new FileReader()
      reader.onloadend = () => {
        const dataUrl = reader.result as string

        // 3. Create CroppedImageData object
        const croppedData: CroppedImageData = {
          filename: selectedFile.name,
          dataUrl,
          width: croppedAreaPixels.width,
          height: croppedAreaPixels.height,
          mime: selectedFile.type,
        }

        // 4. Update form field value
        field.handleChange(croppedData)

        // 5. Update preview
        if (finalImageUrl && finalImageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(finalImageUrl)
        }
        setFinalImageUrl(dataUrl)

        // 6. Close dialog
        setIsDialogOpen(false)
      }

      reader.readAsDataURL(croppedBlob)
    } catch (error) {
      console.error('Error during crop:', error)
      setIsDialogOpen(false)
    }
  }

  const handleRemove = () => {
    if (finalImageUrl && finalImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(finalImageUrl)
    }
    setFinalImageUrl(null)
    field.handleChange(null)
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  // ============================================
  // CLEANUP
  // ============================================

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
      if (finalImageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(finalImageUrl)
      }
    }
  }, [previewUrl, finalImageUrl])

  // ============================================
  // RENDER
  // ============================================

  return (
    <FormBase {...props}>
      <div className="flex flex-col items-center gap-2">
        <div className="relative inline-flex">
          {/* Avatar Preview */}
          <Button
            variant={"ghost"}
            aria-label={finalImageUrl ? 'Change avatar' : 'Upload avatar'}
            className="relative flex size-24 items-center justify-center overflow-hidden rounded-full border border-input border-dashed outline-none transition-colors hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-disabled:pointer-events-none has-[img]:border-none has-disabled:opacity-50 p-0"
            onClick={openFileDialog}
            type="button"
            disabled={isSubmitting}
          >
            {finalImageUrl ? (
              <MediaItem
                className="size-full object-cover"
                webViewLink={finalImageUrl}
              />
            ) : (
              <CircleUserRoundIcon className="size-8 opacity-60" />
            )}
          </Button>

          {/* Remove Button */}
          {finalImageUrl && !isSubmitting && (
            <Button
              aria-label="Remove avatar"
              className="-top-1 -right-1 absolute size-6 rounded-full border-2 border-background shadow-none"
              onClick={handleRemove}
              size="icon"
              type="button"
            >
              <XIcon className="size-3.5" />
            </Button>
          )}

          {/* Hidden File Input */}
          <Input
            id="avatar-upload"
            name="avatar"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            disabled={isSubmitting}
          />
        </div>

        {/* Cropper Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="gap-0 p-0 sm:max-w-140 *:[button]:hidden">
            <DialogDescription className="sr-only">
              Crop avatar image
            </DialogDescription>
            <DialogHeader className="contents space-y-0 text-left">
              <DialogTitle className="flex items-center justify-between border-b p-4 text-base">
                <div className="flex items-center gap-2">
                  <Button
                    aria-label="Cancel"
                    className="-my-1 opacity-60"
                    onClick={handleCancel}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <ArrowLeftIcon aria-hidden="true" />
                  </Button>
                  <span>Crop Avatar</span>
                </div>
                <Button
                  autoFocus
                  className="-my-1"
                  disabled={!previewUrl}
                  onClick={handleApply}
                  type="button"
                >
                  Apply
                </Button>
              </DialogTitle>
            </DialogHeader>
            {previewUrl && (
              <Cropper
                className="h-96 sm:h-120"
                image={previewUrl}
                onCropChange={handleCropChange}
                onZoomChange={setZoom}
                zoom={zoom}
                // aspect={aspectRatio}
              >
                <CropperDescription />
                <CropperImage />
                <CropperCropArea />
              </Cropper>
            )}
            <DialogFooter className="border-t px-4 py-6">
              <div className="mx-auto flex w-full max-w-80 items-center gap-4">
                <ZoomOutIcon className="shrink-0 opacity-60" size={16} />
                <Slider
                  aria-label="Zoom slider"
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  min={1}
                  max={3}
                  step={0.1}
                />
                <ZoomInIcon className="shrink-0 opacity-60" size={16} />
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </FormBase>
  )
}
