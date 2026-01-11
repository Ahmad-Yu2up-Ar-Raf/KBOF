// =============================================================================
// CONSTANTS - SUASANA
// =============================================================================

export const unknownError = 'Terjadi kesalahan. Silakan coba lagi nanti.'

/** Database table prefix */
export const databasePrefix = 'suasana'

/** App name */
export const appName = 'Suasana'

/** App description */
export const appDescription =
  'Platform interaktif untuk memperkenalkan, mendukung, dan melestarikan ekowisata serta budaya lokal Indonesia'

/** Category colors for explore */
export const categoryColors: Record<string, string> = {
  Kesehatan: 'bg-red-100 text-red-700 border-red-200',
  Pendidikan: 'bg-blue-100 text-blue-700 border-blue-200',
  Lingkungan: 'bg-green-100 text-green-700 border-green-200',
  Pangan: 'bg-orange-100 text-orange-700 border-orange-200',
  Energi: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Transportasi: 'bg-purple-100 text-purple-700 border-purple-200',
  Agrikultur: 'bg-lime-100 text-lime-700 border-lime-200',
  'Ekonomi Kreatif': 'bg-pink-100 text-pink-700 border-pink-200',
  Sosial: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Teknologi: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Keamanan: 'bg-slate-100 text-slate-700 border-slate-200',
}

/** List of all category names */
export const categoryList = [
  'Semua',
  'Kesehatan',
  'Pendidikan',
  'Lingkungan',
  'Pangan',
  'Energi',
  'Transportasi',
  'Agrikultur',
  'Ekonomi Kreatif',
  'Sosial',
  'Teknologi',
  'Keamanan',
] as const

/** List of all provinces in Indonesia */
export const provinsiList = [
  'Aceh',
  'Sumatera Utara',
  'Sumatera Barat',
  'Riau',
  'Jambi',
  'Sumatera Selatan',
  'Bengkulu',
  'Lampung',
  'Kepulauan Bangka Belitung',
  'Kepulauan Riau',
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Banten',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Sulawesi Tengah',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Gorontalo',
  'Sulawesi Barat',
  'Maluku',
  'Maluku Utara',
  'Papua',
  'Papua Barat',
  'Papua Selatan',
  'Papua Tengah',
  'Papua Pegunungan',
  'Papua Barat Daya',
] as const
