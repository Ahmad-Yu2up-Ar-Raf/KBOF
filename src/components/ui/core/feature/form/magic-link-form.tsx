// src/components/ui/core/feature/auth/MagicLinkForm.tsx
'use client'

import type { MagicLinkFormReturn } from '@/hooks/form/use-auth-form'
import { FieldGroup } from '@/components/ui/fragments/shadcn-ui/field'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import { Inbox, ArrowRight, RefreshCw } from 'lucide-react'

interface MagicLinkFormProps {
  form: MagicLinkFormReturn
  isPending: boolean
}

export function MagicLinkForm({ form, isPending }: MagicLinkFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      id="magic-link-form"
      className="space-y-3"
    >
      <FieldGroup className="gap-4.5">
        <form.AppField name="email">
          {(field) => (
            <field.Input
              showLabel={false}
              label="Email"
              type="email"
              placeholder="example@gmail.com"
              // autoComplete="email"
              // autoFocus
            />
          )}
        </form.AppField>
      </FieldGroup>

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isPending}
      >
        {isPending ? (
          <>
            Mengirim magic link...
            <Spinner className=" text-primary-foreground" />
          </>
        ) : (
          <>
            Lanjutkan dengan email
            <ArrowRight className="ml-2 sr-only h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}

interface EmailSentViewProps {
  email: string
  onResend: () => void
  isResending: boolean
  canResend: boolean
  cooldownSeconds: number
}

export function EmailSentView({
  email,
  onResend,
  isResending,
  canResend,
  cooldownSeconds,
}: EmailSentViewProps) {
  return (
    <div className="space-y-6 text-center">
      <div className=" flex text-center  gap-3  flex-col items-left mb-5">
        <div className="m-auto bg-primary/10  rounded-full p-4 ">
          <Inbox className="size-10 text-primary" />
        </div>
        <h3 className="text-xl lg:text-2xl mt-3 font-medium tracking-tight">
          Verify your email
        </h3>
        <p className="  opacity-80">
          We've sent you a magic link to sign in to your account.
          <span className="text-sm text-muted-foreground font-medium">
            {email}
          </span>
        </p>
      </div>

      <div className="space-y-3 pt-4">
        <Button
          onClick={onResend}
          variant="outline"
          className="w-full"
          disabled={!canResend || isResending}
        >
          {isResending ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Resending...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              {canResend
                ? 'Resend magic link'
                : `Resend in ${cooldownSeconds}s`}
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          Didn't receive the email? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  )
}
