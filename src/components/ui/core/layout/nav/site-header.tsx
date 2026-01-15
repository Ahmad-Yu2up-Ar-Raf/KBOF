'use client'
import { NavbarLogo } from '@/components/ui/fragments/custom-ui/header/app-logo'
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavMenu,
  NavbarMobile,
} from '@/components/ui/fragments/custom-ui/header/navbar'
import { useIsMobile } from '@/hooks/use-mobile'
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
} from 'lucide-react'

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
      name: 'Beranda',
      link: '/',
      icon: Home,
    },
    {
      name: 'Artikel',
      link: '/artikel/',
      icon: BookOpenText,
    },
    {
      name: 'Game',
      link: '/game',
      icon: Gamepad2,
    },
    {
      name: 'Destinasi',
      link: '/destinasi/',
      icon: Telescope,
    },
    {
      name: 'Peringkat',
      link: '/destinasi/leaderboard/',
      icon: Medal,
    },
  ]

  const isMobile = useIsMobile()
  if (isMobile) {
    return (
      <NavbarMobile className="     ">
        <MobileNav>
          <MobileNavMenu name={session?.user.name} items={navItemsMobiles} />
        </MobileNav>
      </NavbarMobile>
    )
  }
  return (
    <Navbar className=" z-999">
      {/* Desktop Navigaion */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-2">
          {session ? (
            <NavbarButton
              variant={'default'}
              size={'sm'}
              className=" rounded-xl"
              href={
                (session && session.user.role === 'admin') ||
                (session && session.user.role === 'superAdmin')
                  ? '/dashboard'
                  : session && session.user.role === 'pribumi'
                    ? '/profile/destinasi'
                    : '/login'
              }
            >
              Dashboard
            </NavbarButton>
          ) : (
            <>
              <NavbarButton
                size={'sm'}
                variant={'secondary'}
                className=" rounded-xl"
                href="/register"
              >
                Daftar
              </NavbarButton>
              <NavbarButton
                variant={'default'}
                className=" rounded-xl"
                href="/login"
                size={'sm'}
              >
                Masuk
              </NavbarButton>
            </>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
    </Navbar>
  )
}
