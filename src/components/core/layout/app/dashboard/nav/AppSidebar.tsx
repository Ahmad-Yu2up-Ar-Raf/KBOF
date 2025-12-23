'use client'

import * as React from 'react'
import {
  Building2,
  BriefcaseBusiness,
  Send,
  LifeBuoy,
  DoorOpen,
  LayoutDashboardIcon,
} from 'lucide-react'

import { NavMain } from './components/NavMain'
import { NavUser } from './components/NavUser'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/fragments/shadcn-ui/sidebar'
import { NavSecondary } from './components/NavSecondary'
import { useIsMobile } from '@/hooks/use-mobile'
import type { User } from '@/db/schema'
import SidebarHeaderLogo from './components/AppSidebarHeader'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const number: string = '628999069933'
  const massage: string = 'Hi Yusuf, I want to discuss a project with you!'
  const link: string = `https://api.whatsapp.com/send?phone=${number}&text=${massage}&type=phone_number&app_absent=0`

  const data = {
    navMain: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboardIcon,
        isActive: false,
      },
      {
        title: 'Mess',
        url: '/dashboard/mess',
        icon: Building2,
        isActive: false,
      },
      {
        title: 'Rooms',
        url: '/dashboard/rooms',
        icon: DoorOpen,
      },
      {
        title: 'Employe',
        url: '/dashboard/employe',
        icon: BriefcaseBusiness,
      },
    ],
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
        <NavMain items={data.navMain} />

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
