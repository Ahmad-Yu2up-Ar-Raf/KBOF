import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs'

import {
  getLeaderboardQueryOptions,
  getLeaderboardPodiumQueryOptions,
  type LeaderboardFilters,
  type LeaderboardEntry,
} from '@/lib/query-options'
import {
  destinationCategory,
  destinationType,
  provinsiIndonesia,
} from '@/db/schema'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/fragments/shadcn-ui/avatar'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/fragments/shadcn-ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fragments/shadcn-ui/select'
import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'
import {
  ArrowLeft,
  Trophy,
  Medal,
  Award,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from 'lucide-react'

// ============================================
// TYPE LABELS
// ============================================

const typeLabels: Record<string, string> = {
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

const provinsiLabels: Record<string, string> = {
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
// NUQS PARSERS FOR URL STATE
// ============================================

const categoryList = destinationCategory.enumValues

// ============================================
// MAIN COMPONENT
// ============================================
const typeList = destinationType.enumValues
const provinsiList = provinsiIndonesia.enumValues
export default function LeaderboardPage() {
  // URL state with nuqs
  const leaderboardParsers = {
    categories: parseAsArrayOf(parseAsStringLiteral(categoryList)).withDefault(
      [],
    ),
    types: parseAsArrayOf(parseAsStringLiteral(typeList)).withDefault([]),
    provinces: parseAsArrayOf(parseAsStringLiteral(provinsiList)).withDefault(
      [],
    ),
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
  }
  const [filters, setFilters] = useQueryStates(leaderboardParsers)

  // Build query filters from URL state
  const queryFilters: LeaderboardFilters = {
    categories: filters.categories as LeaderboardFilters['categories'],
    types: filters.types as LeaderboardFilters['types'],
    provinces: filters.provinces as LeaderboardFilters['provinces'],
    limit: filters.perPage,
    offset: (filters.page - 1) * filters.perPage,
    scope: 'global',
  }

  // Fetch data
  const { data: podium } = useSuspenseQuery(
    getLeaderboardPodiumQueryOptions({
      categories: queryFilters.categories,
      types: queryFilters.types,
      provinces: queryFilters.provinces,
      scope: 'global',
    }),
  )

  const { data: leaderboardData } = useSuspenseQuery(
    getLeaderboardQueryOptions(queryFilters),
  )

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.types.length > 0 ||
    filters.provinces.length > 0

  const handleResetFilters = () => {
    void setFilters({
      categories: null,
      types: null,
      provinces: null,
      page: 1,
    })
  }

  const totalPages = Math.ceil(leaderboardData.totalCount / filters.perPage)

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 space-y-8">
      {/* Navigation */}
      <nav className="flex items-center justify-between">
        <Link
          to="/"
          className={cn(
            buttonVariants({ variant: 'link' }),
            'flex has-[>svg]:px-0 w-fit py-2 items-center gap-2 px-0 group',
          )}
        >
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali</span>
        </Link>
      </nav>

      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          🏆 Leaderboard
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Destinasi dengan dukungan terbanyak dari komunitas. Vote destinasi
          favoritmu untuk membantu mereka naik peringkat!
        </p>
      </header>

      {/* Podium Section - TOP 3 */}
      {podium.length > 0 && (
        <section className="py-8">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {/* 2nd Place */}
            {podium[1] && (
              <PodiumCard entry={podium[1]} position={2} size="medium" />
            )}

            {/* 1st Place - Larger */}
            {podium[0] && (
              <PodiumCard entry={podium[0]} position={1} size="large" />
            )}

            {/* 3rd Place */}
            {podium[2] && (
              <PodiumCard entry={podium[2]} position={3} size="medium" />
            )}
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter:</span>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-destructive"
            >
              <X className="size-4 mr-1" />
              Reset
            </Button>
          )}
        </div>

        {/* Type & Province Select Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Type Filter */}
          <Select
            value={filters.types.length === 1 ? filters.types[0] : 'all'}
            onValueChange={(value) => {
              if (value === 'all') {
                void setFilters({ types: null, page: 1 })
              } else {
                void setFilters({
                  types: [value] as typeof filters.types,
                  page: 1,
                })
              }
            }}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Tipe Destinasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              {typeList.map((t) => (
                <SelectItem key={t} value={t}>
                  {typeLabels[t] ?? t.replace(/-/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Province Filter */}
          <Select
            value={
              filters.provinces.length === 1 ? filters.provinces[0] : 'all'
            }
            onValueChange={(value) => {
              if (value === 'all') {
                void setFilters({ provinces: null, page: 1 })
              } else {
                void setFilters({
                  provinces: [value] as typeof filters.provinces,
                  page: 1,
                })
              }
            }}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Provinsi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Provinsi</SelectItem>
              {provinsiList.map((p) => (
                <SelectItem key={p} value={p}>
                  {provinsiLabels[p] ?? p.replace(/-/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category filter badges */}
        <div className="flex flex-wrap gap-1">
          {categoryList.map((cat) => (
            <Badge
              key={cat}
              variant={filters.categories.includes(cat) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => {
                const newCategories = filters.categories.includes(cat)
                  ? filters.categories.filter((c) => c !== cat)
                  : [...filters.categories, cat]
                void setFilters({
                  categories: newCategories.length > 0 ? newCategories : null,
                  page: 1,
                })
              }}
            >
              {cat.replace(/-/g, ' ')}
              {leaderboardData.categoryCounts[cat]
                ? ` (${leaderboardData.categoryCounts[cat]})`
                : ''}
            </Badge>
          ))}
        </div>
      </section>

      {/* Leaderboard List */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          Peringkat Lengkap ({leaderboardData.totalCount} destinasi)
        </h2>

        <div className="space-y-3">
          {leaderboardData.data.map((entry) => (
            <LeaderboardRow key={entry.destinationId} entry={entry} />
          ))}
        </div>

        {leaderboardData.data.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Tidak ada destinasi yang cocok dengan filter.
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page <= 1}
            onClick={() => void setFilters({ page: filters.page - 1 })}
          >
            <ChevronLeft className="size-4" />
            Sebelumnya
          </Button>

          <span className="text-sm text-muted-foreground px-4">
            Halaman {filters.page} dari {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={filters.page >= totalPages}
            onClick={() => void setFilters({ page: filters.page + 1 })}
          >
            Selanjutnya
            <ChevronRight className="size-4" />
          </Button>
        </nav>
      )}
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function PodiumCard({
  entry,
  position,
  size,
}: {
  entry: LeaderboardEntry
  position: 1 | 2 | 3
  size: 'large' | 'medium'
}) {
  const Icon = position === 1 ? Trophy : position === 2 ? Medal : Award
  const colors = {
    1: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    2: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    3: 'text-amber-600 bg-amber-600/10 border-amber-600/20',
  }

  return (
    <Link
      to="/destinasi/$destinasiId"
      params={{ destinasiId: entry.slug }}
      className="block"
    >
      <Card
        className={cn(
          'transition-all hover:scale-105 hover:shadow-lg',
          size === 'large' ? 'w-48 md:w-64' : 'w-36 md:w-48',
          colors[position],
        )}
      >
        <CardHeader className="p-3 pb-0">
          <div className="flex items-center justify-center">
            <Icon
              className={cn(
                'fill-current',
                size === 'large' ? 'size-10' : 'size-8',
              )}
            />
          </div>
        </CardHeader>
        <CardContent className="p-3 space-y-2 text-center">
          {entry.coverImage && (
            <div
              className={cn(
                'rounded-lg overflow-hidden mx-auto',
                size === 'large' ? 'h-32' : 'h-24',
              )}
            >
              <MediaItem
                webViewLink={entry.coverImage}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h3
            className={cn(
              'font-semibold line-clamp-2',
              size === 'large' ? 'text-base' : 'text-sm',
            )}
          >
            {entry.name}
          </h3>
          <div className="flex items-center justify-center gap-1 text-primary">
            <ThumbsUp className="size-4" />
            <span className="font-bold">{entry.voteCount}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const isTop3 = entry.rank <= 3
  const rankColors = {
    1: 'bg-yellow-500 text-white',
    2: 'bg-slate-400 text-white',
    3: 'bg-amber-600 text-white',
  }

  return (
    <Link
      to="/destinasi/$destinasiId"
      params={{ destinasiId: entry.slug }}
      className="block"
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="flex items-center gap-4 p-4">
          {/* Rank */}
          <div
            className={cn(
              'flex items-center justify-center size-10 rounded-full font-bold text-lg',
              isTop3
                ? rankColors[entry.rank as 1 | 2 | 3]
                : 'bg-muted text-muted-foreground',
            )}
          >
            {entry.rank}
          </div>

          {/* Image */}
          {entry.coverImage && (
            <div className="size-16 rounded-lg overflow-hidden shrink-0">
              <MediaItem
                webViewLink={entry.coverImage}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{entry.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {entry.description}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {entry.category.replace(/-/g, ' ')}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {entry.provinsi.replace(/-/g, ' ')}
              </span>
            </div>
          </div>

          {/* User */}
          <div className="hidden sm:flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={entry.user.image ?? undefined} />
              <AvatarFallback>
                {entry.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground truncate max-w-24">
              {entry.user.name}
            </span>
          </div>

          {/* Vote Count */}
          <div className="flex items-center gap-1 text-primary font-semibold">
            <ThumbsUp className="size-4" />
            <span>{entry.voteCount}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// ============================================
// SKELETON
// ============================================

export function LeaderboardSkeleton() {
  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 space-y-8">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      {/* Podium skeleton */}
      <div className="flex items-center justify-center gap-4 md:gap-8 py-8">
        <Skeleton className="h-48 w-36 md:w-48 rounded-xl" />
        <Skeleton className="h-56 w-48 md:w-64 rounded-xl" />
        <Skeleton className="h-48 w-36 md:w-48 rounded-xl" />
      </div>

      {/* List skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
