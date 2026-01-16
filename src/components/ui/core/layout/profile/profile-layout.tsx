'use client'

import * as React from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import {
  MapPin,
  Newspaper,
  User,
  Home,
  Settings,
  ChevronLeft,
  LogOut,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth/auth-client'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/fragments/shadcn-ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/fragments/shadcn-ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/fragments/shadcn-ui/sheet'
import { Logo } from '@/components/icons/app-logo-icon'
import { useInitials } from '@/hooks/use-initials'
import ScrollToTop from '@/components/ui/fragments/custom-ui/button/scroll-to-top-button'

interface ProfileLayoutProps {
  children: React.ReactNode
}

const navItems = [
  {
    title: 'Beranda',
    href: '/profile',
    icon: Home,
    exactMatch: true,
  },
  {
    title: 'Destinasi Saya',
    href: '/profile/destinasi',
    icon: MapPin,
    exactMatch: false,
  },
  {
    title: 'Artikel Saya',
    href: '/profile/artikel',
    icon: Newspaper,
    exactMatch: false,
  },
  {
    title: 'Pengaturan',
    href: '/profile/settings',
    icon: Settings,
    exactMatch: false,
  },
]

function ProfileNavLink({
  item,
  currentPath,
  onClick,
}: {
  item: (typeof navItems)[0]
  currentPath: string
  onClick?: () => void
}) {
  const isActive = item.exactMatch
    ? currentPath === item.href
    : currentPath.startsWith(item.href)

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted',
      )}
    >
      <item.icon className="h-4 w-4" />
      {item.title}
    </Link>
  )
}

function ProfileLayout({ children }: ProfileLayoutProps) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const getInitials = useInitials()

  const currentPath = router.state.location.pathname

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.navigate({ to: '/' })
        },
      },
    })
  }

  if (isPending || !session?.user) {
    return (
      <div className="flex h-lvh w-full items-center justify-center">
        <Spinner className="h-8 w-8 border-t-transparent rounded-xl" />
      </div>
    )
  }

  const user = session.user

  return (
    <div className="min-h-lvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          {/* Left: Logo & Back */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Kembali</span>
            </Link>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <Link to="/" className="flex items-center gap-2">
              <Logo className="h-6 w-6" />
              <span className="font-semibold hidden sm:inline">Suasana</span>
            </Link>
          </div>

          {/* Center: Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <ProfileNavLink
                key={item.href}
                item={item}
                currentPath={currentPath}
              />
            ))}
          </nav>

          {/* Right: User menu */}
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72" data-lenis-prevent>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Logo className="h-6 w-6" />
                    Profil Saya
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1">
                  {navItems.map((item) => (
                    <ProfileNavLink
                      key={item.href}
                      item={item}
                      currentPath={currentPath}
                      onClick={() => setMobileMenuOpen(false)}
                    />
                  ))}
                  <div className="my-4 h-px bg-border" />
                  <Button
                    variant="ghost"
                    className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Keluar
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name ?? 'User'}
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(user.name ?? user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name ?? 'Pengguna'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Pengaturan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-6 px-4">{children}</main>

      <ScrollToTop />
    </div>
  )
}

export default ProfileLayout
