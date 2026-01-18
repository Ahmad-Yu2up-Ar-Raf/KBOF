'use client'

import { FileText, MapPin, Users, Vote } from 'lucide-react'

import type { DataCard } from '@/types'
import type { AnalyticsAggregateResult } from '@/lib/query-options'
import { SectionCards } from '@/components/ui/fragments/custom-ui/card/section-card'
import { ChartActivityTrends } from '@/components/ui/fragments/custom-ui/charts/chart-activity-trends'
import { ChartDistribution } from '@/components/ui/fragments/custom-ui/charts/chart-distribution'
import { ChartTopDestinations } from '@/components/ui/fragments/custom-ui/charts/chart-top-destinations'
import {
  categoryChartConfig,
  provinsiChartConfig,
  typeChartConfig,
} from '@/config/chart/analytics-chart-config'

// ============================================
// TYPES
// ============================================

interface OverviewProps {
  data: AnalyticsAggregateResult
}

// ============================================
// COMPONENT
// ============================================

function Overview({ data }: OverviewProps) {
  const {
    stats,
    topDestinations,
    categoryDistribution,
    typeDistribution,
    provinsiDistribution,
    activityTrends,
  } = data

  // Stats cards data (max 4)
  const dataCards: Array<DataCard> = [
    {
      title: 'Total Destinasi',
      description: 'Destinasi wisata & budaya',
      value: stats.totalDestinations,
      icon: MapPin,
      label: 'Destinasi',
    },
    {
      title: 'Total Pengguna',
      description: 'Pengguna terdaftar',
      value: stats.totalUsers,
      icon: Users,
      label: 'Pengguna',
    },
    {
      title: 'Total Artikel',
      description: 'Artikel yang dipublikasi',
      value: stats.totalArticles,
      icon: FileText,
      label: 'Artikel',
    },
    {
      title: 'Total Votes',
      description: 'Votes pada destinasi',
      value: stats.totalVotes,
      icon: Vote,
      label: 'Votes',
    },
  ]

  // Transform distribution data for charts
  const categoryData = categoryDistribution.map((item) => ({
    name: item.category,
    count: item.count,
  }))

  const typeData = typeDistribution.map((item) => ({
    name: item.type,
    count: item.count,
  }))

  const provinsiData = provinsiDistribution.map((item) => ({
    name: item.provinsi,
    count: item.count,
  }))

  return (
    <section className="space-y-4">
      <div className="@container/main  flex flex-1 flex-col gap-4">
        {/* Stats Cards */}
        <div className="flex flex-col  gap-4 md:gap-6">
          <SectionCards dataCards={dataCards} />
        </div>

        {/* Charts Grid */}
        <div className="md:grid  *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs flex flex-col grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-4 @5xl/main:grid-cols-3 ">
          {/* Interactive Activity Trends Chart - Full Width */}

          <ChartActivityTrends
            className="col-span-3 md:col-span-2"
            data={activityTrends}
            title="Tren Aktivitas"
            description="Votes, destinasi, dan artikel per hari"
          />
          <ChartTopDestinations
            className="col-span-2 lg:col-span-1"
            data={topDestinations}
            title="Top 5 Destinasi Populer"
            description="Destinasi dengan votes terbanyak"
            footerText="Berdasarkan jumlah votes"
            subFooter="Destinasi paling diminati"
          />
          <ChartDistribution
            className="col-span-2 lg:col-span-1"
            data={provinsiData}
            chartConfig={provinsiChartConfig}
            title="Distribusi Provinsi"
            description="Top 5 provinsi"
            nameKey="Destinasi"
            emptyMessage="provinsi"
            footerDescription="Distribusi destinasi per provinsi"
          />
          {/* Category Distribution Pie Chart */}
          <ChartDistribution
            className="col-span-2 lg:col-span-1"
            data={categoryData}
            chartConfig={categoryChartConfig}
            title="Distribusi Kategori"
            description="Top 5 kategori destinasi"
            nameKey="Destinasi"
            emptyMessage="kategori"
            footerDescription="Distribusi kategori destinasi"
          />
          {/* Top Destinations Bar Chart */}

          {/* Type Distribution Pie Chart */}
          <ChartDistribution
            className="col-span-2 lg:col-span-1"
            data={typeData}
            chartConfig={typeChartConfig}
            title="Distribusi Tipe"
            description="Top 5 tipe wisata"
            nameKey="Destinasi"
            emptyMessage="tipe"
            footerDescription="Distribusi tipe destinasi"
          />
          {/* Provinsi Distribution Pie Chart */}
        </div>
      </div>
    </section>
  )
}

export default Overview
