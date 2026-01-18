'use client'

import * as React from 'react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useStore } from '@tanstack/react-store'
import { AlertCircle, ImageIcon, Upload, X } from 'lucide-react'
import MediaItem from '../media/media-item'
import { Spinner } from '../../shadcn-ui/spinner'
import { FormBase } from './form-base'
import type { FormControlProps } from './form-base'
import type { CloudinaryUploadResult } from '@/hooks/use-cloudinary-upload'
import { cn } from '@/lib/utils'
import { useFieldContext } from '@/hooks/form/use-form'

// ============================================
// TYPES
// ============================================

/**
 * File value can be:
 * - string: Already uploaded URL (from Cloudinary or existing data)
 * - File: Local file pending upload
 * - null/undefined: No file
 */
export type FileValue = string | File | null | undefined

interface FormFileUploadProps extends FormControlProps {
  /** Folder in Cloudinary to upload to */
  folder?: string
  /** Maximum file size in bytes (default: 10MB) */
  maxFileSize?: number
  /** Accepted file types */
  acceptedTypes?: Array<string>
  /** Whether to allow multiple files */
  multiple?: boolean
  /** Aspect ratio for preview (e.g., '16/9', '1/1') */
  aspectRatio?: string
  /** Placeholder text */
  placeholder?: string
  /** onUpload callback - called after successful upload */
  onUpload?: (result: CloudinaryUploadResult) => void
  /** onRemove callback */
  onRemove?: (url: string) => void
}

// ============================================
// HELPER: Check if value is a URL string
// ============================================

function isUrlString(value: FileValue): value is string {
  return typeof value === 'string' && value.length > 0
}

function isFile(value: FileValue): value is File {
  return value instanceof File
}

// ============================================
// SINGLE IMAGE PREVIEW
// ============================================

interface ImagePreviewProps {
  url: string
  onRemove: () => void
  disabled?: boolean
  aspectRatio?: string
  isPending?: boolean
}

function ImagePreview({
  url,
  onRemove,
  disabled,
  aspectRatio,
  isPending,
}: ImagePreviewProps) {
  return (
    <div
      className={cn(
        'relative group rounded-lg overflow-hidden border bg-muted',
        aspectRatio && `aspect-[${aspectRatio}]`,
        !aspectRatio && 'aspect-square',
      )}
    >
      <MediaItem webViewLink={url} className="w-full h-full object-cover" />
      {/* Pending upload indicator */}
      {isPending && (
        <div className="absolute inset-0 sr-only bg-primary/30 flex items-center justify-center">
          <span className="text-xs text-primary-foreground  bg-primary/50 px-2 py-1 rounded">
            Pending upload
          </span>
        </div>
      )}
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            'absolute top-2 right-2 p-1.5 rounded-full',
            'bg-destructive text-destructive-foreground',
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'hover:bg-destructive/90 focus:opacity-100',
          )}
          aria-label="Remove image"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// ============================================
// UPLOAD DROP ZONE
// ============================================

interface UploadDropZoneProps {
  onFilesSelect: (files: FileList) => void
  isUploading: boolean
  multiple?: boolean
  acceptedTypes?: Array<string>
  disabled?: boolean
  error?: string | null
  inputId: string
}

function UploadDropZone({
  onFilesSelect,
  isUploading,
  multiple = false,
  acceptedTypes,
  disabled,
  error,
  inputId,
}: UploadDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled && !isUploading) {
        setIsDragOver(true)
      }
    },
    [disabled, isUploading],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      if (disabled || isUploading) return

      const files = e.dataTransfer.files
      if (files.length > 0) {
        onFilesSelect(files)
      }
    },
    [disabled, isUploading, onFilesSelect],
  )

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      inputRef.current?.click()
    }
  }, [disabled, isUploading])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        onFilesSelect(files)
      }
      // Reset input value to allow selecting the same file again
      e.target.value = ''
    },
    [onFilesSelect],
  )

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2',
        'rounded-xl border-2 border-dashed p-6 cursor-pointer',
        'transition-colors duration-200',
        isDragOver && 'border-primary bg-primary/5',
        !isDragOver && 'border-muted-foreground/25 hover:border-primary/50',
        (disabled || isUploading) && 'opacity-50 cursor-not-allowed',
        error && 'border-destructive',
      )}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        multiple={multiple}
        accept={acceptedTypes?.join(',')}
        onChange={handleChange}
        disabled={disabled || isUploading}
        className="sr-only"
        aria-describedby={error ? `${inputId}-error` : undefined}
      />

      {isUploading ? (
        <>
          <Spinner />
          <p className="text-sm text-muted-foreground">Uploading...</p>
        </>
      ) : error ? (
        <>
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="text-sm text-destructive text-center">{error}</p>
        </>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
          >
            <ImageIcon className="size-4 opacity-60" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              {isDragOver
                ? 'Letakkan file di sini'
                : 'Klik untuk mengunggah atau seret dan lepas'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, WEBP up to 10MB
            </p>
          </div>
        </>
      )}
    </div>
  )
}

// ============================================
// MAIN COMPONENT: Single File Upload
// ============================================

export function FormFileUpload({
  folder = 'destinations',
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  aspectRatio,

  onUpload,
  onRemove,
  ...props
}: FormFileUploadProps) {
  const field = useFieldContext<FileValue>()
  const inputId = useId()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const isSubmitting = useStore(
    field.form.baseStore,
    (state) => state.isSubmitting,
  )

  // Create preview URL for File objects
  useEffect(() => {
    const value = field.state.value
    if (isFile(value)) {
      const url = URL.createObjectURL(value)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else if (isUrlString(value)) {
      setPreviewUrl(value)
    } else {
      setPreviewUrl(null)
    }
  }, [field.state.value])

  const handleFilesSelect = useCallback(
    (files: FileList) => {
      const file = files[0]
      if (!file) return

      // Validate file size
      if (file.size > maxFileSize) {
        setLocalError(
          `File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`,
        )
        return
      }

      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        setLocalError('Invalid file type. Please upload an image.')
        return
      }

      setLocalError(null)
      // Store the File object (will be uploaded on form submit)
      field.handleChange(file as unknown as FileValue)
    },
    [field, maxFileSize, acceptedTypes],
  )

  const handleRemove = useCallback(() => {
    const currentValue = field.state.value
    if (isUrlString(currentValue)) {
      onRemove?.(currentValue)
    }
    field.handleChange(undefined)
    setLocalError(null)
  }, [field, onRemove])

  const isPending = isFile(field.state.value)

  return (
    <FormBase {...props}>
      {previewUrl ? (
        <ImagePreview
          url={previewUrl}
          onRemove={handleRemove}
          disabled={isSubmitting}
          aspectRatio={aspectRatio}
          isPending={isPending}
        />
      ) : (
        <UploadDropZone
          inputId={inputId}
          onFilesSelect={handleFilesSelect}
          isUploading={false}
          acceptedTypes={acceptedTypes}
          disabled={isSubmitting}
          error={localError}
        />
      )}
    </FormBase>
  )
}

// ============================================
// MULTI-FILE UPLOAD COMPONENT
// ============================================

/** Multi-file value - array of URLs or Files */
export type MultiFileValue = Array<string | File>

interface FormMultiFileUploadProps extends FormControlProps {
  folder?: string
  maxFileSize?: number
  acceptedTypes?: Array<string>
  maxFiles?: number
  aspectRatio?: string

  onUpload?: (result: CloudinaryUploadResult) => void
  onRemove?: (url: string, index: number) => void
}

interface PreviewItem {
  url: string
  isPending: boolean
  originalIndex: number
}

export function FormMultiFileUpload({
  folder = 'destinations',
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxFiles = 10,
  aspectRatio,

  onUpload,
  onRemove,
  ...props
}: FormMultiFileUploadProps) {
  const field = useFieldContext<MultiFileValue>()
  const inputId = useId()
  const [previews, setPreviews] = useState<Array<PreviewItem>>([])
  const [localError, setLocalError] = useState<string | null>(null)

  const isSubmitting = useStore(
    field.form.baseStore,
    (state) => state.isSubmitting,
  )

  // Normalize field value to array
  const currentValues: MultiFileValue = React.useMemo(() => {
    const value = field.state.value
    if (!value) return []
    if (Array.isArray(value)) return value
    // Handle JSON string from database
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  }, [field.state.value])

  // Generate preview URLs for all items
  useEffect(() => {
    const newPreviews: Array<PreviewItem> = []
    const objectUrls: Array<string> = []

    currentValues.forEach((item, index) => {
      if (isFile(item)) {
        const url = URL.createObjectURL(item)
        objectUrls.push(url)
        newPreviews.push({ url, isPending: true, originalIndex: index })
      } else if (isUrlString(item)) {
        newPreviews.push({ url: item, isPending: false, originalIndex: index })
      }
    })

    setPreviews(newPreviews)

    // Cleanup object URLs
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [currentValues])

  const handleFilesSelect = useCallback(
    (files: FileList) => {
      const remainingSlots = maxFiles - currentValues.length
      const filesToAdd = Array.from(files).slice(0, remainingSlots)

      // Validate files
      for (const file of filesToAdd) {
        if (file.size > maxFileSize) {
          setLocalError(
            `File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`,
          )
          return
        }
        if (!acceptedTypes.includes(file.type)) {
          setLocalError('Invalid file type. Please upload images only.')
          return
        }
      }

      setLocalError(null)
      // Add files to state (will be uploaded on form submit)
      field.handleChange([...currentValues, ...filesToAdd])
    },
    [currentValues, maxFiles, maxFileSize, acceptedTypes, field],
  )

  const handleRemove = useCallback(
    (index: number) => {
      const itemToRemove = currentValues[index]
      const newValues = currentValues.filter((_, i) => i !== index)
      field.handleChange(newValues)

      if (isUrlString(itemToRemove)) {
        onRemove?.(itemToRemove, index)
      }
      setLocalError(null)
    },
    [currentValues, field, onRemove],
  )

  const canAddMore = currentValues.length < maxFiles

  return (
    <FormBase {...props}>
      <div className="space-y-4">
        {/* Image Grid */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <ImagePreview
                key={`${preview.url}-${index}`}
                url={preview.url}
                onRemove={() => handleRemove(preview.originalIndex)}
                disabled={isSubmitting}
                aspectRatio={aspectRatio}
                isPending={preview.isPending}
              />
            ))}
          </div>
        )}

        {/* Upload Zone */}
        {canAddMore && (
          <UploadDropZone
            inputId={inputId}
            onFilesSelect={handleFilesSelect}
            isUploading={false}
            multiple
            acceptedTypes={acceptedTypes}
            disabled={isSubmitting}
            error={localError}
          />
        )}

        {/* Counter */}
        <p className="text-xs text-muted-foreground text-center">
          {currentValues.length} / {maxFiles} images
        </p>
      </div>
    </FormBase>
  )
}

export default FormFileUpload
