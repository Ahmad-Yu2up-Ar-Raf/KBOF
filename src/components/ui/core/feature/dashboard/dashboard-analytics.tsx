'use client'

import * as React from 'react'
import {
  BarChart3,
  MapPin,
  MessageSquare,
  Newspaper,
  Star,
  ThumbsUp,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type {
  CategoryDistribution,
  DashboardStats,
  ProvinsiDistribution,
  TopDestination,
} from '@/lib/server/analytics/analytics-server-actions'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card'
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton'
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge'
import { formatLabel } from '@/lib/format'
import MediaItem from '@/components/ui/fragments/custom-ui/media/media-item'

// =============================================================================
// STATS CARD COMPONENT
// =============================================================================

interface StatsCardProps {
  title: string
  value: number | string
  description?: string
  icon: React.ReactNode
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  loading?: boolean
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  loading,
}: StatsCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20" />
          {description && <Skeleton className="mt-2 h-3 w-32" />}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp
              className={`h-3 w-3 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}
            />
            <span
              className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}
            </span>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// =============================================================================
// STATS GRID
// =============================================================================

interface StatsGridProps {
  stats: DashboardStats | null
  loading?: boolean
}

export function StatsGrid({ stats, loading }: StatsGridProps) {
  const statsConfig = [
    {
      title: 'Total Pengguna',
      value: stats?.totalUsers ?? 0,
      description: `${stats?.newUsersThisMonth ?? 0} baru bulan ini`,
      icon: <Users className="h-4 w-4" />,
      trend: stats?.newUsersThisMonth
        ? {
            value: stats.newUsersThisMonth,
            label: 'bulan ini',
            isPositive: true,
          }
        : undefined,
    },
    {
      title: 'Total Destinasi',
      value: stats?.totalDestinations ?? 0,
      description: `${stats?.newDestinationsThisMonth ?? 0} baru bulan ini`,
      icon: <MapPin className="h-4 w-4" />,
      trend: stats?.newDestinationsThisMonth
        ? {
            value: stats.newDestinationsThisMonth,
            label: 'bulan ini',
            isPositive: true,
          }
        : undefined,
    },
    {
      title: 'Total Artikel',
      value: stats?.totalArticles ?? 0,
      icon: <Newspaper className="h-4 w-4" />,
    },
    {
      title: 'Total Votes',
      value: stats?.totalVotes ?? 0,
      icon: <ThumbsUp className="h-4 w-4" />,
    },
    {
      title: 'Total Reviews',
      value: stats?.totalReviews ?? 0,
      icon: <Star className="h-4 w-4" />,
    },
    {
      title: 'Total Komentar',
      value: stats?.totalComments ?? 0,
      icon: <MessageSquare className="h-4 w-4" />,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statsConfig.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          trend={stat.trend}
          loading={loading}
        />
      ))}
    </div>
  )
}

// =============================================================================
// TOP DESTINATIONS LIST
// =============================================================================

interface TopDestinationsListProps {
  destinations: Array<TopDestination>
  loading?: boolean
}

export function TopDestinationsList({
  destinations,
  loading,
}: TopDestinationsListProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Destinasi</CardTitle>
          <CardDescription>Destinasi dengan vote terbanyak</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (destinations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Destinasi</CardTitle>
          <CardDescription>Destinasi dengan vote terbanyak</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground">Belum ada destinasi</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Destinasi</CardTitle>
        <CardDescription>Destinasi dengan vote terbanyak</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {destinations.map((destination, index) => (
            <Link
              key={destination.id}
              to="/destinasi/$destinasiId"
              params={{ destinasiId: destination.slug }}
              className="flex items-center gap-4 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded overflow-hidden bg-muted">
                  {destination.coverImage ? (
                    <MediaItem
                      webViewLink={destination.coverImage}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <span className="absolute -top-1 -left-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{destination.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatLabel(destination.provinsi)}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  {destination.voteCount}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {destination.reviewCount}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// =============================================================================
// CATEGORY DISTRIBUTION CHART
// =============================================================================

interface DistributionChartProps {
  data: Array<CategoryDistribution> | Array<ProvinsiDistribution>
  title: string
  description: string
  loading?: boolean
  type: 'category' | 'provinsi'
}

export function DistributionChart({
  data,
  title,
  description,
  loading,
  type,
}: DistributionChartProps) {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500',
  ]

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-sm text-muted-foreground">Belum ada data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => {
            const label =
              type === 'category'
                ? (item as CategoryDistribution).category
                : (item as ProvinsiDistribution).provinsi
            const percentage = total > 0 ? (item.count / total) * 100 : 0

            return (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="truncate flex-1">{formatLabel(label)}</span>
                  <span className="text-muted-foreground flex-shrink-0 ml-2">
                    {item.count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors[index % colors.length]} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// =============================================================================
// QUICK ACTIONS
// =============================================================================

interface QuickAction {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

interface QuickActionsProps {
  actions: Array<QuickAction>
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aksi Cepat</CardTitle>
        <CardDescription>Kelola konten platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {actions.map((action) => (
            <Link
              key={action.href}
              to={action.href}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{action.title}</p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
