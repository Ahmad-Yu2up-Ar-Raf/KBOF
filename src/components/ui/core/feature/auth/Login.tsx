import { SignInForm } from '../form/login-form'
import { toast } from 'sonner'
import AuthLayoutTemplate from '../../layout/auth-layout'
import { useLoginForm } from '@/hooks/form/use-auth-form'
import { authClient } from '@/lib/auth/auth-client'
import type { UserRoleType } from '@/db/schema'

export default function Login() {
  /**
   * ✅ Call hook di parent component
   * Sekarang isPending bisa di-share ke AuthLayoutTemplate dan SignInForm
   */
  const form = useLoginForm({
    onSuccess: async () => {
      toast.success('Login berhasil!')
      // Get fresh session to determine redirect
      const session = await authClient.getSession()
      const user = session?.data?.user as
        | { role?: UserRoleType; hasCompletedOnboarding?: boolean }
        | undefined
      const role = user?.role || 'pribumi'

      // Role-based redirect
      if (role === 'pribumi') {
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
    /**
     * ✅ Gunakan form.Subscribe untuk reactive state
     * Akses langsung form.state.isSubmitting TIDAK reactive di TanStack Form v1
     */
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <AuthLayoutTemplate
          loading={isSubmitting}
          numberOfIterations={10}
          formType="login"
          className="lg:max-w-none h-svh"
        >
          {/* ✅ Pass form state ke SignInForm */}
          <SignInForm form={form} isPending={isSubmitting} />
        </AuthLayoutTemplate>
      )}
    </form.Subscribe>
  )
}
