import SiteHeader from '@/components/ui/core/layout/nav/site-header'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return <>
  <SiteHeader/>
  </>
}
