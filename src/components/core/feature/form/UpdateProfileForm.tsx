'use client'
import { FieldGroup } from '@/components/ui/fragments/shadcn-ui/field'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { useUpdateForm } from '@/hooks/actions/auth/use-auth-form'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import { toast } from 'sonner'

/**
 * ✅ SignUpForm sekarang terima props dari parent
 * Ini bikin form reusable dan state bisa di-share ke sibling components
 */

export function UpdateForm() {
  const form = useUpdateForm({
    onSuccess: async () => {
      toast.success('Update berhasil!')
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
          className=" space-y-6"
        >
          <FieldGroup className=" gap-4.5">
            {/* Email Field */}
            <form.AppField name="email">
              {(field) => (
                <field.Input
                  label="Email"
                  type="email"
                  placeholder="example@gmail.com"
                />
              )}
            </form.AppField>

            <form.AppField name="name">
              {(field) => <field.Input label="Name" placeholder="name" />}
            </form.AppField>
          </FieldGroup>

          {/* Submit Button - Optional */}

          <Button
            type="submit"
            className=" cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                Update...
                <Spinner />
              </>
            ) : (
              'Update'
            )}
          </Button>
        </form>
      )}
    </form.Subscribe>
  )
}
