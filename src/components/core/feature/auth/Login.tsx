"use client"
 
import { SignInForm } from "../fragments/form/login-form"
 
import { toast } from "sonner"
 
import AuthLayoutTemplate from "../../layout/auth/auth-layout"
 
import { useLoginForm } from "@/hooks/actions/auth/use-auth-form"
 
import {  useNavigate } from "@tanstack/react-router"

export  default function Login() {
 
  const navigate = useNavigate()
  /**
   * ✅ Call hook di parent component
   * Sekarang isPending bisa di-share ke AuthLayoutTemplate dan SignInForm
   */
  const { form, isPending, error } = useLoginForm({
    onSuccess: async () => {
      // Your login logic here
      toast.success("Login berhasil!")
      navigate({ to: "/dashboard"})
 
    },
    onError: (error: Error) => {
      toast.error(error.message,)
    },
  })

  return (
    <AuthLayoutTemplate
      loading={isPending} // ✅ isPending bisa langsung dipake di sini!
      numberOfIterations={10}
      formType="login"
      className="lg:max-w-none h-lvh"
    >
      {/* ✅ Pass form state ke SignInForm */}
      <SignInForm
        form={form}
        isPending={isPending}
        error={error}
       
      />

      
    </AuthLayoutTemplate>
  )
}

 