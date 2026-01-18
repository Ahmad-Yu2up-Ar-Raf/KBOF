// =============================================================================
// DESTINATION LABELS - SHARED CONSTANTS
// =============================================================================
// Centralized labels for destination-related enums
// Used across destinasi-block, leaderboard-block, and data-tables
// =============================================================================

import type { FilterOption } from '@/components/ui/fragments/custom-ui/filter'
import {
  destinationCategory,
  destinationType,
  provinsiIndonesia,
} from '@/db/schema'

// ============================================
// CATEGORY LABELS
// ============================================

export const categoryLabels: Record<string, string> = {
  'lokasi-budaya': 'Lokasi Budaya',
  pariwisata: 'Pariwisata',
  'adat-istiadat': 'Adat Istiadat',
  'kuliner-tradisional': 'Kuliner Tradisional',
  'kesenian-daerah': 'Kesenian Daerah',
  'situs-sejarah': 'Situs Sejarah',
}

// ============================================
// TYPE LABELS
// ============================================

export const typeLabels: Record<string, string> = {
  'wisata-alam': 'Wisata Alam',
  'wisata-budaya': 'Wisata Budaya',
  'wisata-sejarah': 'Wisata Sejarah',
  'wisata-religi': 'Wisata Religi',
  'wisata-kuliner': 'Wisata Kuliner',
  'wisata-bahari': 'Wisata Bahari',
  'adat-istiadat': 'Adat Istiadat',
  kesenian: 'Kesenian',
  kerajinan: 'Kerajinan',
  festival: 'Festival',
}

// ============================================
// PROVINSI LABELS
// ============================================

export const provinsiLabels: Record<string, string> = {
  aceh: 'Aceh',
  'sumatera-utara': 'Sumatera Utara',
  'sumatera-barat': 'Sumatera Barat',
  riau: 'Riau',
  'kepulauan-riau': 'Kepulauan Riau',
  jambi: 'Jambi',
  'sumatera-selatan': 'Sumatera Selatan',
  'kepulauan-bangka-belitung': 'Bangka Belitung',
  bengkulu: 'Bengkulu',
  lampung: 'Lampung',
  'dki-jakarta': 'DKI Jakarta',
  'jawa-barat': 'Jawa Barat',
  banten: 'Banten',
  'jawa-tengah': 'Jawa Tengah',
  'di-yogyakarta': 'DI Yogyakarta',
  'jawa-timur': 'Jawa Timur',
  bali: 'Bali',
  'nusa-tenggara-barat': 'NTB',
  'nusa-tenggara-timur': 'NTT',
  'kalimantan-barat': 'Kalimantan Barat',
  'kalimantan-tengah': 'Kalimantan Tengah',
  'kalimantan-selatan': 'Kalimantan Selatan',
  'kalimantan-timur': 'Kalimantan Timur',
  'kalimantan-utara': 'Kalimantan Utara',
  'sulawesi-utara': 'Sulawesi Utara',
  gorontalo: 'Gorontalo',
  'sulawesi-tengah': 'Sulawesi Tengah',
  'sulawesi-selatan': 'Sulawesi Selatan',
  'sulawesi-barat': 'Sulawesi Barat',
  'sulawesi-tenggara': 'Sulawesi Tenggara',
  maluku: 'Maluku',
  'maluku-utara': 'Maluku Utara',
  papua: 'Papua',
  'papua-barat': 'Papua Barat',
  'papua-barat-daya': 'Papua Barat Daya',
  'papua-tengah': 'Papua Tengah',
  'papua-pegunungan': 'Papua Pegunungan',
  'papua-selatan': 'Papua Selatan',
}

// ============================================
// ENUM LISTS (for convenience)
// ============================================

export const categoryList = destinationCategory.enumValues
export const typeList = destinationType.enumValues
export const provinsiList = provinsiIndonesia.enumValues

// ============================================
// FILTER OPTIONS BUILDERS
// ============================================

/**
 * Build category filter options with optional counts
 */
export function buildCategoryOptions(
  counts?: Record<string, number>,
): Array<FilterOption> {
  return categoryList.map((value) => ({
    value,
    label: categoryLabels[value] ?? value.replace(/-/g, ' '),
    count: counts?.[value],
  }))
}

/**
 * Build type filter options with optional counts
 */
export function buildTypeOptions(
  counts?: Record<string, number>,
): Array<FilterOption> {
  return typeList.map((value) => ({
    value,
    label: typeLabels[value] ?? value.replace(/-/g, ' '),
    count: counts?.[value],
  }))
}

/**
 * Build provinsi filter options with optional counts
 */
export function buildProvinsiOptions(
  counts?: Record<string, number>,
): Array<FilterOption> {
  return provinsiList.map((value) => ({
    value,
    label: provinsiLabels[value] ?? value.replace(/-/g, ' '),
    count: counts?.[value],
  }))
}

// ============================================
// SORT OPTIONS (for Destinasi only)
// ============================================

export const sortOptions = [
  { value: 'popular', label: 'Populer' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'rating', label: 'Rating' },
  { value: 'name', label: 'A-Z' },
] as const

export type SortBy = (typeof sortOptions)[number]['value']
