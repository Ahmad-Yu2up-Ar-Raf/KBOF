'use client'
import { FieldGroup } from '@/components/ui/fragments/shadcn-ui/field'

import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import type { RegisterFormReturn } from '@/hooks/actions/auth/use-auth-form'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'

/**
 * ✅ SignUpForm sekarang terima props dari parent
 * Ini bikin form reusable dan state bisa di-share ke sibling components
 */
interface SignUpFormProps {
  form: RegisterFormReturn
  isPending: boolean
}

export function SignUpForm({ form, isPending }: SignUpFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      id="register-form"
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
        <FieldGroup className=" grid grid-cols-1 md:grid-cols-2 gap-4.5 w-full ">
          <form.AppField name="name">
            {(field) => <field.Input label="Name" placeholder="name" />}
          </form.AppField>

          {/* Password Field */}
          <form.AppField name="password">
            {(field) => (
              <field.Input
                label="Password"
                placeholder="*****"
                type="password"
              />
            )}
          </form.AppField>
        </FieldGroup>
      </FieldGroup>

      {/* Submit Button - Optional */}

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isPending}
      >
        {isPending ? (
          <>
            Daftar...
            <Spinner />
          </>
        ) : (
          'Daftar'
        )}
      </Button>
    </form>
  )
}
