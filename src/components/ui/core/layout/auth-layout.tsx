'use client'
import { useLottie } from 'lottie-react'
import * as React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/icons/app-logo-icon'
import animationData from '@/assets/animations/Phoenix.json'
import {
  Button,
  buttonVariants,
} from '@/components/ui/fragments/shadcn-ui/button'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import { Icons } from '@/components/icons/brand-icons'
import { authClient } from '@/lib/auth/auth-client'

type AuthLayoutProps = {
  children?: React.ReactNode
  title?: string
  description?: string
  quote?: string
  loading?: boolean
  className?: string
  numberOfIterations?: number
  formType?: 'login' | 'register'
  signInGoogleButton?: boolean
}

const AuthLayoutTemplate = ({
  formType,
  numberOfIterations,
  className,
  loading = false,
  signInGoogleButton = true,
  title = `Selamat Datang`,
  quote = `Gagasmu bukan cuma wacana — jadikan aksi.`,
  description = `Perjalanan akan segera dimulai `,
  ...props
}: AuthLayoutProps) => {
  const formTypeLabel = formType == 'register' ? 'login' : 'register'
  const formTypeLink = formType == 'register' ? 'login' : 'register'

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  const style = { width: '100%', height: '100%', margin: 'auto' } // atur sesuai kebutuhan
  const { View } = useLottie(lottieOptions, style)
  const [isPending, setIsPending] = React.useState(false)
  const loadingState = loading || isPending
  const signInGoogle = async () => {
    await authClient.signIn.social(
      {
        provider: 'google',
        callbackURL: '/dashboard',
      },
      {
        onSuccess: () => {
          setIsPending(false)
        },
        onError() {
          setIsPending(false)
        },
      },
    )
  }
  return (
    <>
      <div className=" relative  md:mt-6.5  min-h-svh container z-20   flex items-center justify-center overflow-hidden ">
        <div
          className={cn(
            '  w-full relative max-w-lg  overflow-hidden flex flex-col  lg:flex-row     lg:max-w-none h-svh',
            className,
          )}
        >
          <main
            className={cn(
              'px-8 py-0 lg:w-1/2 justify-start items-center  lg:m-auto h-full content-center relative bg-background z-100 text-secondary-foreground overflow-visible ',
            )}
          >
            <div className=" justify-center   max-w-sm flex m-auto flex-col h-full">
              <div className="flex text-center flex-col   items-left mb-4">
                <div className="  m-auto  w-50 h-42 ">{View}</div>

                <div
                  className={cn(
                    'relative sr-only  hidden lg:inline-flex mb-6 md:ml-0 m-auto',
                  )}
                >
                  <Logo className="size-12 opacity-0 transition-transform ease-in-out duration-500 dark:opacity-100" />
                </div>

                <h2 className=" text-xl lg:text-2xl mt-3 font-medium  tracking-tight">
                  {title}
                </h2>
                <p className=" line-clamp-1   opacity-80">{description}</p>
              </div>
              <React.Activity mode={signInGoogleButton ? 'visible' : 'hidden'}>
                <Button
                  onClick={signInGoogle}
                  variant="ghost"
                  type="button"
                  className="border border-input/80 cursor-pointer"
                  disabled={loadingState}
                >
                  {loadingState ? (
                    <Spinner className="mr-2 h-4 w-4  " />
                  ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                  )}{' '}
                  Google
                </Button>
                <div className="relative my-4 ">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-sm ">
                    <span className="bg-background px-2 text-muted-foreground">
                      Atau lanjutkan dengan
                    </span>
                  </div>
                </div>
              </React.Activity>
              {/* Form content area */}
              {props.children}

              <></>
              <React.Activity mode={formType ? 'visible' : 'hidden'}>
                <div className="text-center cursor-target  mt-4 text-muted-foreground text-sm">
                  {formType == 'register'
                    ? `Sudah punya akun? `
                    : 'Belum punya akun? '}
                  <Link
                    aria-disabled={loadingState}
                    tabIndex={!loadingState ? -1 : undefined}
                    to={`/${formTypeLink}`}
                    className={cn(
                      'text-secondary-foreground capitalize font-medium underline',
                      loadingState
                        ? 'pointer-events-none cursor-none text-foreground/50'
                        : '',
                    )}
                  >
                    {formTypeLabel}
                  </Link>
                </div>
              </React.Activity>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default AuthLayoutTemplate
