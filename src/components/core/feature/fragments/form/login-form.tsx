"use client"

import { FormWrapper } from "@/components/ui/fragments/custom-ui/form/form-wrapper"
import {
  Field,
 
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/fragments/shadcn-ui/field"
import { Input } from "@/components/ui/fragments/shadcn-ui/input"
import { PasswordInput } from "@/components/ui/fragments/custom-ui/input/password-input"
 
import { Button } from "@/components/ui/fragments/shadcn-ui/button"
 
import type { LoginFormReturn } from "@/hooks/actions/auth/use-auth-form"
import { Spinner } from "@/components/ui/fragments/shadcn-ui/spinner"

/**
 * ✅ SignInForm sekarang terima props dari parent
 * Ini bikin form reusable dan state bisa di-share ke sibling components
 */
interface SignInFormProps {
  form: LoginFormReturn["form"]
  isPending: LoginFormReturn["isPending"]
  error: LoginFormReturn["error"]
  
}

export function SignInForm({
  form,
  isPending,
  error,
 
}: SignInFormProps) {
  return (
    <FormWrapper form={form} isPending={isPending} id="signin-form">
      <FieldGroup className=" gap-4.5">
        {/* Email Field */}
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  type="email"
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="example@gmail.com"
                  autoComplete="email"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        {/* Password Field */}
        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <PasswordInput
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

 
      </FieldGroup>

      {/* Error Display */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error.message}
        </div>
      )}

      {/* Submit Button - Optional */}
  
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              Masuk...
              <Spinner/>
            </>
          ) : (
            "Masuk"
          )}
        </Button>
     
    </FormWrapper>
  )
}