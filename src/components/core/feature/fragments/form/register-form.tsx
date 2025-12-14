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
import type { RegisterFormReturn } from "@/hooks/actions/auth/use-auth-form"
import { Spinner } from "@/components/ui/fragments/shadcn-ui/spinner"

/**
 * ✅ SignUpForm sekarang terima props dari parent
 * Ini bikin form reusable dan state bisa di-share ke sibling components
 */
interface SignUpFormProps {
  form: RegisterFormReturn["form"]
  isPending: RegisterFormReturn["isPending"]
  error: RegisterFormReturn["error"]
  
}

export function SignUpForm({
  form,
  isPending,
  error,
 
}: SignUpFormProps) {
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
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4.5 w-full ">

        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  type="text"
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="ahmad azzam"
             
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
        </div>

 
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
              Daftar...
              <Spinner/>
            </>
          ) : (
            "Daftar"
          )}
        </Button>
     
    </FormWrapper>
  )
}