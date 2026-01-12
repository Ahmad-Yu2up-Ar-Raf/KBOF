'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ThumbsUp, Check, Loader2 } from 'lucide-react'

import { DestinasiDetailBlockProps } from '@/components/ui/core/block/destinasi/detail/destinasi-detail-block'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/fragments/shadcn-ui/alert-dialog'
import { Button } from '../../shadcn-ui/button'
import { Spinner } from '../../shadcn-ui/spinner'

import { useSession } from '@/lib/auth/auth-client'
import { useCheckUserVote, useToggleVote } from '@/hooks/use-vote-mutations'
import { cn } from '@/lib/utils'

function VoteButton({ destination }: DestinasiDetailBlockProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: session } = useSession()

  // Check if user already voted for this destination
  const { data: voteStatus, isLoading: isCheckingVote } = useCheckUserVote(
    destination.id,
    !!session?.user,
  )

  const hasVoted = voteStatus?.hasVoted ?? false

  // Toggle vote mutation
  const { toggleVote, isLoading: isVoting } = useToggleVote({
    destinationId: destination.id,
    destinationSlug: destination.slug,
    onSuccess: () => {
      setIsDialogOpen(false)
      if (hasVoted) {
        toast.success('Vote berhasil dihapus')
      } else {
        toast.success('Terima kasih atas vote Anda! 🎉')
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // Handle button click for unauthenticated users
  const handleVoteClick = () => {
    if (!session?.user) {
      toast.error('Silakan login terlebih dahulu untuk memberikan vote')
      return
    }
    setIsDialogOpen(true)
  }

  // Handle vote confirmation
  const handleConfirmVote = async () => {
    await toggleVote(hasVoted)
  }

  // Loading state while checking vote status
  if (isCheckingVote && session?.user) {
    return (
      <Button variant="outline" className="w-full sm:w-fit" disabled>
        <Spinner className="size-4" />
        Memuat...
      </Button>
    )
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={hasVoted ? 'default' : 'outline'}
          className={cn(
            'w-full sm:w-fit transition-all duration-200',
            hasVoted && 'bg-primary text-primary-foreground',
          )}
          onClick={handleVoteClick}
          disabled={isVoting}
        >
          {isVoting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : hasVoted ? (
            <Check className="size-4" />
          ) : (
            <ThumbsUp className="size-4" />
          )}
          {hasVoted ? 'Sudah Divote' : 'Vote Sekarang'}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {hasVoted ? 'Batalkan Vote?' : `Vote untuk "${destination.name}"?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {hasVoted ? (
              <>
                Anda sudah memberikan vote untuk destinasi ini. Apakah Anda
                yakin ingin membatalkan vote Anda?
              </>
            ) : (
              <>
                Dengan memberikan vote, Anda mendukung destinasi{' '}
                <strong>{destination.name}</strong> agar lebih dikenal oleh
                publik. Setiap user hanya dapat memberikan 1 vote per destinasi.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isVoting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmVote}
            disabled={isVoting}
            className={cn(
              hasVoted &&
                'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            )}
          >
            {isVoting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Memproses...
              </>
            ) : hasVoted ? (
              'Batalkan Vote'
            ) : (
              <>
                <ThumbsUp className="size-4 mr-2" />
                Vote Sekarang
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default VoteButton
