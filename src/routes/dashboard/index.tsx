import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { Logout } from '@/hooks/actions/auth/use-auth-form'
 
import { authMiddleware } from '@/lib/middleware'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  server: {
    middleware: [authMiddleware]
  }
})

function RouteComponent() {
    const navigate = useNavigate()


    
  return (
    <>
    
    <Button onClick={() => {
      Logout({
         onSuccess: async () => {
      // Your login logic here
      toast.success("Logout berhasil!")
      navigate({ to: "/login"})
 
    },
    onError: (error: Error) => {
      toast.error(error.message,)
    },
      })
    }}>Logout</Button>
    </>
  )
}
