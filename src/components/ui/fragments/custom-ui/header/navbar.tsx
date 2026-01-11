'use client'
import { cn } from '@/lib/utils'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/fragments/shadcn-ui/drawer'
import { MenuIcon } from 'lucide-react'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { Link, useMatches } from '@tanstack/react-router'

import React, { useEffect, useRef, useState } from 'react'

import {
  Button,
  buttonVariants,
} from '@/components/ui/fragments/shadcn-ui/button'

import { VariantProps } from 'class-variance-authority'

interface NavbarProps {
  children: React.ReactNode
  className?: string
}

interface NavBodyProps {
  children: React.ReactNode
  className?: string
  visible?: boolean
}

interface NavItemsProps {
  items: {
    name: string
    link: string
  }[]
  className?: string
  onItemClick?: () => void
}

interface MobileNavProps {
  children: React.ReactNode
  className?: string
  visible?: boolean
}

interface MobileNavHeaderProps {
  children: React.ReactNode
  className?: string
}

interface MobileNavMenuProps {
  items: {
    name: string
    link: string
  }[]
  name?: string
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const matches = useMatches()
  const paths = matches[matches.length - 1]?.routeId
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const [visible, setVisible] = useState<boolean>(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 100) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  })

  const { scrollYProgress } = useScroll()
  const [visiblee, setVisiblee] = useState(true)
  const [delay, setDelay] = useState(true)

  // Handle initial visibility when path changes
  useEffect(() => {
    // Kalau bukan di "/" dan masih di top, hide navbar
    if (paths !== '/' && scrollYProgress.get() < 0.05) {
      setVisiblee(false)
      setDelay(false)
    } else if (paths === '/') {
      // Di homepage, selalu show navbar
      setVisiblee(true)
    }
  }, [paths, scrollYProgress])

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === 'number') {
      const direction = current! - scrollYProgress.getPrevious()!
      setDelay(false)

      if (scrollYProgress.get() < 0.05 && paths !== '/') {
        // Di halaman selain "/" dan di top, hide navbar
        setVisiblee(false)
      } else {
        if (direction < 0) {
          setVisiblee(true)
        } else {
          setVisiblee(false)
        }
      }
    }
  })

  return (
    <motion.nav
      ref={ref}
      initial={{
        opacity: 1,
        y: -100,
      }}
      animate={{
        y: visiblee ? 0 : -100,
        opacity: visiblee ? 1 : 0,
      }}
      transition={{
        duration: delay ? 0.6 : 0.2,
        delay: delay ? 2 : 0,
      }}
      className={cn(
        '         top-7.5 md:top-4.5   fixed  z-40 w-full',
        // paths != '/' && visible == false ? '   ' : ' sticky',
        className,
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.nav>
  )
}

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? 'blur(10px)' : 'none',
        boxShadow: visible
          ? '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'
          : 'none',
        width: visible ? '10%' : '100%',
        // y: visible ? 10 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 190,
        damping: 50,
      }}
      style={{
        minWidth: '750px',
      }}
      className={cn(
        'relative z-60     transition-all duration-300 ease-out   mx-auto hidden w-full max-w-4xl flex-row items-center justify-between self-start rounded-2xl  px-3 py-2 lg:flex ',
        visible && '  bg-background/80  border',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null)
  const matches = useMatches()
  const paths = matches[matches.length - 1]?.routeId
  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'absolute inset-0 hidden flex-1 flex-row items-center justify-center text-xs font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-3',
        className,
      )}
    >
      {items.map((item, idx) => {
        const isActive = item.link == paths
        return (
          <Link
            onMouseEnter={() => setHovered(idx)}
            onClick={onItemClick}
            className={cn(
              'relative px-4 py-2 cursor-target text-neutral-600 dark:text-neutral-300',
              isActive && '',
            )}
            key={`link-${idx}`}
            to={item.link}
          >
            {(hovered === idx || isActive) && (
              <motion.div
                layoutId="hovered"
                className="absolute  inset-0 h-full w-full rounded-xl bg-header"
              />
            )}
            <span className="relative text-sm  z-20">{item.name}</span>
          </Link>
        )
      })}
    </motion.div>
  )
}

export const MobileNav = ({ children, className }: MobileNavProps) => {
  return (
    <div
      style={{
        boxShadow:
          '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
      }}
      className={cn(
        'relative z-60  flex bg-background/90    backdrop-blur-md     mx-auto lg:hidden w-full  flex-row items-center justify-between self-start rounded-2xl max-w-[calc(90vw-2rem)]  px-3 py-2 ',

        className,
      )}
    >
      {children}
    </div>
  )
}

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        'flex w-full flex-row items-center justify-between',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const MobileNavMenu = ({ items, name }: MobileNavMenuProps) => {
  const [internalOpen, setInternalOpen] = useState(false)
  return (
    <Drawer open={internalOpen} onOpenChange={setInternalOpen} modal={true}>
      <div className="flex   items-center">
        <DrawerTrigger asChild>
          <Button size={'sm'} variant={'ghost'}>
            <MenuIcon />
          </Button>
        </DrawerTrigger>
      </div>
      <DrawerContent className="pb-5  px-4">
        <DrawerHeader className="   sm:px-7 space-y-1 bg-background     p-4    pb-3 justify-center items-center mb-6 ">
          <DrawerTitle>Menu</DrawerTitle>

          <DrawerDescription className=" sr-only hidden text-sm">
            Fill in the details below to create a new task
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col overflow-y-auto">
          {items.map((menu, idx) => (
            <Link
              onClick={() => setInternalOpen(false)}
              key={idx}
              to={menu.link}
              className="py-3 px-1 font-medium text-base  flex items-center"
            >
              {menu.name}
            </Link>
          ))}
        </div>
        <DrawerFooter className="   px-0 pt-3 mt-6">
          <div className="mt-2 flex flex-col gap-2">
            {name == null ? (
              <>
                <Link
                  onClick={() => setInternalOpen(false)}
                  to="/login"
                  className={buttonVariants({ variant: 'default' })}
                >
                  Masuk
                </Link>

                <Link
                  onClick={() => setInternalOpen(false)}
                  to="/register"
                  className={buttonVariants({ variant: 'outline' })}
                >
                  Daftar
                </Link>
              </>
            ) : (
              <Link
                onClick={() => setInternalOpen(false)}
                to="/dashboard"
                className={buttonVariants({ variant: 'default' })}
              >
                Dashboard
              </Link>
            )}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export const NavbarButton = ({
  href,
  children,
  className,
  variant = 'default',
  ...props
}: {
  href?: string

  children: React.ReactNode
  className?: string
} & VariantProps<typeof buttonVariants>) => {
  return (
    <Link
      to={href || '/'}
      className={cn(
        buttonVariants({ variant: variant, size: props.size }),
        'cursor-target  cursor-target text-xs z-50',
        className,
      )}
      // {...props}
    >
      {children}
    </Link>
  )
}
