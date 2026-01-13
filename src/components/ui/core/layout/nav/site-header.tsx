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
  BookOpen,
  BookOpenText,
  CircleStar,
  Home,
  Layers,
  MapPin,
  Medal,
  Newspaper,
  Search,
  Telescope,
  UserRound,
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
      link: '/leaderboard/',
      icon: Newspaper,
    },
  ]
  const navItemsMobiles = [
    // {
    //   name: 'Home',
    //   link: '/',
    //   icon: Layers,
    // },
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
      link: '/destinasi/leaderboard/',
      icon: Medal,
    },
    {
      name: 'Akun',
      link: session ? '/dashboard/settings/' : '/login',
      icon: UserRound,
    },
  ]

  const isMobile = useIsMobile()
  if (isMobile) {
    return (
      <NavbarMobile className="     ">
        <MobileNav>
          {/* <MobileNavHeader>
            <NavbarLogo />
            <NavItems items={navItems} />
          </MobileNavHeader> */}

          <MobileNavMenu name={session?.user.name} items={navItemsMobiles} />
        </MobileNav>
      </NavbarMobile>
    )
  }
  return (
    <Navbar className=" z-99999999">
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
              href="/dashboard"
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
