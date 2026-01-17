import { SignUpForm } from '../form/register-form'
import { toast } from 'sonner'
import AuthLayoutTemplate from '../../layout/auth-layout'
import { useRegisterForm } from '@/hooks/form/use-auth-form'
import { authClient } from '@/lib/auth/auth-client'
import type { UserRoleType } from '@/db/schema'

export default function Register() {
  /**
   * ✅ Call hook di parent component
   * Sekarang isPending bisa di-share ke AuthLayoutTemplate dan SignInForm
   */
  const form = useRegisterForm({
    onSuccess: async () => {
      toast.success('Register berhasil!')
      // Get fresh session to determine redirect
      const session = await authClient.getSession()
      const user = session?.data?.user as
        | { role?: UserRoleType; hasCompletedOnboarding?: boolean }
        | undefined
      const role = user?.role || 'pribumi'

      // Role-based redirect - new users are pribumi by default
      if (role === 'pribumi') {
        // New users always go to onboarding first
        window.location.href = '/profile'
      } else {
        window.location.href = '/dashboard'
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <AuthLayoutTemplate
          loading={isSubmitting} // ✅ isPending bisa langsung dipake di sini!
          numberOfIterations={10}
          formType="register"
          className="lg:max-w-none h-svh"
        >
          {/* ✅ Pass form state ke SignInForm */}
          <SignUpForm form={form} isPending={isSubmitting} />
        </AuthLayoutTemplate>
      )}
    </form.Subscribe>
  )
}
