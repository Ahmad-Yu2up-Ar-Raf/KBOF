import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import { ArrowLeft } from 'lucide-react'
import { useLottie } from 'lottie-react'
import animationData from '@/assets/animations/404.json'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card'

export function NotFoundPage() {
  const lottieOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  const style = { width: '100%', height: '100%', margin: 'auto' } // atur sesuai kebutuhan
  const { View } = useLottie(lottieOptions, style)
  return (
    <section className="container   h-svh flex flex-col items-center justify-center  ">
      <Card className=" mx-auto bg-background border-0 shadow-none w-full">
        <CardContent className=" w-full   h-full flex flex-col gap-6    justify-center">
          <CardHeader className=" max-w-sm md:max-w-lg w-full m-auto     px-6 py-0 text-center md:gap-9">
            <div className="  m-auto  sm:w-80 w-[70dvw] h-42 ">{View}</div>
            <div className=" md:space-y-2">
              <CardTitle className="text-2xl  md:text-3xl  lg:text-4xl  tracking-tighter ">
                Sepertinya kamu tersesat
              </CardTitle>
              <CardDescription className=" text-base lg:text-lg text-muted-foreground ">
                Halaman yang Anda cari tidak tersedia!
              </CardDescription>
            </div>
          </CardHeader>
          <CardFooter>
            <CardAction className=" w-full flex h-full  max-w-xs m-auto  justify-center ">
              <Link
                to={'/'}
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  ' mx-auto w-full text-sm',
                )}
              >
                <ArrowLeft />
                Kembali ke beranda
              </Link>
            </CardAction>
          </CardFooter>
        </CardContent>
      </Card>
    </section>
  )
}
