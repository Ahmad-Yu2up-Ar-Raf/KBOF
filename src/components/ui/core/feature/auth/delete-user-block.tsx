import React from 'react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
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
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'

export default function DeleteUser() {
  const [isPending, setIsPending] = React.useState(false)
  const navigate = useNavigate()
  const deletedUser = async () => {
    toast.loading('Deleting account...', { id: 'delete-account' })
    setIsPending(true)
    await authClient.deleteUser(
      {
        callbackURL: '/auth', // you can provide a callback URL to redirect after deletion
      },
      {
        onSuccess: () => {
          setIsPending(false)
          toast.success('Account deleted successfully.', {
            id: 'delete-account',
          })
          navigate({ to: '/auth' })
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
        title="Hapus akun"
        description="Hapus akun Anda dan semua sumber dayanya."
      />
      <div className="space-y-4 rounded-xl border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
        <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
          <p className="font-medium">Warning</p>
          <p className="text-sm">
            Harap berhati-hati, tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" data-test="delete-user-button">
              Hapus akun
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Apakah Anda yakin ingin menghapus akun Anda?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Setelah akun Anda dihapus, semua sumber daya dan datanya juga
                akan dihapus secara permanen. Silakan masukkan kata sandi Anda
                untuk mengkonfirmasi bahwa Anda ingin menghapus akun Anda secara
                permanen.
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
                  'Batal'
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
                  'Lanjutkan'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
