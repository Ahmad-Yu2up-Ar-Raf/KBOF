'use client'
import { Link } from '@tanstack/react-router'
import { useLottie } from 'lottie-react'

import { Medal, Pen, Telescope } from 'lucide-react'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'

import { TextRotate } from '@/components/ui/fragments/custom-ui/animate-ui/text-rotate'
import Floating, {
  FloatingElement,
} from '@/components/ui/fragments/custom-ui/animate-ui/paralax-floating'

import { useModal } from '@/components/provider/context-provider'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import animationData from '@/assets/animations/Businessman.json'

import { BlurFade } from '@/components/ui/fragments/custom-ui/animate-ui/blur-fade'
import { Image } from '@unpic/react'
import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'

const fallbackImages = [
  'assets/images/hero/hero1.jpg',

  'assets/images/hero/hero2.jpg',

  'assets/images/hero/hero3.jpg',

  'assets/images/hero/hero4.jpg',
]

export default function HeroSection() {
  const isMobile = useIsMobile()
  const { openImage } = useModal()

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  const style = { width: isMobile ? 250 : 300, height: 150, margin: 'auto' }
  const { View } = useLottie(lottieOptions, style)

  const delay = 0.45
  return (
    <section className="w-full h-full">
      <main className="w-full m-auto mb-0.5 overflow-hidden md:mb-25 lg:mb-40 lg:pt-20 min-h-svh md:overflow-visible flex flex-col items-center justify-center relative">
        {/* Floating images - visible on all devices */}
        <Floating sensitivity={-0.5} className="h-full">
          <FloatingElement depth={1} className="top-[0%] left-[3%]">
            <BlurFade
              delay={delay}
              key={fallbackImages[0]}
              className="w-35 h-36 relative overflow-hidden sm:w-48 sm:h-36 md:w-56 md:h-44 lg:w-55 lg:h-67 object-cover hover:scale-105 duration-200 transition-transform -rotate-12 shadow-2xl rounded-xl"
              // Use will-change sparingly
              style={{ willChange: 'transform, opacity' }}
            >
              <MediaItem
                className="w-full h-full cursor-zoom-in"
                onClick={() => openImage(fallbackImages[0])}
                webViewLink={fallbackImages[0]}
              />
            </BlurFade>
          </FloatingElement>

          <FloatingElement
            depth={4}
            className="top-[85%] left-[3%] md:top-[80%] md:left-[8%]"
          >
            <BlurFade
              delay={delay * 2}
              key={fallbackImages[2]}
              className="w-40 h-40 relative overflow-hidden sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-55 lg:h-67 object-cover -rotate-[4deg] hover:scale-105 duration-200 transition-transform shadow-2xl rounded-xl"
              style={{ willChange: 'transform, opacity' }}
            >
              <MediaItem
                className="w-full h-full cursor-zoom-in"
                onClick={() => openImage(fallbackImages[1])}
                webViewLink={fallbackImages[1]}
              />
            </BlurFade>
          </FloatingElement>

          <FloatingElement
            depth={2}
            className="top-[0%] left-[68%] md:top-[2%] md:left-[89%]"
          >
            <BlurFade
              delay={delay * 3}
              key={fallbackImages[2]}
              className="w-40 rotate-12 h-36 overflow-hidden sm:w-48 sm:h-44 md:w-60 md:h-52 lg:w-55 lg:h-67 object-cover hover:scale-105 duration-200 transition-transform shadow-2xl rounded-xl"
              style={{ willChange: 'transform, opacity' }}
            >
              <MediaItem
                className="w-full h-full cursor-zoom-in"
                onClick={() => openImage(fallbackImages[2])}
                webViewLink={fallbackImages[2]}
              />
            </BlurFade>
          </FloatingElement>

          <FloatingElement
            depth={1}
            className="top-[80%] left-[70%] md:top-[68%] md:left-[85%]"
          >
            <BlurFade
              key={fallbackImages[3]}
              delay={delay * 4}
              className="w-44 overflow-hidden rotate-[4deg] h-44 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-55 lg:h-67 object-cover hover:scale-105 duration-200 transition-transform shadow-2xl rounded-xl"
              style={{ willChange: 'transform, opacity' }}
            >
              <MediaItem
                className="w-full h-full cursor-zoom-in"
                onClick={() => openImage(fallbackImages[3])}
                webViewLink={fallbackImages[3]}
              />
            </BlurFade>
          </FloatingElement>
        </Floating>

        <div className="flex md:px-8 px-5 flex-col justify-center items-center w-full max-w-2xl m-auto z-50 pointer-events-auto gap-3 md:gap-4">
          <BlurFade delay={delay * 5} direction="up" duration={1}>
            {View}
          </BlurFade>
          <BlurFade delay={delay * 6} direction="up">
            <h1 className="text-4xl sm:text-5xl leading-9 md:text-6xl text-center w-full justify-center items-center flex-col flex primary-foreground space-pre sm:leading-12 capitalize md:leading-16 font-bold tracking-tighter">
              <span className="block">Jelajahi Pesona</span>
              <span className="flex flex-row flex-wrap items-center justify-center gap-2">
                <TextRotate
                  texts={[
                    'Indonesia',
                    'Nusantara',
                    'Budaya',
                    'Alam',
                    'Lokal',
                    'Tradisi',
                    'Warisan',
                    'Negeri',
                    'Khatulistiwa',
                    'Bahari',
                    'Sejarah',
                    'Kuliner',
                    'Kesenian',
                    'Adat',
                  ]}
                  mainClassName="overflow-hidden bg-primary pr-3 text-primary-foreground py-0 pb-2 px-4 rounded-xl"
                  staggerDuration={0.03}
                  staggerFrom="last"
                  rotationInterval={2800}
                  transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 400,
                  }}
                />
              </span>
            </h1>
          </BlurFade>

          <BlurFade
            direction="up"
            delay={delay * 7}
            className="text-base md:text-lg lg:text-xl leading-6 text-balance text-muted-foreground text-center max-w-xl mx-auto"
          >
            <p>
              Temukan destinasi wisata tersembunyi dan kekayaan budaya lokal
              Indonesia
              <span className="hidden sm:inline">
                {' '}
                yang autentik dan memukau.
              </span>
            </p>
          </BlurFade>

          <BlurFade
            delay={delay * 8}
            direction="up"
            className="flex w-full flex-col md:flex-row justify-center md:space-x-4 md:space-y-0 space-y-2.5 items-center mt-2"
          >
            <Link
              className={cn(
                buttonVariants({ variant: 'custom', size: 'lg' }),
                'rounded-full',
              )}
              to="/destinasi"
            >
              <Telescope className="size-5" /> Jelajahi Destinasi
            </Link>
            <Link
              to={'/destinasi/leaderboard'}
              className={cn(
                buttonVariants({ variant: 'customForeground', size: 'lg' }),
                'rounded-full',
              )}
            >
              <Medal className="size-5" /> Destinasi Teratas
            </Link>
          </BlurFade>
        </div>
      </main>
      <Marque />
    </section>
  )
}

export function Marque() {
  return (
    <section className="relative mb-20 md:mb-26 w-full content-center">
      {/*
        Marquee background panels using a repeating songket image.
        - Uses a single background image that repeats horizontally (`repeat-x`).
        - The inner bar is made very wide so the existing translate animation
          (`animate-infinite-scroll` / `animate-infinite-scroll-rigth`) creates
          a continuous moving fabric effect without many <img> nodes.
        - Ensure the asset exists at `/assets/images/songket-repeat.jpg` (seamless tile).
      */}
      <div className="w-[120dvw] absolute top-0 -right-1 -rotate-7 md:-rotate-3 overflow-hidden">
        <div
          className="h-12 md:h-16 lg:h-20 w-[240dvw] bg-repeat-x animate-songket-scroll will-change-transform"
          style={{
            backgroundImage: "url('/assets/images/patern/songket2.jpg')",
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
            backgroundPosition: '0 50%',
            animation: 'songketScroll 25s linear infinite',
          }}
        />
      </div>

      <div className="w-[120dvw] absolute top-0 -right-1 rotate-7 md:rotate-3 overflow-hidden">
        <div
          className="h-12 md:h-16 lg:h-20 w-[240dvw] bg-repeat-x animate-songket-scroll-right will-change-transform"
          style={{
            backgroundImage: "url('/assets/images/patern/songket.jpg')",
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
            backgroundPosition: '0 50%',
            animation: 'songketScrollRight 25s linear infinite',
          }}
        />
      </div>
    </section>
  )
}
