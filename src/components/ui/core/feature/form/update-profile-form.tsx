// src/components/ui/core/feature/settings/update-profile-form.tsx
'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { FieldGroup } from '@/components/ui/fragments/shadcn-ui/field'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import { useUpdateProfileForm } from '@/hooks/form/use-auth-form'
import { authClient } from '@/lib/auth/auth-client'
import {
  uploadCroppedImageServer,
  updateUserProfileServer,
  deleteCloudinaryFileServer,
} from '@/lib/server/profile-actions'
export function UpdateProfileForm() {
  const { data: session } = authClient.useSession()
  // Import server-side actions for cloudinary deletion
  // eslint-disable-next-line @typescript-eslint/no-var-requires

  const [isUploading, setIsUploading] = useState(false)

  const form = useUpdateProfileForm({
    onSuccess: async (data) => {
      try {
        setIsUploading(true)

        // 1. Upload image if exists
        let imageUrl: string | null = null
        if (data.image?.dataUrl) {
          const imageResult = await uploadCroppedImageServer({
            data: {
              dataUrl: data.image.dataUrl,
              folder: 'suasana/profiles/images',
              filename: data.image.filename,
            },
          })
          imageUrl = imageResult.url
        }

        // If there was an existing image and we've uploaded a new one, delete the old file from Cloudinary
        const previousAvatar = session?.user?.image as string | undefined
        if (previousAvatar && imageUrl && previousAvatar !== imageUrl) {
          try {
            // Use createServerFn exported function to delete file server-side
            await deleteCloudinaryFileServer({ data: { url: previousAvatar } })
          } catch (err) {
            // don't block update on delete failure - just log
            // eslint-disable-next-line no-console
            console.warn('Failed to delete previous image:', err)
          }
        }

        // 3. Update DB (single avatar URL)
        const updated = await updateUserProfileServer({
          data: {
            userId: session!.user.id,
            name: data.name,
            avatarUrl: imageUrl ?? undefined,
          },
        })

        toast.success('Profile updated successfully!')

        // Update local UI with returned user (no full reload)
        console.log('Profile updated (server returned):', updated)
      } catch (error) {
        console.error('Profile update error:', error)
        toast.error(
          error instanceof Error ? error.message : 'Failed to update profile',
        )
      } finally {
        setIsUploading(false)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          id="update-profile-form"
          className="space-y-6"
        >
          <FieldGroup className="gap-4.5">
            {/* Name Field */}
            {/* Avatar Upload (Cropper) */}
            <form.AppField name={'image'}>
              {(field) => (
                <field.AvatarUpload
                  label="Avatar"
                  // description="Upload a profile picture (square recommended)"
                  aspectRatio={1}
                  maxSizeMB={5}
                />
              )}
            </form.AppField>
            <form.AppField name="name">
              {(field) => (
                <field.Input
                  label="Name"
                  placeholder="Enter your name"
                  showLabel
                />
              )}
            </form.AppField>
          </FieldGroup>

          {/* Submit Button */}
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting || isUploading ? (
              <>
                {isUploading ? 'Uploading...' : 'Updating...'}
                <Spinner className=" text-primary-foreground" />
              </>
            ) : (
              'Perbarui Profil'
            )}
          </Button>

          {/* Info: Email cannot be changed */}
          <p className="text-sm sr-only text-muted-foreground">
            ℹ️ Email cannot be changed in passwordless authentication.
            <br />
            Your email: <strong>{session?.user?.email}</strong>
          </p>
        </form>
      )}
    </form.Subscribe>
  )
}
