'use client'
import { Link, useMatches } from '@tanstack/react-router'
import {
  BookOpenText,
  Gamepad,
  Gamepad2,
  Home,
  House,
  MapPin,
  Medal,
  Newspaper,
  Telescope,
  UserRound,
} from 'lucide-react'
import type { User } from '@/db/schema'
import { NavbarLogo } from '@/components/ui/fragments/custom-ui/header/app-logo'
import {
  MobileNav,
  MobileNavMenu,
  NavBody,
  NavItems,
  Navbar,
  NavbarMobile,
} from '@/components/ui/fragments/custom-ui/header/navbar'

import { authClient } from '@/lib/auth/auth-client'
import AvatarMenu from '@/components/ui/fragments/custom-ui/menu/avatar-menu'

import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

export function SiteHeader({ className }: { className?: string }) {
  const { data: session } = authClient.useSession()
  const navItems = [
    {
      name: 'Artikel',
      link: '/artikel/',
      icon: Newspaper,
    },

    {
      name: 'Destinasi',
      link: '/destinasi/',
      icon: MapPin,
    },
    {
      name: 'Peringkat',
      link: '/destinasi/leaderboard/',
    },
    {
      name: 'Game',
      link: '/game',
      icon: Gamepad,
    },
  ]

  const isMobile = useIsMobile()
  const matches = useMatches()
  const paths = matches[matches.length - 1]?.routeId
  const isActive = paths == '/game' || paths == '/'

  if (isActive && !isMobile)
    return (
      <Navbar className={cn('z-999', className)}>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <AvatarMenu user={session?.user as User} isHomePage />
        </NavBody>
      </Navbar>
    )

  return null
}

export function SiteHeaderMobile() {
  const { data: session } = authClient.useSession()

  const navItemsMobiles = [
    {
      name: 'Beranda',
      link: '/',
      icon: House,
    },
    {
      name: 'Artikel',
      link: '/artikel/',
      icon: BookOpenText,
    },
    {
      name: 'Destinasi',
      link: '/destinasi/',
      icon: Telescope,
    },

    {
      name: 'Peringkat',
      link: '/destinasi/leaderboard',
      icon: Medal,
    },
    {
      name: 'Game',
      link: '/game',
      icon: Gamepad2,
    },
    {
      name: 'Akun',
      link: session && session.user.role === 'admin' ? '/dashboard' : '/login',
      icon: UserRound,
    },
  ]
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <NavbarMobile>
        <MobileNav>
          <MobileNavMenu name={session?.user.name} items={navItemsMobiles} />
        </MobileNav>
      </NavbarMobile>
    )
  }
}


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