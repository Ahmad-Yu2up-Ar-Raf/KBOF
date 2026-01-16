'use client'
import { Link, useMatches } from '@tanstack/react-router'
import { NavbarLogo } from '@/components/ui/fragments/custom-ui/header/app-logo'
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavMenu,
  NavbarMobile,
} from '@/components/ui/fragments/custom-ui/header/navbar'

import { authClient } from '@/lib/auth/auth-client'
import {
  BookOpenText,
  Gamepad,
  Gamepad2,
  Home,
  MapPin,
  Medal,
  Newspaper,
  Telescope,
  UserRound,
} from 'lucide-react'
import AvatarMenu from '@/components/ui/fragments/custom-ui/menu/avatar-menu'

import { User } from '@/db/schema'
import { useIsMobile } from '@/hooks/use-mobile'

export default function SiteHeader() {
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
  const navItemsMobiles = [
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
      name: 'Profil',
      link:
        (session && session.user.role === 'admin') ||
        (session && session.user.role === 'superAdmin')
          ? '/dashboard'
          : session && session.user.role === 'pribumi'
            ? '/profile/destinasi'
            : '/login',
      icon: UserRound,
    },
  ]
  const isMobile = useIsMobile()
  const matches = useMatches()
  const paths = matches[matches.length - 1]?.routeId
  const isActive = paths == '/'

  if (isMobile) {
    return (
      <NavbarMobile>
        <MobileNav>
          <MobileNavMenu name={session?.user.name} items={navItemsMobiles} />
        </MobileNav>
      </NavbarMobile>
    )
  }

  if (isActive)
    return (
      <Navbar className="z-999">
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
