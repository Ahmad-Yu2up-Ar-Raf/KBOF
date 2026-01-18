// =============================================================================
// ANALYTICS CHART CONFIG - SUASANA
// =============================================================================
// Chart configuration for dashboard analytics charts

import type { ChartConfig } from '@/components/ui/fragments/shadcn-ui/chart'

// ============================================
// DISTRIBUTION CHART COLORS (Top 5)
// ============================================

// Colors for top 4 + lainnya (others)
export const distributionColors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
] as const

// ============================================
// CATEGORY CHART CONFIG
// ============================================

export const categoryChartConfig: ChartConfig = {
  count: {
    label: 'Jumlah',
  },
  'lokasi-budaya': {
    label: 'Lokasi Budaya',
    color: 'var(--chart-1)',
  },
  pariwisata: {
    label: 'Pariwisata',
    color: 'var(--chart-2)',
  },
  'adat-istiadat': {
    label: 'Adat Istiadat',
    color: 'var(--chart-3)',
  },
  'kuliner-tradisional': {
    label: 'Kuliner Tradisional',
    color: 'var(--chart-4)',
  },
  'kesenian-daerah': {
    label: 'Kesenian Daerah',
    color: 'var(--chart-5)',
  },
  'situs-sejarah': {
    label: 'Situs Sejarah',
    color: 'var(--chart-1)',
  },
  lainnya: {
    label: 'Lainnya',
    color: 'var(--chart-5)',
  },
}

// ============================================
// TYPE CHART CONFIG
// ============================================

export const typeChartConfig: ChartConfig = {
  count: {
    label: 'Jumlah',
  },
  'wisata-alam': {
    label: 'Wisata Alam',
    color: 'var(--chart-1)',
  },
  'wisata-budaya': {
    label: 'Wisata Budaya',
    color: 'var(--chart-2)',
  },
  'wisata-sejarah': {
    label: 'Wisata Sejarah',
    color: 'var(--chart-3)',
  },
  'wisata-religi': {
    label: 'Wisata Religi',
    color: 'var(--chart-4)',
  },
  'wisata-kuliner': {
    label: 'Wisata Kuliner',
    color: 'var(--chart-5)',
  },
  'wisata-bahari': {
    label: 'Wisata Bahari',
    color: 'var(--chart-1)',
  },
  'adat-istiadat': {
    label: 'Adat Istiadat',
    color: 'var(--chart-2)',
  },
  kesenian: {
    label: 'Kesenian',
    color: 'var(--chart-3)',
  },
  kerajinan: {
    label: 'Kerajinan',
    color: 'var(--chart-4)',
  },
  festival: {
    label: 'Festival',
    color: 'var(--chart-5)',
  },
  lainnya: {
    label: 'Lainnya',
    color: 'var(--chart-5)',
  },
}

// ============================================
// PROVINSI CHART CONFIG
// ============================================

export const provinsiChartConfig: ChartConfig = {
  count: {
    label: 'Jumlah',
  },
  aceh: { label: 'Aceh', color: 'var(--chart-1)' },
  'sumatera-utara': { label: 'Sumatera Utara', color: 'var(--chart-2)' },
  'sumatera-barat': { label: 'Sumatera Barat', color: 'var(--chart-3)' },
  riau: { label: 'Riau', color: 'var(--chart-4)' },
  'kepulauan-riau': { label: 'Kepulauan Riau', color: 'var(--chart-5)' },
  jambi: { label: 'Jambi', color: 'var(--chart-1)' },
  'sumatera-selatan': { label: 'Sumatera Selatan', color: 'var(--chart-2)' },
  'kepulauan-bangka-belitung': {
    label: 'Bangka Belitung',
    color: 'var(--chart-3)',
  },
  bengkulu: { label: 'Bengkulu', color: 'var(--chart-4)' },
  lampung: { label: 'Lampung', color: 'var(--chart-5)' },
  'dki-jakarta': { label: 'DKI Jakarta', color: 'var(--chart-1)' },
  'jawa-barat': { label: 'Jawa Barat', color: 'var(--chart-2)' },
  banten: { label: 'Banten', color: 'var(--chart-3)' },
  'jawa-tengah': { label: 'Jawa Tengah', color: 'var(--chart-4)' },
  'di-yogyakarta': { label: 'DI Yogyakarta', color: 'var(--chart-5)' },
  'jawa-timur': { label: 'Jawa Timur', color: 'var(--chart-1)' },
  bali: { label: 'Bali', color: 'var(--chart-2)' },
  'nusa-tenggara-barat': { label: 'NTB', color: 'var(--chart-3)' },
  'nusa-tenggara-timur': { label: 'NTT', color: 'var(--chart-4)' },
  'kalimantan-barat': { label: 'Kalimantan Barat', color: 'var(--chart-5)' },
  'kalimantan-tengah': { label: 'Kalimantan Tengah', color: 'var(--chart-1)' },
  'kalimantan-selatan': {
    label: 'Kalimantan Selatan',
    color: 'var(--chart-2)',
  },
  'kalimantan-timur': { label: 'Kalimantan Timur', color: 'var(--chart-3)' },
  'kalimantan-utara': { label: 'Kalimantan Utara', color: 'var(--chart-4)' },
  'sulawesi-utara': { label: 'Sulawesi Utara', color: 'var(--chart-5)' },
  gorontalo: { label: 'Gorontalo', color: 'var(--chart-1)' },
  'sulawesi-tengah': { label: 'Sulawesi Tengah', color: 'var(--chart-2)' },
  'sulawesi-selatan': { label: 'Sulawesi Selatan', color: 'var(--chart-3)' },
  'sulawesi-barat': { label: 'Sulawesi Barat', color: 'var(--chart-4)' },
  'sulawesi-tenggara': { label: 'Sulawesi Tenggara', color: 'var(--chart-5)' },
  maluku: { label: 'Maluku', color: 'var(--chart-1)' },
  'maluku-utara': { label: 'Maluku Utara', color: 'var(--chart-2)' },
  papua: { label: 'Papua', color: 'var(--chart-3)' },
  'papua-barat': { label: 'Papua Barat', color: 'var(--chart-4)' },
  'papua-barat-daya': { label: 'Papua Barat Daya', color: 'var(--chart-5)' },
  'papua-tengah': { label: 'Papua Tengah', color: 'var(--chart-1)' },
  'papua-pegunungan': { label: 'Papua Pegunungan', color: 'var(--chart-2)' },
  'papua-selatan': { label: 'Papua Selatan', color: 'var(--chart-3)' },
  lainnya: { label: 'Lainnya', color: 'var(--chart-5)' },
}

// ============================================
// INTERACTIVE CHART CONFIG (Votes & Reviews)
// ============================================

export const voteTrendsChartConfig: ChartConfig = {
  views: {
    label: 'Total Aktivitas',
  },
  votes: {
    label: 'Votes',
    color: 'var(--chart-1)',
  },
  reviews: {
    label: 'Reviews',
    color: 'var(--chart-2)',
  },
}

// ============================================
// HELPER: Get label from config
// ============================================

export function getCategoryLabel(category: string): string {
  const config = categoryChartConfig[category]
  return typeof config?.label === 'string' ? config.label : category
}

export function getTypeLabel(type: string): string {
  const config = typeChartConfig[type]
  return typeof config?.label === 'string' ? config.label : type
}

export function getProvinsiLabel(provinsi: string): string {
  const config = provinsiChartConfig[provinsi]
  return typeof config?.label === 'string' ? config.label : provinsi
}
