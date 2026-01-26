'use client'
import { Link, useMatches } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'
import type { User } from '@/db/schema'
import { NavbarLogo } from '@/components/ui/fragments/custom-ui/header/app-logo'

import { ANIMATION_DURATION } from '@/lib/game/constants'

import { authClient } from '@/lib/auth/auth-client'

import AvatarMenu from '@/components/ui/fragments/custom-ui/menu/avatar-menu'
import { useIsMobile } from '@/hooks/use-mobile'

import { cn } from '@/lib/utils'
import {
  Button,
  buttonVariants,
} from '@/components/ui/fragments/shadcn-ui/button'

function SiteNavbar() {
  const { data: session } = authClient.useSession()

  const { scrollYProgress } = useScroll()
  const [visiblee, setVisiblee] = useState(true)

  // Handle initial visibility when path changes

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === 'number') {
      const direction = current - scrollYProgress.getPrevious()!

      if (direction < 0) {
        setVisiblee(true)
      } else {
        setVisiblee(false)
      }
    }
  })

  const matches = useMatches()
  const paths = matches[matches.length - 1]?.routeId
  const isActive = paths !== '/' && paths !== '/game'
  const isActiveFixed = paths == '/destinasi/$destinasiId/' || paths == '/auth/'

  // setOpen((prevState) => !prevState)
  const isMobile = useIsMobile()
  if (isActive && isMobile)
    return (
      <nav
        className={cn(
          '  top-0  z-40  bg-transparent  rounded-b-2xl     w-full',
          isActiveFixed ? '   absolute ' : 'relative',

          paths == '/destinasi/$destinasiId/' &&
            'bg-blend-difference mix-blend-difference  ',
        )}
      >
        <header
          className={cn(
            ' top-1   md:rounded-b-none     mx-auto      md:border-b      items-center justify-start    pb-1    pt-2     flex    text-center w-full  px-5  max-w-[53rem] md:px-0 md:py-1.5 ',
          )}
        >
          <Button
            variant={'link'}
            onClick={() => window.history.back()}
            size={'icon'}
            className={cn(
              'flex w-fit   py-2 md:flex text-base items-center gap-2   group transition-colors',
              paths == '/destinasi/$destinasiId/' && 'text-accent',
            )}
          >
            <ArrowLeft className=" size-5 group-hover:-translate-x-1 group-hover:transform transition-all ease-out duration-300" />
            <span className=" md:sr-only">Kembali</span>
          </Button>
        </header>
      </nav>
    )
  if (isActive)
    return (
      <motion.nav
        animate={{
          y: visiblee ? 0 : -100,
          opacity: visiblee ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
          delay: 0,
        }}
        className={cn(
          ' top-0   z-50     w-full',
          isActiveFixed ? 'fixed  ' : '    sticky',
        )}
      >
        {/* <div className="absolute h-50 inset-0 bg-linear-to-t from-background/0 via-background/0 to-background     " /> */}

        <header
          className={cn(
            ' top-2   md:rounded-b-none     mx-auto             items-center justify-center md:justify-between   pb-3    pt-6     flex    text-center w-full  px-5  max-w-[53rem] md:px-0 md:py-1.5 ',
          )}
        >
          <div
            className={cn(
              'z-50  w-fit   bg-none  absolute  left-5.5 md:left-0   md:relative  backdrop-blur flex justify-between',
            )}
          >
            <Button
              variant={'ghost'}
              onClick={() => window.history.back()}
              size={'icon'}
              className={cn(
                'flex w-fit bg-none   py-2 md:flex text-base items-center gap-2    group transition-colors',
              )}
            >
              <ArrowLeft className=" size-5 group-hover:-translate-x-1 group-hover:transform transition-all ease-out duration-300" />
              <span className=" md:sr-only">Kembali</span>
            </Button>
          </div>

          <div className="">
            <div className=" flex items-center text-2xl justify-center   gap-3">
              <NavbarLogo />
            </div>
          </div>
          <div className=" z-50">
            <AvatarMenu user={session?.user as User} />
          </div>
        </header>
      </motion.nav>
    )
}

export default SiteNavbar
