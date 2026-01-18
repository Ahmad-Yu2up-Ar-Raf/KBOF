'use client'

import { Folder, MoreHorizontal, Share, Trash2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

import type { sidebarType } from '@/types'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/fragments/shadcn-ui/sidebar'
import { NavItem } from '@/types'

export function NavProjects({ items }: sidebarType) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link to={item.url}>
                {item.icon && <item.icon className="size-4 mr-2" />}

                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className=" sr-only">
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
