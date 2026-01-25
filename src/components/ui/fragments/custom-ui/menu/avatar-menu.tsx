import {
  Gamepad2,
  LayoutDashboard,
  LogIn,
  LogOut,
  MapPinPen,
  Medal,
  Newspaper,
  SettingsIcon,
  SquarePen,
  Search,
  BookOpenText,
  UserRoundIcon,
  UsersRound,
} from 'lucide-react'
import { Link, useNavigate, useMatches } from '@tanstack/react-router'
import React from 'react'
import { toast } from 'sonner'
import { Spinner } from '../../shadcn-ui/spinner'
import { ButtonAnimation } from './navigation-menu-sidebar'
import type { LucideIcon } from 'lucide-react'
import type { User } from '@/db/schema'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/fragments/shadcn-ui/avatar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/fragments/shadcn-ui/dropdown-menu'
import { useInitials } from '@/hooks/use-initials'

import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth/auth-client'
import { useIsMobile } from '@/hooks/use-mobile'

interface DropdownMenuUserMenuDemoProps {
  label: string
  icon: LucideIcon
  auth?: boolean
  href?: string
  role?: Array<string>
  onSelect?: () => void
}

interface groupItems {
  name: string
  default?: boolean

  isMobile?: boolean
  dataGroup?: Array<DropdownMenuUserMenuDemoProps>
}
type componentProps = {
  user?: User | null
  /** When true, hides page-user menu (since nav items are visible) and shows simple image for guests */
  isHomePage?: boolean
}

const listItemsRole: Array<groupItems> = [
  {
    name: 'page-user',
    isMobile: false, // Hide on mobile (mobile has bottom nav), show on desktop for guests
    dataGroup: [
      {
        label: 'Destinasi',
        icon: Search,
        href: `/destinasi/`,
        // No role = accessible by everyone including guests
      },
      {
        label: 'Artikel',
        icon: BookOpenText,
        href: `/artikel/`,
      },
      {
        label: 'Peringkat',
        icon: Medal,
        href: `/destinasi/leaderboard`,
      },
      {
        label: 'Game',
        icon: Gamepad2,
        href: `/game`,
      },
    ],
  },

  {
    name: 'guest',

    dataGroup: [
      {
        label: 'login',
        icon: LogIn,
        href: `/auth`,
      },
    ],
  },
  {
    name: 'Menagement',

    dataGroup: [
      {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: `/dashboard`,
        role: ['admin', 'superAdmin'],
      },
      {
        label: 'Kelola Destinasi  ',
        icon: MapPinPen,
        href: `/dashboard/destination`,
        role: ['admin', 'superAdmin'],
      },
      {
        label: 'Kelola Artikel  ',
        icon: SquarePen,
        href: `/dashboard/articles`,
        role: ['admin', 'superAdmin'],
      },
      {
        label: 'Kelola Users  ',
        icon: UsersRound,
        role: ['superAdmin'],
        href: `/dashboard/user-menagement`,
      },
    ],
  },
  {
    name: 'profile-admin',

    dataGroup: [
      // {
      //   label: 'Profile',
      //   icon: UserRoundIcon,
      //   href: `/dashboard/settings`,
      //   role: ['admin', 'superAdmin'],
      // },
      {
        label: 'Settings',
        icon: SettingsIcon,
        href: `/dashboard/settings`,
        role: ['admin', 'superAdmin'],
      },
    ],
  },
]

function AvatarMenu({ user, isHomePage = false }: componentProps) {
  const navigate = useNavigate()

  const [isPending, setIsPending] = React.useState(false)

  const logoutUser = async () => {
    toast.loading('Logout account...', { id: 'logout-account' })
    setIsPending(true)

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsPending(false)
          toast.success('Account logout successfully.', {
            id: 'logout-account',
          })
          navigate({ to: '/auth' })
        },
        onError(context) {
          setIsPending(false)
          toast.error(`Error logout account: ${context.error.message}`, {
            id: 'logout-account',
          })
        },
      },
    })
  }
  const useInitial = useInitials()
  const isMobile = useIsMobile()

  // Filter groups based on device, user role, and homepage context
  const getVisibleGroups = () => {
    return listItemsRole.filter((group) => {
      if (group.isMobile === false && isMobile) return false
      if (group.isMobile === true && !isMobile) return false

      // On homepage, hide page-user since nav items are already visible
      if (isHomePage && group.name === 'page-user') return false

      // For logged-in user
      if (user) {
        // Skip guest group
        if (group.name === 'guest') return false

        // Check if user has access to any item in the group
        const hasAccess =
          group.dataGroup &&
          group.dataGroup.some((item) =>
            item.role ? item.role.includes(user.role) : true,
          )
        return hasAccess
      }

      // For guest (no user)
      return group.name === 'guest' || group.name === 'page-user'
    })
  }
  const matches = useMatches()
  const paths = matches[matches.length - 1]?.routeId

  if (user)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {isMobile ? (
            <Avatar className="cursor-pointer">
              <AvatarImage src={`${user.image}`} alt={`${user.email}`} />
              <AvatarFallback>{useInitial(user.name)}</AvatarFallback>
            </Avatar>
          ) : (
            <ButtonAnimation />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-56"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={`${user.image}`} alt={`${user.email}`} />
              <AvatarFallback className="text-xs">
                {useInitial(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col">
              <span className="text-popover-foreground">{user.name}</span>
              <span className="text-muted-foreground text-xs">
                {user.email}
              </span>
            </div>
          </DropdownMenuLabel>

          {getVisibleGroups().map((group, i) => (
            <React.Fragment key={i}>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {group.dataGroup
                  ?.filter((item) =>
                    item.role ? item.role.includes(user.role) : true,
                  )
                  .map((item, i) => {
                    const isActive = item.href == paths
                    return (
                      <DropdownMenuItem key={i} asChild>
                        <Link
                          to={item.href || '#'}
                          className={cn(
                            'flex cursor-pointer items-center gap-3 w-full',
                            isActive && '  bg-accent   text-primary ',
                          )}
                        >
                          <item.icon
                            className={cn(
                              'h-4 w-4',
                              isActive && '  fill-background  text-primary',
                            )}
                          />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
              </DropdownMenuGroup>
            </React.Fragment>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={'cursor-pointer'}
            disabled={isPending}
            onSelect={logoutUser}
          >
            {isPending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            {isPending ? 'Keluar...' : 'Keluar'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

  // Guest on mobile OR guest on homepage - show image link to login
  if (!user && (isMobile || isHomePage))
    return (
      <Link to="/auth">
        <Avatar className="cursor-pointer">
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
      </Link>
    )

  // Guest on desktop (not homepage) - show dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ButtonAnimation />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-40"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="sr-only">Menu</DropdownMenuLabel>

        {getVisibleGroups().map((group, index) => (
          <React.Fragment key={group.name}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuGroup>
              {group.dataGroup?.map((item, i) => (
                <DropdownMenuItem key={i} asChild>
                  <Link
                    to={item.href || '#'}
                    className="flex cursor-pointer items-center gap-3 w-full"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AvatarMenu
