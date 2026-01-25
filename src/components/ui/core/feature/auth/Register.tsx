import { toast } from 'sonner'
import { SignUpForm } from '../form/register-form'
import AuthLayoutTemplate from '../../layout/auth-layout'

import { useRegisterForm } from '@/hooks/form/use-auth-form'

export default function Register() {
  /**
   * ✅ Call hook di parent component
   * Sekarang isPending bisa di-share ke AuthLayoutTemplate dan SignInForm
   */
  const form = useRegisterForm({
    onSuccess: async () => {
      toast.success('Register berhasil!')
      // Get fresh session to determine redirect

      window.location.href = '/dashboard'
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
