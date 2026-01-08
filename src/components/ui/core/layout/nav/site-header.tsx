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
} from '@/components/ui/fragments/custom-ui/header/navbar'
import { authClient } from '@/lib/auth/auth-client'

export default function SiteHeader() {
  const navItems = [
    {
      name: 'Fitur',
      link: '/as',
    },

    {
      name: 'Inovasi',
      link: '/explore',
    },
    {
      name: 'Peringkat',
      link: '/leaderboard',
    },
    {
      name: 'Peringkat',
      link: '/leaderboard',
    },
  ]
  const { data: session } = authClient.useSession()

  return (
    <Navbar className=" z-40">
      {/* Desktop Navigation */}
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
                variant={'default'}
                className=" rounded-xl"
                href="/login"
                size={'sm'}
              >
                Masuk
              </NavbarButton>
              <NavbarButton
                size={'sm'}
                variant={'secondary'}
                className=" rounded-xl"
                href="/register"
              >
                Daftar
              </NavbarButton>
            </>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <NavItems items={navItems} />
        </MobileNavHeader>

        <MobileNavMenu name={session?.user.name} items={navItems} />
      </MobileNav>
    </Navbar>
  )
}
