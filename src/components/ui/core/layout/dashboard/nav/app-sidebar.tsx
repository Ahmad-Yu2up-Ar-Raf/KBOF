'use client'

import * as React from 'react'
import {
  BookOpenText,
  Gamepad2,
  Home,
  LayoutDashboardIcon,
  LifeBuoy,
  MapPin,
  Medal,
  Newspaper,
  Send,
  Telescope,
  Users,
  UsersRound,
} from 'lucide-react'

import { NavMain } from './nav-main'
import { NavUser } from './nav-user'

import { NavSecondary } from './nav-secondary'
import SidebarHeaderLogo from './app-sidebar-header'
import { NavProjects } from './nav-project'
import type { User, UserRoleType } from '@/db/schema'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/fragments/shadcn-ui/sidebar'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const number = '628999069933'
  const massage = 'Hi Yusuf, I want to discuss a project with you!'
  const link = `https://api.whatsapp.com/send?phone=${number}&text=${massage}&type=phone_number&app_absent=0`

  const isSuperAdmin = user.role === 'superAdmin'

  const navMain = [
    {
      title: 'Beranda',
      url: '/',
      icon: Home,
    },
    {
      title: 'Destinasi',
      url: '/destinasi',
      icon: Telescope,
    },
    {
      title: 'Artikel',
      url: '/artikel',
      icon: BookOpenText,
    },
    {
      title: 'Game',
      url: '/game',
      icon: Gamepad2,
    },
    {
      title: 'Peringkat',
      url: '/destinasi/leaderboard',
      icon: Medal,
    },
    // Only show for SuperAdmin
  ]
  const projects = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboardIcon,
    },

    {
      title: 'Kelola Destinasi',
      url: '/dashboard/destination',
      icon: Telescope,
    },
    {
      title: 'Kelola Artikel',
      url: '/dashboard/articles',
      icon: BookOpenText,
    },
    // Only show for SuperAdmin
    ...(isSuperAdmin
      ? [
          {
            title: 'Users',
            url: '/dashboard/user-menagement',
            icon: UsersRound,
          },
        ]
      : []),
  ]

  const data = {
    navMain,
    projects,
    navSecondary: [
      {
        title: 'Support',
        url: 'https://github.com/Ahmad-Yu2up-Ar-Raf',
        icon: LifeBuoy,
      },
      {
        title: 'Feedback',
        url: link,
        icon: Send,
      },
    ],
  }

  const isMob = useIsMobile()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeaderLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.projects} />
        <NavProjects items={data.navMain} />
        <NavSecondary
          isMobile={isMob}
          items={data.navSecondary}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
