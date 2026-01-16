// =============================================================================
// CATEGORY IMAGES - SUASANA
// =============================================================================
// Centralized image URLs for destination categories
// Used in KategoriCard and other category-related components
// =============================================================================

import type { DestinationCategory } from '@/db/schema'

/**
 * Category image configuration
 * Using high-quality Unsplash images that represent each category
 */
export const categoryImageConfig: Record<
  DestinationCategory,
  {
    image: string
    alt: string
    gradient: string
  }
> = {
  'lokasi-budaya': {
    image:
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&auto=format&fit=crop&q=80',
    alt: 'Lokasi Budaya Indonesia',
    gradient: 'from-amber-900/90 via-amber-800/70',
  },
  pariwisata: {
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80',
    alt: 'Pariwisata Indonesia',
    gradient: 'from-blue-900/90 via-blue-800/70',
  },
  'adat-istiadat': {
    image:
      'https://images.unsplash.com/photo-1518281361980-b26bfd556770?w=800&auto=format&fit=crop&q=80',
    alt: 'Adat Istiadat Indonesia',
    gradient: 'from-purple-900/90 via-purple-800/70',
  },
  'kuliner-tradisional': {
    image:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80',
    alt: 'Kuliner Tradisional Indonesia',
    gradient: 'from-orange-900/90 via-orange-800/70',
  },
  'kesenian-daerah': {
    image:
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&auto=format&fit=crop&q=80',
    alt: 'Kesenian Daerah Indonesia',
    gradient: 'from-pink-900/90 via-pink-800/70',
  },
  'situs-sejarah': {
    image:
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&auto=format&fit=crop&q=80',
    alt: 'Situs Sejarah Indonesia',
    gradient: 'from-emerald-900/90 via-emerald-800/70',
  },
}

/**
 * Get category image URL
 */
export function getCategoryImage(category: DestinationCategory): string {
  return (
    categoryImageConfig[category]?.image ??
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80'
  )
}

/**
 * Get category image alt text
 */
export function getCategoryImageAlt(category: DestinationCategory): string {
  return categoryImageConfig[category]?.alt ?? 'Destinasi Indonesia'
}

/**
 * Get category gradient for overlay
 */
export function getCategoryGradient(category: DestinationCategory): string {
  return (
    categoryImageConfig[category]?.gradient ??
    'from-gray-900/90 via-gray-800/70'
  )
}

/**
 * Category data type for components
 */
export interface CategoryData {
  value: DestinationCategory
  label: string
  image: string
  description: string
}

/**
 * Get all categories with their images for carousel
 */
export function getAllCategoriesWithImages(): CategoryData[] {
  const categories: DestinationCategory[] = [
    'lokasi-budaya',
    'pariwisata',
    'adat-istiadat',
    'kuliner-tradisional',
    'kesenian-daerah',
    'situs-sejarah',
  ]

  const categoryLabels: Record<DestinationCategory, string> = {
    'lokasi-budaya': 'Lokasi Budaya',
    pariwisata: 'Pariwisata',
    'adat-istiadat': 'Adat Istiadat',
    'kuliner-tradisional': 'Kuliner Tradisional',
    'kesenian-daerah': 'Kesenian Daerah',
    'situs-sejarah': 'Situs Sejarah',
  }

  const categoryDescriptions: Record<DestinationCategory, string> = {
    'lokasi-budaya': 'Tempat-tempat bersejarah dan berbudaya',
    pariwisata: 'Destinasi wisata umum',
    'adat-istiadat': 'Tradisi dan upacara adat',
    'kuliner-tradisional': 'Makanan dan minuman khas daerah',
    'kesenian-daerah': 'Seni dan pertunjukan lokal',
    'situs-sejarah': 'Peninggalan dan monumen bersejarah',
  }

  return categories.map((category) => ({
    value: category,
    label: categoryLabels[category],
    image: getCategoryImage(category),
    description: categoryDescriptions[category],
  }))
}
