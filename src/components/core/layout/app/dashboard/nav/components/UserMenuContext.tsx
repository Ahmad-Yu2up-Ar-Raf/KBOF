import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/fragments/shadcn-ui/dropdown-menu'
import { UserInfo } from './UserInfo'
import { useMobileNavigation } from '@/hooks/use-mobile-navigation'
import { type User } from '@/db/schema'
import { Link } from '@tanstack/react-router'
import { LogOut, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import React from 'react'
import { authClient } from '@/lib/auth/auth-client'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'

interface UserMenuContentProps {
  user: User
}

export function UserMenuContent({ user }: UserMenuContentProps) {
  const cleanup = useMobileNavigation()
  const navigate = useNavigate()

  const [isPending, setIsPending] = React.useState(false)

  const logoutUser = async () => {
    toast.loading('Logout account...', { id: 'logout-account' })
    setIsPending(true)
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsPending(false)
          toast.success('Account logout successfully.', {
            id: 'logout-account',
          })
          navigate({ to: '/login' })
        },
        onError(context) {
          setIsPending(false)
          toast.error(`Error logout account: ${context.error.message}`, {
            id: 'logout-account',
          })
        },
      }, // you can provide a callback URL to redirect after deletion
    })
  }

  if (!user) return null

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link
            className="block w-full"
            to={'/dashboard/settings'}
            onClick={cleanup}
          >
            <Settings className="mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled={isPending} onSelect={logoutUser}>
        {isPending ? <Spinner className="mr-2" /> : <LogOut className="mr-2" />}
        {isPending ? 'Log out...' : 'Log out'}
      </DropdownMenuItem>
    </>
  )
}
