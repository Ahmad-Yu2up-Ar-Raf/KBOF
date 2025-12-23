import { SignInForm } from '../form/LoginForm'
import { toast } from 'sonner'
import AuthLayoutTemplate from '../../layout/app/auth/AuthLayout'
import { useLoginForm } from '@/hooks/actions/auth/use-auth-form'
import { useNavigate } from '@tanstack/react-router'

export default function Login() {
  const navigate = useNavigate()
  /**
   * ✅ Call hook di parent component
   * Sekarang isPending bisa di-share ke AuthLayoutTemplate dan SignInForm
   */
  const form = useLoginForm({
    onSuccess: async () => {
      toast.success('Login berhasil!')
      navigate({ to: '/dashboard' })
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
          className="lg:max-w-none h-lvh"
        >
          {/* ✅ Pass form state ke SignInForm */}
          <SignInForm form={form} isPending={isSubmitting} />
        </AuthLayoutTemplate>
      )}
    </form.Subscribe>
  )
}
