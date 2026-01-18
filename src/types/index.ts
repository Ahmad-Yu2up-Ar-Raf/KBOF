import type { LinkProps } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

import type {
  DestinationCategory,
  DestinationStatus,
  DestinationType,
  ProvinsiIndonesia,
} from '@/db/schema'

export interface sidebarType {
  items: Array<{
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: Array<{
      title: string
      url: string
    }>
  }>
}

export interface NavItem {
  title: string
  href: NonNullable<LinkProps['href']>
  icon?: LucideIcon | null
  isActive?: boolean
}

export interface TopDestination {
  nama_jurusan: string
  siswas_count: number
}

/**
 * Result type dari aggregate query
 */

export interface DataCard {
  title: string
  description: string
  value: number | number
  icon: LucideIcon
  label?: string
}

export interface Destinasi {
  id: string
  slug: string
  judul: string
  ringkasanPendek: string
  deskripsi: string
  media: Array<Media>
  pembuat: Pembuat
  kategori: string
  subKategori: string
  tag: Array<string>
  lokasi: Lokasi
  dibuatPada: Date
  diupdatePada: Date
  totalVote: number
  status: Status
  impactMetrics: ImpactMetrics
  sumber: Array<Sumber>
  confidence: Confidence
}

export enum Confidence {
  Reported = 'reported',
  Verified = 'verified',
}

export interface ImpactMetrics {
  beneficiaries?: number
  co2SavedKg?: number
  fundsRaisedIdr?: number
  jobsCreated?: number
}

export interface Lokasi {
  provinsi: string
  kabupatenKota: string
}

export interface Media {
  kind: Kind
  url: string
  caption: string
  license: License
  source: string
}

export enum Kind {
  Image = 'image',
}

export enum License {
  Unsplash = 'Unsplash',
}

export interface Pembuat {
  id: string
  nama: string
  peran: string
  organisasi: string
  avatarUrl: string
}

export enum Status {
  Published = 'published',
}

export interface Sumber {
  type: Type
  title: string
  url: string
}

export enum Type {
  Article = 'article',
  Official = 'official',
  Paper = 'paper',
}

// ============================================
// DESTINATION TYPES - Re-exported from schema
// ============================================

export type {
  DestinationType,
  DestinationStatus,
  DestinationCategory,
  ProvinsiIndonesia,
} from '@/db/schema'

export interface DestinationAggregateInput {
  filterFlag?: 'advancedFilters' | 'commandFilters' | null
  page?: number
  perPage?: number
  sort?: Array<{ id: string; desc: boolean }>
  name?: string
  status?: Array<DestinationStatus>
  type?: Array<DestinationType>
  category?: Array<DestinationCategory>
  provinsi?: string
  createdAt?: Array<number>
  filters?: Array<unknown>
  joinOperator?: 'and' | 'or'
}

export interface DestinationAggregateResult {
  data: Array<{
    id: number
    userId: string
    creatorName?: string | null
    creatorAvatar?: string | null
    slug: string
    name: string
    description: string
    type: DestinationType
    category: DestinationCategory
    provinsi: ProvinsiIndonesia
    kabupatenKota: string | null
    alamat: string | null
    coverImage: string | null
    images: string | null
    totalVote: number
    totalReview: number
    averageRating: number | null | null

    status: DestinationStatus
    createdAt: Date
    updatedAt: Date
    publishedAt?: Date | null
  }>
  pageCount: number
  statusCounts: {
    published: number
    draft: number
    archived: number
    pending: number
    cancel: number
  }
  categoryCounts: {
    'lokasi-budaya': number
    pariwisata: number
    'adat-istiadat': number
    'kuliner-tradisional': number
    'kesenian-daerah': number
    'situs-sejarah': number
  }
  typeCounts: {
    'wisata-alam': number
    'wisata-budaya': number
    'wisata-sejarah': number
    'wisata-religi': number
    'wisata-kuliner': number
    'wisata-bahari': number
    'adat-istiadat': number
    kesenian: number
    kerajinan: number
    festival: number
  }
}

// ============================================
// ARTICLE TYPES
// ============================================

export interface ArticleAggregateInput {
  filterFlag?: 'advancedFilters' | 'commandFilters' | null
  page?: number
  perPage?: number
  sort?: Array<{ id: string; desc: boolean }>
  title?: string
  status?: Array<DestinationStatus>
  createdAt?: Array<number>
  filters?: Array<unknown>
  joinOperator?: 'and' | 'or'
}

export interface ArticleAggregateResult {
  data: Array<{
    id: number
    authorId: string
    authorName?: string | null
    authorAvatar?: string | null
    slug: string
    title: string
    excerpt: string | null
    content: string
    coverImage: string | null
    status: DestinationStatus
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
  }>
  geCount: number
  statusCounts: {
    published: number
    draft: number
    archived: number
  }
}
