import { SignUpForm } from '../form/RegisterForm'
import { toast } from 'sonner'
import AuthLayoutTemplate from '../../layout/app/auth/AuthLayout'
import { useRegisterForm } from '@/hooks/actions/auth/use-auth-form'
import { useNavigate } from '@tanstack/react-router'

export default function Register() {
  const navigate = useNavigate()
  /**
   * ✅ Call hook di parent component
   * Sekarang isPending bisa di-share ke AuthLayoutTemplate dan SignInForm
   */
  const form = useRegisterForm({
    onSuccess: async () => {
      // Your register logic here
      toast.success('Register berhasil!')
      navigate({ to: '/dashboard' })
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
          className="lg:max-w-none h-lvh"
        >
          {/* ✅ Pass form state ke SignInForm */}
          <SignUpForm form={form} isPending={isSubmitting} />
        </AuthLayoutTemplate>
      )}
    </form.Subscribe>
  )
}
