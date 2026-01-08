'use client'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/fragments/shadcn-ui/sidebar'

import AppLogo from '../../../../fragments/custom-ui/header/app-logo'

export default function SidebarHeaderLogo() {
  const appName = import.meta.env.VITE_APP_NAME
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-primary data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="  flex aspect-square size-8 items-center justify-center rounded-xl">
            <AppLogo />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{appName}</span>
            <span className="truncate text-xs capitalize">Enterprise</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
