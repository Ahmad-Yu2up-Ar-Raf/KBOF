import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import AuthLayoutTemplate from '@/components/ui/core/layout/auth-layout'
import {
  MagicLinkForm,
  EmailSentView,
} from '@/components/ui/core/feature/form/magic-link-form'
import { useMagicLinkForm } from '@/hooks/form/use-auth-form'
import { cn } from '@/lib/utils'

export default function MagicLink() {
  const [emailSent, setEmailSent] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [canResend, setCanResend] = useState(false)
  const [cooldownSeconds, setCooldownSeconds] = useState(30)

  const form = useMagicLinkForm({
    onSuccess: async (data) => {
      setUserEmail(data.email)
      setEmailSent(true)
      setCanResend(false)
      setCooldownSeconds(30)
      toast.success('Magic link sent! Check your email.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send magic link')
    },
  })

  // Cooldown timer for resend
  useEffect(() => {
    if (!emailSent || canResend) return

    const interval = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [emailSent, canResend])

  const handleResend = async () => {
    if (!canResend) return

    setCanResend(false)
    setCooldownSeconds(30)

    try {
      await form.handleSubmit()
      toast.success('Magic link resent!')
    } catch (error) {
      toast.error('Failed to resend magic link')
      setCanResend(true)
    }
  }

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <AuthLayoutTemplate
          loading={isSubmitting}
          numberOfIterations={10}
          formType={undefined} // No login/register toggle
          signInGoogleButton={!emailSent} // Hide Google button after email sent
          title={emailSent ? undefined : 'Selamat datang  '}
          description={emailSent ? undefined : 'Perjalanan akan segera dimulai'}
          className={cn(
            'lg:max-w-none h-svh',
            emailSent && '[&_header]:sr-only',
          )}
        >
          {emailSent ? (
            <EmailSentView
              email={userEmail}
              onResend={handleResend}
              isResending={isSubmitting}
              canResend={canResend}
              cooldownSeconds={cooldownSeconds}
            />
          ) : (
            <MagicLinkForm form={form} isPending={isSubmitting} />
          )}
        </AuthLayoutTemplate>
      )}
    </form.Subscribe>
  )
}
