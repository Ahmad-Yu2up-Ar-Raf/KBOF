'use client'

import * as React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/fragments/shadcn-ui/alert-dialog'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { Label } from '@/components/ui/fragments/shadcn-ui/label'
import { Textarea } from '@/components/ui/fragments/shadcn-ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/fragments/shadcn-ui/dialog'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/fragments/shadcn-ui/avatar'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner'
import { formatDate } from '@/lib/format'
import { useInitials } from '@/hooks/use-initials'
import type { UserTableRow } from './user-table-columns'
import {
  Shield,
  ShieldCheck,
  User,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import type { UserRoleType } from '@/db/schema'

// =============================================================================
// DELETE USER DIALOG
// =============================================================================

interface DeleteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserTableRow | null
  onConfirm: () => Promise<void>
  loading?: boolean
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  loading,
}: DeleteUserDialogProps) {
  const getInitials = useInitials()

  if (!user) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent data-lenis-prevent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu yakin ingin menghapus pengguna{' '}
            <strong>{user.name}</strong>? Semua data terkait (destinasi,
            artikel, dll) juga akan dihapus. Tindakan ini tidak dapat
            dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
          <Avatar>
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault()
              await onConfirm()
            }}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? <Spinner className="h-4 w-4 mr-2" /> : null}
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// =============================================================================
// BAN USER DIALOG
// =============================================================================

interface BanUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserTableRow | null
  onConfirm: (reason?: string) => Promise<void>
  loading?: boolean
}

export function BanUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  loading,
}: BanUserDialogProps) {
  const [reason, setReason] = React.useState('')
  const getInitials = useInitials()

  if (!user) return null

  const handleConfirm = async () => {
    await onConfirm(reason || undefined)
    setReason('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-lenis-prevent>
        <DialogHeader>
          <DialogTitle>Ban Pengguna</DialogTitle>
          <DialogDescription>
            Pengguna yang di-ban tidak dapat mengakses platform.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
          <Avatar>
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ban-reason">Alasan (Opsional)</Label>
          <Textarea
            id="ban-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Masukkan alasan ban..."
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? <Spinner className="h-4 w-4 mr-2" /> : null}
            Ban User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// =============================================================================
// UNBAN USER DIALOG
// =============================================================================

interface UnbanUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserTableRow | null
  onConfirm: () => Promise<void>
  loading?: boolean
}

export function UnbanUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  loading,
}: UnbanUserDialogProps) {
  const getInitials = useInitials()

  if (!user) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent data-lenis-prevent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unban Pengguna</AlertDialogTitle>
          <AlertDialogDescription>
            Pengguna akan dapat mengakses platform kembali.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
          <Avatar>
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.banReason && (
              <p className="text-xs text-destructive mt-1">
                Alasan ban: {user.banReason}
              </p>
            )}
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault()
              await onConfirm()
            }}
            disabled={loading}
          >
            {loading ? <Spinner className="h-4 w-4 mr-2" /> : null}
            Unban
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// =============================================================================
// UPDATE ROLE DIALOG
// =============================================================================

interface UpdateRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserTableRow | null
  newRole: UserRoleType | null
  onConfirm: () => Promise<void>
  loading?: boolean
}

const roleConfig: Record<
  UserRoleType,
  {
    label: string
    icon: React.ReactNode
    description: string
    variant: 'default' | 'secondary' | 'outline'
  }
> = {
  pribumi: {
    label: 'Pribumi',
    icon: <User className="h-4 w-4" />,
    description: 'Dapat membuat destinasi & artikel, vote, dan review',
    variant: 'secondary',
  },
  admin: {
    label: 'Admin',
    icon: <Shield className="h-4 w-4" />,
    description: 'Dapat mengelola semua konten platform',
    variant: 'outline',
  },
  superAdmin: {
    label: 'Super Admin',
    icon: <ShieldCheck className="h-4 w-4" />,
    description: 'Akses penuh termasuk manajemen pengguna',
    variant: 'default',
  },
}

export function UpdateRoleDialog({
  open,
  onOpenChange,
  user,
  newRole,
  onConfirm,
  loading,
}: UpdateRoleDialogProps) {
  const getInitials = useInitials()

  if (!user || !newRole) return null

  const config = roleConfig[newRole]

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent data-lenis-prevent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ubah Role Pengguna</AlertDialogTitle>
          <AlertDialogDescription>
            Ubah role <strong>{user.name}</strong> menjadi{' '}
            <strong>{config.label}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="p-4 rounded-lg bg-muted/50 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Role baru:</span>
            <Badge className="gap-1">
              {config.icon}
              {config.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault()
              await onConfirm()
            }}
            disabled={loading}
          >
            {loading ? <Spinner className="h-4 w-4 mr-2" /> : null}
            Konfirmasi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// =============================================================================
// VIEW USER DIALOG
// =============================================================================

interface ViewUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserTableRow | null
}

export function ViewUserDialog({
  open,
  onOpenChange,
  user,
}: ViewUserDialogProps) {
  const getInitials = useInitials()

  if (!user) return null

  const config = roleConfig[user.role]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-lenis-prevent>
        <DialogHeader>
          <DialogTitle>Detail Pengguna</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* User Avatar & Name */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback className="text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              {user.username && (
                <p className="text-muted-foreground">@{user.username}</p>
              )}
              <Badge variant={config.variant} className="mt-1 gap-1">
                {config.icon}
                {config.label}
              </Badge>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
              {user.emailVerified ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Bergabung {formatDate(user.createdAt)}</span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            {user.banned && <Badge variant="destructive">Banned</Badge>}
            <Badge
              variant={user.hasCompletedOnboarding ? 'default' : 'secondary'}
            >
              Onboarding: {user.hasCompletedOnboarding ? 'Selesai' : 'Belum'}
            </Badge>
          </div>

          {/* Ban Info */}
          {user.banned && user.banReason && (
            <div className="p-3 rounded-lg bg-destructive/10 text-sm">
              <p className="font-medium text-destructive">Alasan Ban:</p>
              <p className="text-muted-foreground">{user.banReason}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
