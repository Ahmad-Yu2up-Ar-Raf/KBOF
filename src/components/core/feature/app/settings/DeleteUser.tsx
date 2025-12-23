import {
  Button,
  buttonVariants,
} from '@/components/ui/fragments/shadcn-ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/fragments/shadcn-ui/alert-dialog'
import HeadingSmall from '@/components/ui/fragments/custom-ui/typography/heading-small'
import { authClient } from '@/lib/auth/auth-client'
import React from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import { useNavigate } from '@tanstack/react-router'

export default function DeleteUser() {
  const [isPending, setIsPending] = React.useState(false)
  const navigate = useNavigate()
  const deletedUser = async () => {
    toast.loading('Deleting account...', { id: 'delete-account' })
    setIsPending(true)
    await authClient.deleteUser(
      {
        callbackURL: '/login', // you can provide a callback URL to redirect after deletion
      },
      {
        onSuccess: () => {
          setIsPending(false)
          toast.success('Account deleted successfully.', {
            id: 'delete-account',
          })
          navigate({ to: '/login' })
        },
        onError(context) {
          setIsPending(false)
          toast.error(`Error deleting account: ${context.error.message}`, {
            id: 'delete-account',
          })
        },
      },
    )
  }
  return (
    <div className="space-y-6">
      <HeadingSmall
        title="Delete account"
        description="Delete your account and all of its resources"
      />
      <div className="space-y-4 rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
        <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
          <p className="font-medium">Warning</p>
          <p className="text-sm">
            Please proceed with caution, this cannot be undone.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" data-test="delete-user-button">
              Delete account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete your account?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Once your account is deleted, all of its resources and data will
                also be permanently deleted. Please enter your password to
                confirm you would like to permanently delete your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>
                {' '}
                {isPending ? (
                  <>
                    <Spinner />
                    Loading...
                  </>
                ) : (
                  'Continue'
                )}
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isPending}
                onClick={deletedUser}
                className={cn(buttonVariants({ variant: 'destructive' }))}
              >
                {isPending ? (
                  <>
                    <Spinner />
                    Loading...
                  </>
                ) : (
                  'Continue'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
