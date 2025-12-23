import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/fragments/shadcn-ui/avatar'
import { useInitials } from '@/hooks/use-initials'
import { User } from '@/db/schema'

export function UserInfo({ user }: { user: User }) {
  const getInitials = useInitials()

  return (
    <>
      <Avatar className="h-8 w-8 rounded-xl ">
        <AvatarImage src={user.image ?? undefined} alt={user.name} />
        <AvatarFallback className="rounded-xl">
          {' '}
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{user.name}</span>
        <span className="text-muted-foreground truncate text-xs">
          {user.email}
        </span>
      </div>
    </>
  )
}
