import DashboardLayoutHeader from './nav/app-sideheader'
import { AppSidebar } from './nav/app-sidebar'
import type { User } from '@/db/schema'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/fragments/shadcn-ui/sidebar'
import ScrollToTop from '@/components/ui/fragments/custom-ui/button/scroll-to-top-button'

import { authClient } from '@/lib/auth/auth-client'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'

interface AppSidebarProps {
  children: React.ReactNode
}

function AppLayout({ children }: AppSidebarProps) {
  const { data: session, isPending } = authClient.useSession()

  // Handle loading state - jangan render sidebar sampai session loaded
  if (isPending || !session?.user) {
    return (
      <div className="flex h-svh w-full items-center justify-center">
        <Spinner className="  h-8 w-8  border-t-transparent rounded-xl" />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar user={session.user as User} />
      <SidebarInset className="flex w-full flex-col flex-1 overflow-hidden">
        <DashboardLayoutHeader />
        <section className="flex-1 w-full bg-background overflow-y-auto">
          <main className="space-y-4 w-full py-6 md:px-5 px-3.5">
            {children}
          </main>
        </section>
      </SidebarInset>
      <ScrollToTop />
    </SidebarProvider>
  )
}

export default AppLayout
