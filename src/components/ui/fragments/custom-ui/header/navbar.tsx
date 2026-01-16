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
import { LucideIcon, MenuIcon } from 'lucide-react'
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
    icon?: LucideIcon
  }[]
  visible?: boolean
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
    icon: LucideIcon
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
    if ((paths !== '/' && scrollYProgress.get() < 0.05) || paths !== '/game') {
      setVisiblee(false)
      setDelay(false)
    } else if (paths === '/' || paths !== '/game') {
      // Di homepage, selalu show navbar
      setVisiblee(true)
    }
  }, [paths, scrollYProgress])

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === 'number') {
      const direction = current! - scrollYProgress.getPrevious()!
      setDelay(false)

      if (direction < 0) {
        setVisiblee(true)
      } else {
        setVisiblee(false)
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
export const NavbarMobile = ({ children, className }: NavbarProps) => {
  return (
    <motion.nav
      initial={{
        opacity: 1,
        y: 100,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.4,
        delay: 3.5,
      }}
      // Use fixed positioning to stay above footer's fixed content
      className={cn(' sticky bottom-0 left-0 right-0 w-full z-100', className)}
    >
      {children}
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
        minWidth: '650px',
      }}
      className={cn(
        'relative z-60     transition-all duration-300 ease-out max-w-4xl   mx-auto hidden w-full container  flex-row items-center justify-between self-start rounded-2xl  px-3 py-2 lg:flex ',
        visible && '  bg-header/80  border',
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
        'absolute px-0 p-0 inset-0 pointer-events-none hidden flex-1 flex-row items-center justify-center text-xs font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex ',
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
              'relative px-4 py-2 cursor-target text-accent-foreground pointer-events-auto',
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
        'relative z-60  border-primary border-t min-h-[9svh] content-center  bg-header/95 backdrop-blur-md supports-backdrop-filter:bg-header/90  flex          mx-auto lg:hidden   flex-row items-center justify-between self-start   rounded-t-2xl  w-full   ',

        className,
      )}
    >
      <div className="flex items-center w-full justify-between px-3 lg:px-15 mx-auto py-3.5">
        <div className="flex items-center w-full">
          <ul className="flex   justify-between  w-full items-center">
            {children}
          </ul>
        </div>
      </div>
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

export const MobileNavMenu = ({ items }: MobileNavMenuProps) => {
  const matches = useMatches()
  const paths = matches[matches.length - 1]?.routeId
  return (
    <>
      {items.map((item, index) => {
        const isActive = item.link == paths
        return (
          <li key={index}>
            <Link
              to={item.link}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'gap-0.5  cursor-pointer    flex flex-col items-center   ',
                isActive && '  bg-accent   text-primary ',
              )}
            >
              <item.icon
                className={cn(
                  ' not-odd: text-accent-foreground size-5',
                  isActive && 'fill-primary-foreground   text-primary',
                )}
              />

              <span
                className={cn(
                  '    tracking-tightest text-xs transition-all duration-300 ease-out',
                  !isActive && '  text-muted-foreground ',
                )}
              >
                {item.name}
              </span>
            </Link>
          </li>
        )
      })}
    </>
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
