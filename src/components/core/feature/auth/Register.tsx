"use client"
 
import { SignUpForm } from "../fragments/form/register-form"
import { toast } from "sonner"
import AuthLayoutTemplate from "../../layout/auth/auth-layout"
import { useRegisterForm } from "@/hooks/actions/auth/use-auth-form"
import { useNavigate } from "@tanstack/react-router"

export default function Register() {
 
    const navigate = useNavigate()
  /**
   * ✅ Call hook di parent component
   * Sekarang isPending bisa di-share ke AuthLayoutTemplate dan SignInForm
   */
  const { form, isPending, error } = useRegisterForm({
    onSuccess: async () => {
      // Your register logic here
      toast.success("Register berhasil!")
    navigate({ to: "/dashboard"})
      // Example: redirect after register
      // router.push("/dashboard")
    },
    onError: (error: Error) => {
      toast.error(error.message,)
    },
  })

  return (
    <AuthLayoutTemplate
      loading={isPending} // ✅ isPending bisa langsung dipake di sini!
      numberOfIterations={10}
      formType="register"
      className="lg:max-w-none h-lvh"
    >
      {/* ✅ Pass form state ke SignInForm */}
      <SignUpForm
        form={form}
        isPending={isPending}
        error={error}
       
      />

      
    </AuthLayoutTemplate>
  )
}

 