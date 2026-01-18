'use client'

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-react'

import React from 'react'
import MediaItem from './ui/fragments/custom-ui/media/media-item'
import { Input } from './ui/fragments/shadcn-ui/input'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { useFileUpload } from '@/hooks/use-file-upload'

// Create some dummy initial files
const initialFiles = [
  {
    id: 'image-01-123456789',
    name: 'image-01.jpg',
    size: 1528737,
    type: 'image/jpeg',
    url: 'https://picsum.photos/1000/800?grayscale&random=1',
  },
  {
    id: 'image-02-123456789',
    name: 'image-02.jpg',
    size: 1528737,
    type: 'image/jpeg',
    url: 'https://picsum.photos/1000/800?grayscale&random=2',
  },
  {
    id: 'image-03-123456789',
    name: 'image-03.jpg',
    size: 1528737,
    type: 'image/jpeg',
    url: 'https://picsum.photos/1000/800?grayscale&random=3',
  },
  {
    id: 'image-04-123456789',
    name: 'image-04.jpg',
    size: 1528737,
    type: 'image/jpeg',
    url: 'https://picsum.photos/1000/800?grayscale&random=4',
  },
]

interface ImagesUploadProps {
  initialFiles?: Array<{ id?: string; url?: string } | string | File>
  onChange?: (files: Array<string | File>) => void
  maxFiles?: number
  maxSizeMB?: number
  accept?: string
}

export default function ImagesUpload({
  onChange,
  maxFiles: propMaxFiles = 6,
  maxSizeMB = 5,
  accept = 'image/svg+xml,image/png,image/jpeg,image/jpg,image/gif',
}: ImagesUploadProps) {
  const maxSize = maxSizeMB * 1024 * 1024 // default bytes
  const maxFiles = propMaxFiles

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept,

    maxFiles,
    maxSize,
    multiple: true,
  })

  // Notify parent when files change: map each file entry to either the raw File
  // object (pending) or the existing url string.
  React.useEffect(() => {
    if (!onChange) return
    const mapped = files.map((f: any) => (f.file ? f.file : f.url || f.preview))
    onChange(mapped)
  }, [files, onChange])

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        className="relative flex min-h-52 flex-col items-center not-data-[files]:justify-center overflow-hidden rounded-xl   b  border-input border-dashed transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50  border-2   p-4 cursor-pointer"
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          {...getInputProps()}
          aria-label="Upload image file"
          className="sr-only"
        />
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate font-medium text-sm">
                File yang Diunggah ({files.length})
              </h3>
              <Button
                disabled={files.length >= maxFiles}
                onClick={openFileDialog}
                size="sm"
                type="button"
                variant="outline"
              >
                <UploadIcon
                  aria-hidden="true"
                  className="-ms-0.5 size-3.5 opacity-60"
                />
                Tambah Gambar
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {files.map((file) => (
                <div
                  className="relative aspect-square rounded-md bg-accent"
                  key={file.id}
                >
                  <MediaItem
                    className="size-full rounded-[inherit] object-cover"
                    webViewLink={`${file.preview}`}
                  />
                  <Button
                    aria-label="Remove image"
                    className="-top-2 -right-2 absolute size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
                    onClick={() => removeFile(file.id)}
                    size="icon"
                    type="button"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              aria-hidden="true"
              className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
            >
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 font-medium text-sm">
              Letakkan gambar Anda di sini
            </p>
            <p className="text-muted-foreground text-xs">
              SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
            </p>
            <Button
              type="button"
              className="mt-4"
              onClick={openFileDialog}
              variant="outline"
            >
              <UploadIcon aria-hidden="true" className="-ms-1 opacity-60" />
              Unggah Gambar
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          className="flex items-center gap-1 text-destructive text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  )
}
