'use client'

import { FieldGroup } from '@/components/ui/fragments/shadcn-ui/field'
import type { CreateReviewFormReturn } from '@/hooks/form/use-review-form'

// ============================================
// REVIEW FORM COMPONENT
// ============================================

interface ReviewFormProps {
  form: CreateReviewFormReturn
  children?: React.ReactNode
}

function ReviewForm({ form, children }: ReviewFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      id="review-form"
      className="flex flex-col gap-4 px-0"
    >
      <main className="space-y-6">
        {/* Rating Section - Primary Focus */}
        <FieldGroup className="border-b w-full flex justify-center items-center  pb-6 pt-2 px-4 sm:px-7">
          <div className="flex flex-col justify-center items-center gap-4">
            <h3 className="text-lg sr-only font-semibold text-center">
              Berikan Rating Anda
            </h3>
            <form.AppField name="rating">
              {(field) => (
                <field.Rating
                  label=""
                  // description="Klik bintang untuk memberikan rating"
                  size="xl"
                />
              )}
            </form.AppField>
          </div>
        </FieldGroup>

        {/* Review Details */}
        <FieldGroup className="px-4 sm:px-7 pb-6 ">
          <form.AppField name="title">
            {(field) => (
              <field.Input
                label="Judul Review"
                placeholder="Tempat wisata yang menakjubkan!"
                // description="Opsional - ringkasan pengalaman Anda"
              />
            )}
          </form.AppField>

          <form.AppField name="content">
            {(field) => (
              <field.Textarea
                label="Ulasan Anda"
                placeholder="Ceritakan pengalaman Anda "
                // description="Opsional - bagikan detail pengalaman Anda"
              />
            )}
          </form.AppField>
        </FieldGroup>
      </main>

      {/* Submit Button - Passed as children */}
      {children}
    </form>
  )
}

export default ReviewForm
