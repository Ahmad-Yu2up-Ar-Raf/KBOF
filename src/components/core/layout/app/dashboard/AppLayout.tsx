import DashboardLayoutHeader from './nav/AppSideheader'
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/fragments/shadcn-ui/sidebar'
import ScrollToTop from '@/components/ui/fragments/custom-ui/button/scroll-to-top-button'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import { AppSidebar } from './nav/AppSidebar'
import { authClient } from '@/lib/auth/auth-client'
import { User } from '@/db/schema'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'

interface AppSidebarProps {
  children: React.ReactNode
}

function AppLayout({ children }: AppSidebarProps) {
  const { data: session, isPending } = authClient.useSession()

  // Handle loading state - jangan render sidebar sampai session loaded
  if (isPending || !session?.user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="  h-8 w-8  border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <NuqsAdapter>
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
    </NuqsAdapter>
  )
}

export default AppLayout
