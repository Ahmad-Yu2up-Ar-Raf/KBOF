'use client'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import { useLottie } from 'lottie-react'
import { motion, useReducedMotion } from 'framer-motion'

import { TextRotate } from '@/components/ui/fragments/custom-ui/animate-ui/text-rotate'
import Floating, {
  FloatingElement,
} from '@/components/ui/fragments/custom-ui/animate-ui/paralax-floating'
import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'
import { Pen, Telescope } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import animationData from '@/assets/animations/Businessman.json'
import { authClient } from '@/lib/auth/auth-client'

const fallbackImages = [
  {
    url: '/assets/images/heor1.jpg',
    link: 'https://unsplash.com/photos/a-painting-of-a-palm-leaf-on-a-multicolored-background-AaNPwrSNOFE',
    title: 'Neon Palm',
    author: 'Tim Mossholder',
  },
  {
    url: '/assets/images/hero6.jpg',
    link: 'https://unsplash.com/photos/a-blurry-photo-of-a-crowd-of-people-UgbxzloNGsc',
    author: 'ANDRII SOLOK',
    title: 'A blurry photo of a crowd of people',
  },
  {
    url: '/assets/images/hero3.jpg',
    author: 'Wesley Tingey',
    title: 'Rippling Crystal Blue Water',
  },
  {
    url: '/assets/images/hero4.jpg',
    link: 'https://unsplash.com/de/fotos/mann-im-schwarzen-hemd-unter-blauem-himmel-m8RDNiuEXro',
    author: 'Serhii Tyaglovsky',
    title: 'Mann im schwarzen Hemd unter blauem Himmel',
  },
]

export default function HeroSection() {
  const isMobile = useIsMobile()
  const shouldReduceMotion = useReducedMotion()

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
  const { data: session } = authClient.useSession()

  // Optimized animation configs
  const transition = {
    duration: shouldReduceMotion ? 0 : 0.6,
    ease: [0.25, 0.1, 0.25, 1] as const,
  }

  const variants = {
    hidden: {
      filter: shouldReduceMotion ? 'blur(0px)' : 'blur(10px)',
      transform: shouldReduceMotion ? 'translateY(0)' : 'translateY(20%)',
      opacity: 0,
    },
    visible: {
      filter: 'blur(0)',
      transform: 'translateY(0)',
      opacity: 1,
    },
  }

  // Individual delays for stagger effect
  const getDelay = (index: number) => {
    if (shouldReduceMotion) return 0
    return index * 0.1
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }} // Load earlier, only once
      transition={{ staggerChildren: shouldReduceMotion ? 0 : 0.08 }}
      className="w-full h-full"
    >
      <main className="w-full m-auto mb-0.5 overflow-hidden md:mb-25 lg:mb-40 lg:pt-20 min-h-lvh md:overflow-visible flex flex-col items-center justify-center relative">
        {/* Disable floating animations on mobile for performance */}
        {!isMobile && (
          <Floating sensitivity={-0.5} className="h-full">
            <FloatingElement depth={1} className="top-[0%] left-[3%]">
              <motion.div
                transition={{ ...transition, delay: getDelay(0) }}
                variants={variants}
                key={fallbackImages[0].url}
                className="w-35 h-36 relative overflow-hidden sm:w-48 sm:h-36 md:w-56 md:h-44 lg:w-55 lg:h-67 object-cover hover:scale-105 duration-200 cursor-target transition-transform -rotate-12 shadow-2xl rounded-xl"
                // Use will-change sparingly
                style={{ willChange: 'transform, opacity' }}
              >
                <MediaItem webViewLink={fallbackImages[0].url} />
              </motion.div>
            </FloatingElement>

            <FloatingElement
              depth={4}
              className="top-[90%] left-[6%] md:top-[80%] md:left-[8%]"
            >
              <motion.div
                transition={{ ...transition, delay: getDelay(1) }}
                variants={variants}
                key={fallbackImages[1].url}
                className="w-40 h-40 relative overflow-hidden sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-55 lg:h-67 object-cover -rotate-[4deg] hover:scale-105 duration-200 cursor-target transition-transform shadow-2xl rounded-xl"
                style={{ willChange: 'transform, opacity' }}
              >
                <MediaItem webViewLink={fallbackImages[1].url} />
              </motion.div>
            </FloatingElement>

            <FloatingElement
              depth={2}
              className="top-[0%] left-[87%] md:top-[2%] md:left-[89%]"
            >
              <motion.div
                transition={{ ...transition, delay: getDelay(2) }}
                variants={variants}
                key={fallbackImages[2].url}
                className="w-40 rotate-12 h-36 overflow-hidden sm:w-48 sm:h-44 md:w-60 md:h-52 lg:w-55 lg:h-67 object-cover hover:scale-105 duration-200 cursor-target transition-transform shadow-2xl rounded-xl"
                style={{ willChange: 'transform, opacity' }}
              >
                <MediaItem webViewLink={fallbackImages[2].url} />
              </motion.div>
            </FloatingElement>

            <FloatingElement
              depth={1}
              className="top-[78%] left-[83%] md:top-[68%] md:left-[85%]"
            >
              <motion.div
                transition={{ ...transition, delay: getDelay(3) }}
                variants={variants}
                key={fallbackImages[3].url}
                className="w-44 overflow-hidden rotate-[4deg] h-44 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-55 lg:h-67 object-cover hover:scale-105 duration-200 cursor-target transition-transform shadow-2xl rounded-xl"
                style={{ willChange: 'transform, opacity' }}
              >
                <MediaItem webViewLink={fallbackImages[3].url} />
              </motion.div>
            </FloatingElement>
          </Floating>
        )}

        <div className="flex md:px-8 px-5 flex-col justify-center items-center w-full max-w-2xl m-auto z-50 pointer-events-auto gap-3 md:gap-4">
          <motion.div
            transition={{ ...transition, delay: getDelay(4) }}
            variants={variants}
          >
            {View}
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl leading-9 md:text-6xl text-center w-full justify-center items-center flex-col flex primary-foreground space-pre sm:leading-12 capitalize md:leading-16 font-bold tracking-tighter"
            transition={{ ...transition, delay: getDelay(5) }}
            variants={variants}
          >
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
          </motion.h1>

          <div className="text-base md:text-lg lg:text-xl leading-6 text-balance text-muted-foreground text-center max-w-xl mx-auto">
            <motion.p
              transition={{ ...transition, delay: getDelay(6) }}
              variants={variants}
            >
              Temukan destinasi wisata tersembunyi dan kekayaan budaya lokal
              Indonesia
              <span className="hidden sm:inline">
                {' '}
                yang autentik dan memukau.
              </span>
            </motion.p>
          </div>

          <motion.div
            transition={{ ...transition, delay: getDelay(7) }}
            variants={variants}
            className="flex w-full flex-col md:flex-row justify-center md:space-x-4 md:space-y-0 space-y-2.5 items-center mt-2"
          >
            <Link
              className={cn(
                buttonVariants({ variant: 'default', size: 'lg' }),
                'md:has-[>svg]:px-13 cursor-target hover:scale-110 transition-all duration-300 ease-out w-full md:w-fit has-[>svg]:px-8 rounded-full font-semibold md:text-xl hover:bg-foreground px-70 md:gap-6 md:py-7 md:px-13 py-6',
              )}
              to="/destinasi"
            >
              <Telescope className="size-5" /> Jelajahi Destinasi
            </Link>
            <Link
              to={
                (session && session.user.role === 'admin') ||
                (session && session.user.role === 'superAdmin')
                  ? '/dashboard'
                  : session && session.user.role === 'pribumi'
                    ? '/profile/destinasi'
                    : '/login'
              }
              className={cn(
                buttonVariants({ variant: 'default', size: 'lg' }),
                'cursor-target hover:scale-110 transition-all duration-300 ease-out md:has-[>svg]:px-13 w-full md:w-fit font-semibold has-[>svg]:px-8 rounded-full md:text-xl md:gap-6 md:py-7 py-6 bg-foreground',
              )}
            >
              <Pen className="size-5" /> Bagikan Destinasi
            </Link>
          </motion.div>
        </div>
      </main>
      <Marque />
    </motion.section>
  )
}

export function Marque() {
  return (
    <section className="relative mb-20 md:mb-26 w-full content-center">
      <div className="w-[120dvw] absolute top-0 right-0 -rotate-7 md:-rotate-3 bg-secondary text-primary text-xl py-2 inline-flex flex-nowrap overflow-hidden">
        {Array.from({ length: 2 }, (_, i: number) => (
          <ul
            key={i.toString()}
            className="flex items-center justify-center md:justify-start [&_li]:mx-3.5 [&_img]:max-w-none animate-infinite-scroll"
          >
            {Array.from({ length: 8 }, (_, j: number) => {
              const contentType: number = j % 4
              return (
                <li key={j.toString()} className="w-full">
                  {contentType === 0 ? (
                    <h6 className="text-xl lg:text-[2dvw] uppercase tracking-[-0.05em] font-bold flex items-center gap-x-4">
                      WISATA <span>ALAM</span>
                    </h6>
                  ) : (
                    <h6 className="text-xl lg:text-[2dvw] uppercase tracking-[-0.05em] font-bold flex items-center gap-x-4">
                      BUDAYA<span>LOKAL</span>
                    </h6>
                  )}
                </li>
              )
            })}
          </ul>
        ))}
      </div>
      <div className="w-[120dvw] absolute top-0 right-0 rotate-7 md:rotate-3 bg-primary text-primary-foreground text-5xl py-2 inline-flex flex-nowrap overflow-hidden">
        {Array.from({ length: 2 }, (_, i: number) => (
          <ul
            key={i.toString()}
            className="flex items-center justify-center md:justify-start [&_li]:mx-3.5 [&_img]:max-w-none animate-infinite-scroll-rigth"
          >
            {Array.from({ length: 8 }, (_, j: number) => {
              const contentType: number = j % 4
              return (
                <li key={j.toString()} className="w-full">
                  {contentType === 0 ? (
                    <h6 className="text-xl lg:text-[2dvw] uppercase tracking-[-0.05em] font-bold flex items-center gap-x-4">
                      HIDDEN <span>GEMS</span>
                    </h6>
                  ) : (
                    <h6 className="text-xl lg:text-[2dvw] uppercase tracking-[-0.05em] font-bold flex items-center gap-x-4">
                      SENI<span>TRADISI</span>
                    </h6>
                  )}
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </section>
  )
}
