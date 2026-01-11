'use client'
import { Link } from '@tanstack/react-router'
import { useLottie } from 'lottie-react'
import { LayoutGroup, motion } from 'framer-motion'
import { TextRotate } from '@/components/ui/fragments/custom-ui/animate-ui/text-rotate'
import Floating, {
  FloatingElement,
} from '@/components/ui/fragments/custom-ui/animate-ui/paralax-floating'
import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'
import { BlurFade } from '@/components/ui/fragments/custom-ui/animate-ui/blur-fade'
import { Pen, Telescope } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import animationData from '@/assets/animations/Businessman.json'
import { authClient } from '@/lib/auth/auth-client'

const exampleImages = [
  {
    url: 'https://images.pexels.com/photos/7869139/pexels-photo-7869139.jpeg',
    author: 'Branislav Rodman',
    title: 'A Black and White Photo of a Woman Brushing Her Teeth',
  },
  {
    url: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg',
    link: 'https://unsplash.com/photos/a-painting-of-a-palm-leaf-on-a-multicolored-background-AaNPwrSNOFE',
    title: 'Neon Palm',
    author: 'Tim Mossholder',
  },
  {
    url: 'https://images.pexels.com/photos/26767345/pexels-photo-26767345.jpeg?_gl=1*1h7y1yx*_ga*MTM4OTcyNDc4NS4xNzYxMzUxNzQ0*_ga_8JE65Q40S6*czE3NjEzNjExMjEkbzMkZzEkdDE3NjEzNjExNDMkajM4JGwwJGgw',
    link: 'https://unsplash.com/photos/a-blurry-photo-of-a-crowd-of-people-UgbxzloNGsc',
    author: 'ANDRII SOLOK',
    title: 'A blurry photo of a crowd of people',
  },
  {
    url: 'https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg',
    author: 'Wesley Tingey',
    title: 'Rippling Crystal Blue Water',
  },
  {
    url: 'https://images.pexels.com/photos/3831136/pexels-photo-3831136.jpeg',
    link: 'https://unsplash.com/de/fotos/mann-im-schwarzen-hemd-unter-blauem-himmel-m8RDNiuEXro',
    author: 'Serhii Tyaglovsky',
    title: 'Mann im schwarzen Hemd unter blauem Himmel',
  },
  {
    url: 'https://images.unsplash.com/photo-1689553079282-45df1b35741b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: 'https://unsplash.com/photos/a-woman-with-a-flower-crown-on-her-head-0S3muIttbsY',
    author: 'Vladimir Yelizarov',
    title: 'A women with a flower crown on her head',
  },
  {
    url: 'https://images.unsplash.com/photo-1721968317938-cf8c60fccd1a?q=80&w=2728&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'A blurry photo of white flowers in a field',
    author: 'Eugene Golovesov',
    link: 'https://unsplash.com/photos/a-blurry-photo-of-white-flowers-in-a-field-6qbx0lzGPyc',
  },
  {
    url: 'https://images.unsplash.com/photo-1677338354108-223e807fb1bd?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    author: 'Mathilde Langevin',
    link: 'https://unsplash.com/photos/a-table-topped-with-two-wine-glasses-and-plates-Ig0gRAHspV0',
    title: 'A table topped with two wine glasses and plates',
  },
]

export default function HeroSection() {
  // parameter animasi masuk di BlurFade (seconds)

  const isMobile = useIsMobile()
  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  const style = { width: isMobile ? 250 : 300, height: 150, margin: 'auto' } // atur sesuai kebutuhan
  const { View } = useLottie(lottieOptions, style)
  const delay = 0.45
  const { data: session } = authClient.useSession()

  return (
    <section className="w-full   h-full">
      <main className="w-full m-auto mb-0.5   overflow-hidden md:mb-25 lg:mb-40  lg:pt-20 min-h-lvh md:overflow-visible flex flex-col items-center justify-center relative">
        <Floating sensitivity={-0.5} className="h-full">
          <FloatingElement depth={1} className="top-[0%] left-[3%]">
            <BlurFade
              isPreload
              delay={delay}
              key={exampleImages[1].url}
              className="w-35 h-36 relative overflow-hidden sm:w-48 sm:h-36 md:w-56 md:h-44 lg:w-55 lg:h-67 object-cover hover:scale-105 duration-200 cursor-target transition-transform -rotate-12 shadow-2xl rounded-xl"
            >
              <MediaItem webViewLink={exampleImages[1].url} />
            </BlurFade>
          </FloatingElement>

          <FloatingElement
            depth={4}
            className="top-[90%] left-[6%] md:top-[80%] md:left-[8%]"
          >
            <BlurFade
              isPreload
              delay={delay * 2}
              key={exampleImages[2].url}
              className="w-40 h-40 relative overflow-hidden sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-55 lg:h-67 object-cover -rotate-[4deg] hover:scale-105 duration-200 cursor-target transition-transform shadow-2xl rounded-xl"
            >
              <MediaItem webViewLink={exampleImages[2].url} />
            </BlurFade>
          </FloatingElement>

          <FloatingElement
            depth={2}
            className="top-[0%] left-[87%] md:top-[2%] md:left-[89%]"
          >
            <BlurFade
              isPreload
              delay={delay * 3}
              key={exampleImages[3].url}
              className="w-40 rotate-12 h-36 overflow-hidden sm:w-48 sm:h-44 md:w-60 md:h-52 lg:w-55 lg:h-67 object-cover hover:scale-105 duration-200 cursor-target transition-transform shadow-2xl  rounded-xl"
            >
              <MediaItem webViewLink={exampleImages[3].url} />
            </BlurFade>
          </FloatingElement>

          <FloatingElement
            depth={1}
            className="top-[78%] left-[83%] md:top-[68%] md:left-[85%]"
          >
            <BlurFade
              isPreload
              key={exampleImages[4].url}
              delay={delay * 4}
              className="w-44 overflow-hidden rotate-[4deg] h-44 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-55 lg:h-67 o object-cover hover:scale-105 duration-200 cursor-target transition-transform shadow-2xl  rounded-xl"
            >
              <MediaItem webViewLink={exampleImages[4].url} />
            </BlurFade>
          </FloatingElement>
        </Floating>

        <div className="flex md:px-2 px-10 flex-col justify-center items-center w-full max-w-xl m-auto z-50 pointer-events-auto gap-7">
          <div className=" space-y-4">
            <BlurFade isPreload delay={delay * 5} direction="up" duration={1}>
              {View}
            </BlurFade>

            <BlurFade isPreload delay={delay * 6} direction="up">
              <motion.h1
                className="text-3xl sm:text-5xl  md:text-7xl  text-center w-full justify-center items-center flex-col flex whitespace-pre sm:leading-12  md:leading-16  lg:leading-20 font-bold tracking-tighter"
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, ease: 'easeOut', delay: 0.3 }}
              >
                <span>Jelajahi Pesona</span>
                <LayoutGroup>
                  <motion.span layout className="flex whitespace-pre">
                    <motion.span
                      layout
                      className="flex whitespace-pre"
                      transition={{
                        type: 'spring',
                        damping: 30,
                        stiffness: 400,
                      }}
                    >
                      {' '}
                    </motion.span>

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
                  </motion.span>
                </LayoutGroup>
              </motion.h1>
            </BlurFade>

            <BlurFade
              isPreload
              direction="up"
              delay={delay * 7}
              className=" text-base md:text-lg lg:text-2xl  leading-7  text-balance text-muted-foreground   text-center "
            >
              <p>
                Temukan destinasi wisata tersembunyi dan kekayaan budaya lokal
                Indonesia yang autentik dan memukau.
              </p>
            </BlurFade>
          </div>

          <BlurFade
            isPreload
            delay={delay * 8}
            direction="up"
            className="flex w-full flex-col md:flex-row justify-center md:space-x-4  md:space-y-0 space-y-2.5 items-center "
          >
            <Link
              className={cn(
                ' cursor-target  hover:scale-110 transition-all duration-300 ease-out  lg:text-xl md:text-lg w-full  justify-center flex items-center  gap-5   font-semibold tracking-tight text-background bg-foreground px-4 py-3.5 sm:px-5  md:px-6 md:py-4 lg:px-8 rounded-full z-20 shadow-2xl  ',
              )}
              to="/explore"
            >
              <Telescope className=" size-4.5 sm:size-5.5" /> Jelajahi Destinasi
            </Link>
            <Link
              to={session ? '/dashboard' : '/login'}
              className={cn(
                'md:text-lg  cursor-target   hover:scale-110 transition-all duration-300 ease-out  lg:text-xl justify-center flex items-center py-3.5   gap-5 w-full font-semibold tracking-tight text-white bg-primary px-4  sm:px-5  md:px-6 md:py-4 lg:px-8  rounded-full z-20 shadow-2xl font-calendas',
              )}
            >
              <Pen className=" size-4.5 sm:size-5.5" /> Bagikan Destinasi
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
    <section className="relative     mb-20  md:mb-26 w-full content-center">
      <div className="w-[120dvw] absolute top-0    right-0   -rotate-7  md:-rotate-3 bg-secondary text-primary text-xl py-2  inline-flex flex-nowrap overflow-hidden ">
        {Array.from({ length: 2 }, (_, i: number) => (
          <ul
            key={i.toString()}
            className="flex items-center justify-center md:justify-start  [&_li]:mx-3.5 [&_img]:max-w-none animate-infinite-scroll"
          >
            {Array.from({ length: 8 }, (_, j: number) => {
              const contentType: number = j % 4

              return (
                <li key={j.toString()} className=" w-full  ">
                  {contentType === 0 ? (
                    <h6 className="text-xl lg:text-[2dvw]   uppercase  tracking-[-0.05em] font-bold flex items-center gap-x-4">
                      WISATA <span> ALAM</span>
                    </h6>
                  ) : (
                    <h6 className="text-xl  lg:text-[2dvw]   uppercase tracking-[-0.05em] font-bold flex items-center gap-x-4">
                      BUDAYA<span> LOKAL</span>
                    </h6>
                  )}
                </li>
              )
            })}
          </ul>
        ))}
      </div>
      <div className="w-[120dvw] absolute top-0 right-0  rotate-7  md:rotate-3 bg-primary text-primary-foreground text-5xl py-2  inline-flex flex-nowrap overflow-hidden ">
        {Array.from({ length: 2 }, (_, i: number) => (
          <ul
            key={i.toString()}
            className="flex items-center justify-center md:justify-start  [&_li]:mx-3.5 [&_img]:max-w-none animate-infinite-scroll-rigth"
          >
            {Array.from({ length: 8 }, (_, j: number) => {
              const contentType: number = j % 4

              return (
                <li key={j.toString()} className=" w-full  ">
                  {contentType === 0 ? (
                    <h6 className="text-xl lg:text-[2dvw]   uppercase  tracking-[-0.05em] font-bold flex items-center gap-x-4">
                      HIDDEN <span> GEMS</span>
                    </h6>
                  ) : (
                    <h6 className="text-xl  lg:text-[2dvw]   uppercase tracking-[-0.05em] font-bold flex items-center gap-x-4">
                      SENI<span> TRADISI</span>
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
