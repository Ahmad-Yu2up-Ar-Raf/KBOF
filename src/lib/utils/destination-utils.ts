// =============================================================================
// DESTINATION UTILS - SUASANA
// =============================================================================
// Complete utility functions for ALL enum types in schema
// Icons, Labels, Colors, Options for Forms
// =============================================================================

import type { Destination } from '@/db/schema'
import type { LucideIcon } from 'lucide-react'
import {
  // Status icons
  CheckCircle2,
  FileText,
  Archive,
  CircleIcon,
  // Destination Type icons
  Palmtree,
  Landmark,
  Building,
  Church,
  UtensilsCrossed,
  Waves,
  Users,
  Music,
  Brush,
  PartyPopper,
  // Category icons
  MapPin,
  Compass,
  ScrollText,
  ChefHat,
  Theater,
  Castle,
  // Donation Status icons
  Clock,
  CheckCheck,
  XCircle,
  RotateCcw,
  // General
  Map,
} from 'lucide-react'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type ContentStatus = 'published' | 'draft' | 'archived'
export type DonationStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type DestinationType = Destination['type']
export type DestinationCategory = Destination['category']
export type ProvinsiIndonesia = Destination['provinsi']

// =============================================================================
// CONTENT STATUS UTILS
// =============================================================================

export const contentStatusConfig: Record<
  ContentStatus,
  {
    label: string
    icon: LucideIcon
    color: string
    bgColor: string
    borderColor: string
  }
> = {
  published: {
    label: 'Published',
    icon: CheckCircle2,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200',
  },
  draft: {
    label: 'Draft',
    icon: FileText,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
  },
  archived: {
    label: 'Archived',
    icon: Archive,
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-200',
  },
}

export function getStatusIcon(status: ContentStatus): LucideIcon {
  return contentStatusConfig[status]?.icon ?? CircleIcon
}

export function getStatusLabel(status: ContentStatus): string {
  return contentStatusConfig[status]?.label ?? status
}

export function getStatusColor(status: ContentStatus): string {
  return contentStatusConfig[status]?.color ?? 'text-gray-700'
}

export function getStatusBgColor(status: ContentStatus): string {
  return contentStatusConfig[status]?.bgColor ?? 'bg-gray-100'
}

export const STATUS_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
] as const

// =============================================================================
// DONATION STATUS UTILS
// =============================================================================

export const donationStatusConfig: Record<
  DonationStatus,
  {
    label: string
    icon: LucideIcon
    color: string
    bgColor: string
    borderColor: string
  }
> = {
  pending: {
    label: 'Menunggu',
    icon: Clock,
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
  },
  completed: {
    label: 'Berhasil',
    icon: CheckCheck,
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
  },
  failed: {
    label: 'Gagal',
    icon: XCircle,
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
  },
  refunded: {
    label: 'Dikembalikan',
    icon: RotateCcw,
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
  },
}

export function getDonationStatusIcon(status: DonationStatus): LucideIcon {
  return donationStatusConfig[status]?.icon ?? CircleIcon
}

export function getDonationStatusLabel(status: DonationStatus): string {
  return donationStatusConfig[status]?.label ?? status
}

export function getDonationStatusColor(status: DonationStatus): string {
  return donationStatusConfig[status]?.color ?? 'text-gray-700'
}

export function getDonationStatusBgColor(status: DonationStatus): string {
  return donationStatusConfig[status]?.bgColor ?? 'bg-gray-100'
}

export const DONATION_STATUS_OPTIONS = [
  { value: 'pending', label: 'Menunggu' },
  { value: 'completed', label: 'Berhasil' },
  { value: 'failed', label: 'Gagal' },
  { value: 'refunded', label: 'Dikembalikan' },
] as const

// =============================================================================
// DESTINATION TYPE UTILS
// =============================================================================

export const destinationTypeConfig: Record<
  DestinationType,
  {
    label: string
    icon: LucideIcon
    color: string
    bgColor: string
    borderColor: string
    description: string
  }
> = {
  'wisata-alam': {
    label: 'Wisata Alam',
    icon: Palmtree,
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    description: 'Destinasi alam seperti gunung, danau, air terjun',
  },
  'wisata-budaya': {
    label: 'Wisata Budaya',
    icon: Landmark,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
    description: 'Destinasi kebudayaan dan tradisi lokal',
  },
  'wisata-sejarah': {
    label: 'Wisata Sejarah',
    icon: Building,
    color: 'text-stone-700',
    bgColor: 'bg-stone-100',
    borderColor: 'border-stone-200',
    description: 'Situs dan bangunan bersejarah',
  },
  'wisata-religi': {
    label: 'Wisata Religi',
    icon: Church,
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200',
    description: 'Tempat ibadah dan ziarah',
  },
  'wisata-kuliner': {
    label: 'Wisata Kuliner',
    icon: UtensilsCrossed,
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    description: 'Kuliner dan makanan khas daerah',
  },
  'wisata-bahari': {
    label: 'Wisata Bahari',
    icon: Waves,
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-100',
    borderColor: 'border-cyan-200',
    description: 'Pantai, laut, dan pulau',
  },
  'adat-istiadat': {
    label: 'Adat Istiadat',
    icon: Users,
    color: 'text-rose-700',
    bgColor: 'bg-rose-100',
    borderColor: 'border-rose-200',
    description: 'Tradisi dan upacara adat',
  },
  kesenian: {
    label: 'Kesenian',
    icon: Music,
    color: 'text-pink-700',
    bgColor: 'bg-pink-100',
    borderColor: 'border-pink-200',
    description: 'Seni pertunjukan dan musik tradisional',
  },
  kerajinan: {
    label: 'Kerajinan',
    icon: Brush,
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
    borderColor: 'border-indigo-200',
    description: 'Kerajinan tangan dan produk lokal',
  },
  festival: {
    label: 'Festival',
    icon: PartyPopper,
    color: 'text-fuchsia-700',
    bgColor: 'bg-fuchsia-100',
    borderColor: 'border-fuchsia-200',
    description: 'Festival dan perayaan budaya',
  },
}

export function getTypeIcon(type: DestinationType): LucideIcon {
  return destinationTypeConfig[type]?.icon ?? CircleIcon
}

export function getTypeLabel(type: DestinationType): string {
  return destinationTypeConfig[type]?.label ?? type
}

export function getTypeColor(type: DestinationType): string {
  return destinationTypeConfig[type]?.color ?? 'text-gray-700'
}

export function getTypeBgColor(type: DestinationType): string {
  return destinationTypeConfig[type]?.bgColor ?? 'bg-gray-100'
}

export function getTypeDescription(type: DestinationType): string {
  return destinationTypeConfig[type]?.description ?? ''
}

export const TYPE_OPTIONS = [
  { value: 'wisata-alam', label: 'Wisata Alam' },
  { value: 'wisata-budaya', label: 'Wisata Budaya' },
  { value: 'wisata-sejarah', label: 'Wisata Sejarah' },
  { value: 'wisata-religi', label: 'Wisata Religi' },
  { value: 'wisata-kuliner', label: 'Wisata Kuliner' },
  { value: 'wisata-bahari', label: 'Wisata Bahari' },
  { value: 'adat-istiadat', label: 'Adat Istiadat' },
  { value: 'kesenian', label: 'Kesenian' },
  { value: 'kerajinan', label: 'Kerajinan' },
  { value: 'festival', label: 'Festival' },
] as const

// =============================================================================
// DESTINATION CATEGORY UTILS
// =============================================================================

export const destinationCategoryConfig: Record<
  DestinationCategory,
  {
    label: string
    icon: LucideIcon
    color: string
    bgColor: string
    borderColor: string
    description: string
  }
> = {
  'lokasi-budaya': {
    label: 'Lokasi Budaya',
    icon: MapPin,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
    description: 'Tempat-tempat bersejarah dan berbudaya',
  },
  pariwisata: {
    label: 'Pariwisata',
    icon: Compass,
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    description: 'Destinasi wisata umum',
  },
  'adat-istiadat': {
    label: 'Adat Istiadat',
    icon: ScrollText,
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200',
    description: 'Tradisi dan upacara adat',
  },
  'kuliner-tradisional': {
    label: 'Kuliner Tradisional',
    icon: ChefHat,
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    description: 'Makanan dan minuman khas daerah',
  },
  'kesenian-daerah': {
    label: 'Kesenian Daerah',
    icon: Theater,
    color: 'text-pink-700',
    bgColor: 'bg-pink-100',
    borderColor: 'border-pink-200',
    description: 'Seni dan pertunjukan lokal',
  },
  'situs-sejarah': {
    label: 'Situs Sejarah',
    icon: Castle,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200',
    description: 'Peninggalan dan monumen bersejarah',
  },
}

export function getCategoryIcon(category: DestinationCategory): LucideIcon {
  return destinationCategoryConfig[category]?.icon ?? CircleIcon
}

export function getCategoryLabel(category: DestinationCategory): string {
  return destinationCategoryConfig[category]?.label ?? category
}

export function getCategoryColor(category: DestinationCategory): string {
  return destinationCategoryConfig[category]?.color ?? 'text-gray-700'
}

export function getCategoryBgColor(category: DestinationCategory): string {
  return destinationCategoryConfig[category]?.bgColor ?? 'bg-gray-100'
}

export function getCategoryDescription(category: DestinationCategory): string {
  return destinationCategoryConfig[category]?.description ?? ''
}

export const CATEGORY_OPTIONS = [
  { value: 'lokasi-budaya', label: 'Lokasi Budaya' },
  { value: 'pariwisata', label: 'Pariwisata' },
  { value: 'adat-istiadat', label: 'Adat Istiadat' },
  { value: 'kuliner-tradisional', label: 'Kuliner Tradisional' },
  { value: 'kesenian-daerah', label: 'Kesenian Daerah' },
  { value: 'situs-sejarah', label: 'Situs Sejarah' },
] as const

// Legacy exports for backward compatibility
export const categoryColors: Record<string, string> = {
  'lokasi-budaya': 'bg-amber-100 text-amber-700',
  pariwisata: 'bg-blue-100 text-blue-700',
  'adat-istiadat': 'bg-purple-100 text-purple-700',
  'kuliner-tradisional': 'bg-orange-100 text-orange-700',
  'kesenian-daerah': 'bg-pink-100 text-pink-700',
  'situs-sejarah': 'bg-emerald-100 text-emerald-700',
}

export const categoryLabels: Record<string, string> = {
  'lokasi-budaya': 'Lokasi Budaya',
  pariwisata: 'Pariwisata',
  'adat-istiadat': 'Adat Istiadat',
  'kuliner-tradisional': 'Kuliner Tradisional',
  'kesenian-daerah': 'Kesenian Daerah',
  'situs-sejarah': 'Situs Sejarah',
}

// =============================================================================
// PROVINSI INDONESIA UTILS
// =============================================================================

export const provinsiIndonesiaConfig: Record<
  ProvinsiIndonesia,
  {
    label: string
    region: 'sumatera' | 'jawa' | 'kalimantan' | 'sulawesi' | 'bali-nusra' | 'maluku-papua'
  }
> = {
  aceh: { label: 'Aceh', region: 'sumatera' },
  'sumatera-utara': { label: 'Sumatera Utara', region: 'sumatera' },
  'sumatera-barat': { label: 'Sumatera Barat', region: 'sumatera' },
  riau: { label: 'Riau', region: 'sumatera' },
  'kepulauan-riau': { label: 'Kepulauan Riau', region: 'sumatera' },
  jambi: { label: 'Jambi', region: 'sumatera' },
  'sumatera-selatan': { label: 'Sumatera Selatan', region: 'sumatera' },
  'kepulauan-bangka-belitung': { label: 'Kepulauan Bangka Belitung', region: 'sumatera' },
  bengkulu: { label: 'Bengkulu', region: 'sumatera' },
  lampung: { label: 'Lampung', region: 'sumatera' },
  'dki-jakarta': { label: 'DKI Jakarta', region: 'jawa' },
  'jawa-barat': { label: 'Jawa Barat', region: 'jawa' },
  banten: { label: 'Banten', region: 'jawa' },
  'jawa-tengah': { label: 'Jawa Tengah', region: 'jawa' },
  'di-yogyakarta': { label: 'DI Yogyakarta', region: 'jawa' },
  'jawa-timur': { label: 'Jawa Timur', region: 'jawa' },
  bali: { label: 'Bali', region: 'bali-nusra' },
  'nusa-tenggara-barat': { label: 'Nusa Tenggara Barat', region: 'bali-nusra' },
  'nusa-tenggara-timur': { label: 'Nusa Tenggara Timur', region: 'bali-nusra' },
  'kalimantan-barat': { label: 'Kalimantan Barat', region: 'kalimantan' },
  'kalimantan-tengah': { label: 'Kalimantan Tengah', region: 'kalimantan' },
  'kalimantan-selatan': { label: 'Kalimantan Selatan', region: 'kalimantan' },
  'kalimantan-timur': { label: 'Kalimantan Timur', region: 'kalimantan' },
  'kalimantan-utara': { label: 'Kalimantan Utara', region: 'kalimantan' },
  'sulawesi-utara': { label: 'Sulawesi Utara', region: 'sulawesi' },
  gorontalo: { label: 'Gorontalo', region: 'sulawesi' },
  'sulawesi-tengah': { label: 'Sulawesi Tengah', region: 'sulawesi' },
  'sulawesi-selatan': { label: 'Sulawesi Selatan', region: 'sulawesi' },
  'sulawesi-barat': { label: 'Sulawesi Barat', region: 'sulawesi' },
  'sulawesi-tenggara': { label: 'Sulawesi Tenggara', region: 'sulawesi' },
  maluku: { label: 'Maluku', region: 'maluku-papua' },
  'maluku-utara': { label: 'Maluku Utara', region: 'maluku-papua' },
  papua: { label: 'Papua', region: 'maluku-papua' },
  'papua-barat': { label: 'Papua Barat', region: 'maluku-papua' },
  'papua-barat-daya': { label: 'Papua Barat Daya', region: 'maluku-papua' },
  'papua-tengah': { label: 'Papua Tengah', region: 'maluku-papua' },
  'papua-pegunungan': { label: 'Papua Pegunungan', region: 'maluku-papua' },
  'papua-selatan': { label: 'Papua Selatan', region: 'maluku-papua' },
}

export function getProvinsiLabel(provinsi: ProvinsiIndonesia): string {
  return provinsiIndonesiaConfig[provinsi]?.label ?? provinsi
}

export function getProvinsiRegion(provinsi: ProvinsiIndonesia): string {
  return provinsiIndonesiaConfig[provinsi]?.region ?? 'unknown'
}

export function getProvinsiIcon(): LucideIcon {
  return Map
}

export const PROVINSI_OPTIONS = [
  { value: 'aceh', label: 'Aceh' },
  { value: 'sumatera-utara', label: 'Sumatera Utara' },
  { value: 'sumatera-barat', label: 'Sumatera Barat' },
  { value: 'riau', label: 'Riau' },
  { value: 'kepulauan-riau', label: 'Kepulauan Riau' },
  { value: 'jambi', label: 'Jambi' },
  { value: 'sumatera-selatan', label: 'Sumatera Selatan' },
  { value: 'kepulauan-bangka-belitung', label: 'Kepulauan Bangka Belitung' },
  { value: 'bengkulu', label: 'Bengkulu' },
  { value: 'lampung', label: 'Lampung' },
  { value: 'dki-jakarta', label: 'DKI Jakarta' },
  { value: 'jawa-barat', label: 'Jawa Barat' },
  { value: 'banten', label: 'Banten' },
  { value: 'jawa-tengah', label: 'Jawa Tengah' },
  { value: 'di-yogyakarta', label: 'DI Yogyakarta' },
  { value: 'jawa-timur', label: 'Jawa Timur' },
  { value: 'bali', label: 'Bali' },
  { value: 'nusa-tenggara-barat', label: 'Nusa Tenggara Barat' },
  { value: 'nusa-tenggara-timur', label: 'Nusa Tenggara Timur' },
  { value: 'kalimantan-barat', label: 'Kalimantan Barat' },
  { value: 'kalimantan-tengah', label: 'Kalimantan Tengah' },
  { value: 'kalimantan-selatan', label: 'Kalimantan Selatan' },
  { value: 'kalimantan-timur', label: 'Kalimantan Timur' },
  { value: 'kalimantan-utara', label: 'Kalimantan Utara' },
  { value: 'sulawesi-utara', label: 'Sulawesi Utara' },
  { value: 'gorontalo', label: 'Gorontalo' },
  { value: 'sulawesi-tengah', label: 'Sulawesi Tengah' },
  { value: 'sulawesi-selatan', label: 'Sulawesi Selatan' },
  { value: 'sulawesi-barat', label: 'Sulawesi Barat' },
  { value: 'sulawesi-tenggara', label: 'Sulawesi Tenggara' },
  { value: 'maluku', label: 'Maluku' },
  { value: 'maluku-utara', label: 'Maluku Utara' },
  { value: 'papua', label: 'Papua' },
  { value: 'papua-barat', label: 'Papua Barat' },
  { value: 'papua-barat-daya', label: 'Papua Barat Daya' },
  { value: 'papua-tengah', label: 'Papua Tengah' },
  { value: 'papua-pegunungan', label: 'Papua Pegunungan' },
  { value: 'papua-selatan', label: 'Papua Selatan' },
] as const

// Legacy list (for backward compat)
export const PROVINSI_INDONESIA = PROVINSI_OPTIONS.map((p) => p.label)

// Legacy labels
export const provinsiLabels: Record<string, string> = Object.fromEntries(
  PROVINSI_OPTIONS.map((p) => [p.value, p.label]),
)

// =============================================================================
// QUERY KEYS
// =============================================================================

export const DESTINATION_QUERY_KEYS = {
  all: (userId: string) => ['destination', userId] as const,

  aggregate: (userId: string, filters?: Record<string, unknown>) =>
    [...DESTINATION_QUERY_KEYS.all(userId), 'aggregate', filters] as const,

  list: (userId: string, filters?: Record<string, unknown>) =>
    [...DESTINATION_QUERY_KEYS.all(userId), 'list', filters] as const,

  statusCounts: (userId: string) =>
    [...DESTINATION_QUERY_KEYS.all(userId), 'statusCounts'] as const,

  typeCounts: (userId: string) =>
    [...DESTINATION_QUERY_KEYS.all(userId), 'typeCounts'] as const,

  byId: (userId: string, id: number) =>
    [...DESTINATION_QUERY_KEYS.all(userId), 'byId', id] as const,
} as const

// =============================================================================
// CACHE INVALIDATION HELPERS
// =============================================================================

export const invalidateDestinationQueries = async (
  queryClient: import('@tanstack/react-query').QueryClient,
) => {
  const { destinationKeys } = await import('@/lib/query-options')
  await queryClient.invalidateQueries({
    queryKey: destinationKeys.all,
  })
}

export const clearAllDestinationQueries = (
  queryClient: import('@tanstack/react-query').QueryClient,
) => {
  queryClient.removeQueries({
    predicate: (query) => query.queryKey[0] === 'destination',
  })
}

// =============================================================================
// SLUG GENERATOR
// =============================================================================

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
