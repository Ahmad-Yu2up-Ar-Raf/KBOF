import { Link } from '@tanstack/react-router'
import {
  Button,
  buttonVariants,
} from '@/components/ui/fragments/shadcn-ui/button'
import {
  BookOpen,
  BookOpenText,
  Compass,
  Gamepad,
  Gamepad2Icon,
  Play,
} from 'lucide-react'
import Floating, {
  FloatingElement,
} from '@/components/ui/fragments/custom-ui/animate-ui/paralax-floating'
import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'
import { cn } from '@/lib/utils'

const ctaImages = [
  {
    url: 'https://images.unsplash.com/photo-1560103104-4623c14a473b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    url: 'https://images.unsplash.com/photo-1680345575909-99633d4b6f46?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    url: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    url: 'https://images.unsplash.com/photo-1571738318198-fda6afce5348?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
]

function GridPattern({
  width = 30,
  height = 30,
  x = -1,
  y = -1,
  strokeDasharray = '4 2',
  className,
  ...props
}: {
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: string
  className?: string
  [key: string]: unknown
}) {
  const id = 'grid-pattern-cta'
  return (
    <svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full fill-primary/40 stroke-primary/40',
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  )
}

function GridPatternDashed() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <GridPattern
        width={35}
        height={35}
        x={-1}
        y={-1}
        strokeDasharray="4 2"
        className={cn(
          '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
        )}
      />
    </div>
  )
}

export default function CTASection() {
  return (
    <section className="container px-6  py-12 md:py-16 lg:py-20">
      <div className="relative w-fullcontainer m-auto   h-[500px] md:h-[330px] overflow-hidden rounded-3xl border border-primary/20 bg-accent px-7">
        {/* /* Grid Background */}
        <GridPatternDashed />

        {/* Floating Images */}
        <Floating sensitivity={-0.3} className="h-full">
          <FloatingElement
            depth={1}
            className="top-[-2%] md:top-[-10%] left-[0%]"
          >
            <div className="bg-white px-2 md:px-3 pb-5 md:pb-8 pt-2 md:pt-3 rotate-8 shadow-md">
              <div className="w-[clamp(90px,22vw,140px)] h-[clamp(90px,22vw,140px)] relative overflow-hidden shadow-xl  opacity-80 hover:opacity-100 transition-opacity">
                <MediaItem webViewLink={ctaImages[0].url} />
              </div>
            </div>
          </FloatingElement>

          <FloatingElement
            depth={2}
            className="bottom-[-5%] md:bottom-[-12%] right-[24%] md:right-[90%]"
          >
            <div className="bg-white px-2 md:px-3 pb-5 md:pb-8 pt-2 md:pt-3 -rotate-6 shadow-md w-fit">
              <MediaItem
                webViewLink={ctaImages[1].url}
                className="w-[clamp(80px,19vw,120px)] h-[clamp(80px,19vw,120px)] relative overflow-hidden shadow-xl opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </FloatingElement>

          <FloatingElement
            depth={1.5}
            className="left-[24%] top-[-8%] md:top-[-8%] md:left-[87%]"
          >
            <div className="bg-white px-2 md:px-3 pb-5 md:pb-8 pt-2 md:pt-3 -rotate-6 shadow-md w-fit">
              <div className="w-[clamp(90px,20vw,130px)] h-[clamp(90px,20vw,130px)]  relative overflow-hidden shadow-xl opacity-80 hover:opacity-100 transition-opacity">
                <MediaItem webViewLink={ctaImages[2].url} />
              </div>
            </div>
          </FloatingElement>

          <FloatingElement
            depth={2.5}
            className="bottom-0 md:bottom-[-30%]  right-[0%]"
          >
            <div className="bg-white px-2 md:px-3 pb-5 md:pb-8 pt-2 md:pt-3 rotate-4 shadow-md">
              <div className="w-[clamp(100px,24vw,150px)] h-[clamp(100px,24vw,150px)]  relative overflow-hidden shadow-xl  opacity-80 hover:opacity-100 transition-opacity">
                <MediaItem webViewLink={ctaImages[3].url} />
              </div>
            </div>
          </FloatingElement>
        </Floating>

        {/* CTA Content */}
        <div className="relative z-10 max-w-md  m-auto flex h-full flex-col items-center justify-center md:gap-5 gap-9   md:text-center w-full">
          <div className="flex flex-col items-center justify-center gap-3">
            <h1 className="  text-3xl md:text-4xl font-bold tracking-tight text-foreground   text-center ">
              Siap Menjelajahi Keindahan Destinasi Lokal?
            </h1>
          </div>

          <div className="flex w-full   sm:max-w-[10em] flex-col  justify-center  gap-3 sm:flex-row">
            <Link
              to="/game"
              className={cn(
                buttonVariants({ variant: 'default', size: 'sm' }),
                'rounded-full w-full text-xs  font-semibold  gap-3  hover:bg-background hover:text-accent-foreground    sm:px-8   py-6  cursor-target hover:scale-110 transition-all duration-300 ease-out md:py-4.5',
              )}
            >
              <Gamepad2Icon className=" size-4.5    md:size-3.5  " /> Mainkan
              Game{' '}
            </Link>
            <Link
              to="/artikel"
              className={cn(
                buttonVariants({ variant: 'default', size: 'sm' }),
                '  bg-background font-semibold text-accent-foreground rounded-full w-full text-xs   gap-3     sm:px-8    py-6 hover:bg-primary/90 cursor-target hover:scale-110 transition-all duration-300 ease-out hover:text-primary-foreground md:py-4.5',
              )}
            >
              <BookOpenText className="  size-4.5  md:size-3.5     " />
              Jelajahi Artikel{' '}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
