import { toast } from 'sonner'
import { SignInForm } from '../form/login-form'
import AuthLayoutTemplate from '../../layout/auth-layout'

import { useLoginForm } from '@/hooks/form/use-auth-form'

export default function Login() {
  /**
   * ✅ Call hook di parent component
   * Sekarang isPending bisa di-share ke AuthLayoutTemplate dan SignInForm
   */
  const form = useLoginForm({
    onSuccess: async () => {
      toast.success('Login berhasil!')
      // Get fresh session to determine redirect

      // Role-based redirect

      window.location.href = '/dashboard'
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
