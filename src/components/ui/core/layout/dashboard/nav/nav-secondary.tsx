import * as React from 'react'

import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/fragments/shadcn-ui/sidebar'

export function NavSecondary({
  isMobile,
  items,

  ...props
}: {
  isMobile: boolean
  items: Array<{
    title: string
    url: string
    icon: LucideIcon
  }>
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <>
      <SidebarGroup {...props}>
        <SidebarGroupContent>
          <SidebarMenu className="relative">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                  <Link to={item.url} target="_blank">
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}
