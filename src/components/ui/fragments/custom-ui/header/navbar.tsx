'use client'
import { MenuIcon } from 'lucide-react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Link, useMatches } from '@tanstack/react-router'

import React, { useEffect, useRef, useState } from 'react'

import type { VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import {
  Button,
  buttonVariants,
} from '@/components/ui/fragments/shadcn-ui/button'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/fragments/shadcn-ui/drawer'
import { cn } from '@/lib/utils'

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
  items: Array<{
    name: string
    link: string
    icon?: LucideIcon
  }>
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
  items: Array<{
    name: string
    link: string
    icon: LucideIcon
  }>
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

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === 'number') {
      const direction = current - scrollYProgress.getPrevious()!
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
      initial={
        paths == '/game'
          ? 'hidden'
          : {
              opacity: 1,
              y: -100,
            }
      }
      animate={{
        y: visiblee ? 0 : -100,
        opacity: visiblee ? 1 : 0,
      }}
      transition={{
        duration: delay ? 0.6 : 0.2,
        delay: delay ? 4 : 0,
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
    <nav
      // initial={{
      //   opacity: 1,
      //   y: 100,
      // }}
      // animate={{
      //   y: 0,
      //   opacity: 1,
      // }}
      // transition={{
      //   duration: 0.4,
      //   delay: 3.5,
      // }}
      // Use fixed positioning to stay above footer's fixed content
      className={cn(
        ' overflow-hidden bg-background sticky bottom-0 left-0 right-0 w-full z-100',
        className,
      )}
    >
      {children}
    </nav>
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
        'relative z-60    overflow-hidden  transition-all duration-300 ease-out max-w-4xl   mx-auto hidden w-full container  flex-row items-center justify-between self-start rounded-2xl  px-3 py-2 lg:flex ',
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
        'relative z-60 overflow-hidden  border-primary border-t min-h-[9svh] content-center  bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/90  flex          mx-auto lg:hidden   flex-row items-center justify-between self-start   rounded-t-2xl  w-full   ',

        className,
      )}
    >
      <div className="flex  overflow-hidden items-center w-full justify-between px-3 lg:px-15 mx-auto py-3.5">
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
  const isActiveHome = paths === '/'
  const isActiveArtikel = paths === '/artikel/'
  const isActiveGame = paths === '/game'
  return (
    <>
      <li>
        <Link
          to={'/'}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'gap-0.5  cursor-pointer    flex flex-col items-center   ',
            isActiveHome && '  bg-accent   text-primary ',
          )}
        >
          <HomeSvg
            className={cn(
              '   pl-1.5 text-accent-foreground size-full ',
              isActiveHome && 'fill-primary-foreground   text-primary',
            )}
          />

          <span
            className={cn(
              '    tracking-tightest text-xs transition-all duration-300 ease-out',
              !isActiveHome && '  text-muted-foreground ',
            )}
          >
            Beranda
          </span>
        </Link>
      </li>
      <li>
        <Link
          to={'/artikel'}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'gap-0.5  cursor-pointer justify-center     flex flex-col items-center   ',
            isActiveArtikel && '  bg-accent   text-primary ',
          )}
        >
          <BookOpen
            className={cn(
              '   pl-1 text-accent-foreground size-full ',
              isActiveArtikel && 'fill-primary-foreground   text-primary',
            )}
          />

          <span
            className={cn(
              '    tracking-tightest text-xs transition-all duration-300 ease-out',
              !isActiveArtikel && '  text-muted-foreground ',
            )}
          >
            Artikel
          </span>
        </Link>
      </li>

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
      <li>
        <Link
          to={'/game'}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'gap-0.5  cursor-pointer    overflow-visible flex flex-col items-center   ',
            isActiveGame && '  bg-accent   text-primary ',
          )}
        >
          <Game
            className={cn(
              '  pl-0.5  text-accent-foreground size-full',
              isActiveGame && 'fill-primary-foreground   text-primary',
            )}
          />

          <span
            className={cn(
              '    tracking-tightest text-xs transition-all duration-300 ease-out',
              !isActiveGame && '  text-muted-foreground ',
            )}
          >
            Game
          </span>
        </Link>
      </li>
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

import { SVGProps } from 'react'
const HomeSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-house-icon lucide-house"
    {...props}
  >
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
  </svg>
)

const Game = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-gamepad2-icon lucide-gamepad-2"
    {...props}
  >
    <path d="M6 11h4M8 9v4M15 12h.01M18 10h.01M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
  </svg>
)

const BookOpen = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-book-open-text-icon lucide-book-open-text"
    {...props}
  >
    <path d="M12 7v14M16 12h2M16 8h2M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3zM6 12h2M6 8h2" />
  </svg>
)
