import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/fragments/shadcn-ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/fragments/shadcn-ui/sidebar'
import { UserInfo } from './UserInfo'
import { UserMenuContent } from './UserMenuContext'
import { useIsMobile } from '@/hooks/use-mobile'

import { ChevronsUpDown } from 'lucide-react'
import { User } from '@/db/schema'

export function NavUser({ user }: { user: User }) {
  const { state } = useSidebar()
  const isMobile = useIsMobile()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
              data-test="sidebar-menu-button"
            >
              <UserInfo user={user} />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl"
            align="end"
            side={
              isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'
            }
          >
            <UserMenuContent user={user} />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
