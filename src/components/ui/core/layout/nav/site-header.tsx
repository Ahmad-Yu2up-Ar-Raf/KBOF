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
  Search,
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
      icon: Search,
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
