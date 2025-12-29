import { type Mess } from '@/db/schema'

import {
  CircleIcon,
  Mars,
  UserRoundCheck,
  UserRoundXIcon,
  Venus,
  VenusAndMars,
  CheckCircle2,
  CircleX,
} from 'lucide-react'

export function getType(gender: Mess['type']) {
  const genderIcons = {
    male: Mars,
    female: Venus,
    mixture: VenusAndMars,
  }

  return genderIcons[gender!] || CircleIcon
}

export function getStatusCapacity(role: Mess['statusCapacity']) {
  const roleIcons = {
    available: UserRoundCheck,
    full: UserRoundXIcon,
  }

  return roleIcons[role!] || CircleIcon
}

export function getStatusIcon(status: Mess['status']) {
  const statusIcons = {
    active: CheckCircle2,
    'not-active': CircleX,
  }

  return statusIcons[status!] || CircleIcon
}

// ============================================
// QUERY KEYS
// ============================================

/**
 * Query keys untuk mess queries
 * Semua query yang berhubungan dengan mess harus pakai keys ini
 * untuk memastikan invalidation bekerja dengan benar
 *
 * IMPORTANT: userId MUST be included to prevent cross-user cache pollution
 */
export const MESS_QUERY_KEYS = {
  // Base key with userId - invalidate ini akan invalidate SEMUA mess queries for this user
  all: (userId: string) => ['mess', userId] as const,

  // Aggregate query key - include userId AND filters untuk granular caching
  aggregate: (userId: string, filters?: Record<string, unknown>) =>
    [...MESS_QUERY_KEYS.all(userId), 'aggregate', filters] as const,

  // Individual query keys (untuk future use)
  list: (userId: string, filters?: Record<string, unknown>) =>
    [...MESS_QUERY_KEYS.all(userId), 'list', filters] as const,
  statusCounts: (userId: string) =>
    [...MESS_QUERY_KEYS.all(userId), 'statusCounts'] as const,
  typeCounts: (userId: string) =>
    [...MESS_QUERY_KEYS.all(userId), 'typeCounts'] as const,
  capacityCounts: (userId: string) =>
    [...MESS_QUERY_KEYS.all(userId), 'capacityCounts'] as const,
  byId: (userId: string, id: number) =>
    [...MESS_QUERY_KEYS.all(userId), 'byId', id] as const,
} as const

// ============================================
// HELPERS
// ============================================

/**
 * Helper untuk invalidate semua mess queries untuk current user
 * Gunakan setelah create/update/delete operations
 *
 * @param queryClient - TanStack Query client
 * @param userId - Current user ID
 *
 * @example
 * // Dalam mutation onSuccess
 * await invalidateMessQueries(queryClient, session.user.id)
 */
export const invalidateMessQueries = async (
  queryClient: import('@tanstack/react-query').QueryClient,
  userId: string,
) => {
  // Invalidate base key = invalidate semua turunannya for this user
  await queryClient.invalidateQueries({
    queryKey: MESS_QUERY_KEYS.all(userId),
  })
}

/**
 * Helper untuk clear semua mess queries (on logout)
 * Removes ALL mess data from cache regardless of user
 *
 * @param queryClient - TanStack Query client
 *
 * @example
 * // In logout handler
 * clearAllMessQueries(queryClient)
 */
export const clearAllMessQueries = (
  queryClient: import('@tanstack/react-query').QueryClient,
) => {
  queryClient.removeQueries({
    predicate: (query) => query.queryKey[0] === 'mess',
  })
}
