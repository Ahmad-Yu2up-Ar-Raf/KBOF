'use client'
import { FieldGroup } from '@/components/ui/fragments/shadcn-ui/field'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import type { LoginFormReturn } from '@/hooks/actions/auth/use-auth-form'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'

/**
 * ✅ SignInForm sekarang terima props dari parent
 * Ini bikin form reusable dan state bisa di-share ke sibling components
 */
interface SignInFormProps {
  form: LoginFormReturn
  isPending: boolean
}

export function SignInForm({ form, isPending }: SignInFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      id="signin-form"
      className="space-y-6"
    >
      <FieldGroup className="gap-4.5">
        <form.AppField name="email">
          {(field) => (
            <field.Input
              label="Email"
              type="email"
              placeholder="example@gmail.com"
            />
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.Input label="Password" placeholder="*****" type="password" />
          )}
        </form.AppField>
      </FieldGroup>

      {/* Submit Button - Optional */}

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isPending}
      >
        {isPending ? (
          <>
            Masuk
            <Spinner />
          </>
        ) : (
          'Masuk'
        )}
      </Button>
    </form>
  )
}
