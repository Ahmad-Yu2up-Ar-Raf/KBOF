'use client'

import { FieldGroup } from '@/components/ui/fragments/shadcn-ui/field'

import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { useChangePassword } from '@/hooks/actions/auth/use-auth-form'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import { toast } from 'sonner'

/**
 * ✅ SignUpForm sekarang terima props dari parent
 * Ini bikin form reusable dan state bisa di-share ke sibling components
 */

export function UpdatePassword() {
  const form = useChangePassword({
    onSuccess: async () => {
      // Your register logic here
      toast.success('Update berhasil!')

      // Example: redirect after register
      // router.push("/dashboard")
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
          id="update-password-form"
          className=" space-y-6"
        >
          <FieldGroup className=" gap-4.5">
            <form.AppField name="current_password">
              {(field) => (
                <field.Input
                  label="Current Password"
                  placeholder="*****"
                  type="password"
                />
              )}
            </form.AppField>
            <form.AppField name="password">
              {(field) => (
                <field.Input
                  label="New Password"
                  placeholder="*****"
                  type="password"
                />
              )}
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
                Change...
                <Spinner />
              </>
            ) : (
              'Change Password'
            )}
          </Button>
        </form>
      )}
    </form.Subscribe>
  )
}
