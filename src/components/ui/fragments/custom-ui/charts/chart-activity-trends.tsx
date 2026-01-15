'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/fragments/shadcn-ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fragments/shadcn-ui/select'
import { LucideChartNoAxesCombined } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

export interface ActivityTrendData {
  date: string
  votes: number
  destinations: number
  articles: number
}

interface ChartActivityTrendsProps {
  data: ActivityTrendData[]
  className?: string
  title?: string
  description?: string
}

// ============================================
// CHART CONFIG
// ============================================

const chartConfig = {
  count: {
    label: 'Jumlah',
  },
  votes: {
    label: 'Votes',
    color: 'var(--chart-1)',
  },
  destinations: {
    label: 'Destinasi',
    color: 'var(--chart-2)',
  },
  articles: {
    label: 'Artikel',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

// ============================================
// COMPONENT
// ============================================

export function ChartActivityTrends({
  data,
  className,
  title = 'Tren Aktivitas',
  description = 'Data votes, destinasi, dan artikel per hari',
}: ChartActivityTrendsProps) {
  const [timeRange, setTimeRange] = React.useState('90d')

  // Filter data based on time range
  const filteredData = React.useMemo(() => {
    if (data.length === 0) return []

    // Get the latest date from data
    const dates = data.map((item) => new Date(item.date))
    const latestDate = new Date(Math.max(...dates.map((d) => d.getTime())))

    let daysToSubtract = 90
    if (timeRange === '30d') {
      daysToSubtract = 30
    } else if (timeRange === '7d') {
      daysToSubtract = 7
    }

    const startDate = new Date(latestDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return data.filter((item) => {
      const date = new Date(item.date)
      return date >= startDate && date <= latestDate
    })
  }, [data, timeRange])

  // Calculate totals for summary
  const totals = React.useMemo(
    () => ({
      votes: filteredData.reduce((acc, curr) => acc + curr.votes, 0),
      destinations: filteredData.reduce(
        (acc, curr) => acc + curr.destinations,
        0,
      ),
      articles: filteredData.reduce((acc, curr) => acc + curr.articles, 0),
    }),
    [filteredData],
  )

  // Empty state
  if (data.length === 0) {
    return (
      <Card className={cn('pt-0 grid  ', className)}>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-7.5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle className="line-clamp-1">{title}</CardTitle>
            <CardDescription className="line-clamp-1">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 min-h-[300px] h-full content-center sm:px-6 sm:pt-6">
          <div className="text-center aspect-auto content-center min-h-[250px] w-full text-muted-foreground">
            <LucideChartNoAxesCombined className="size-6 m-auto mb-3" />
            <p className="text-lg font-medium">Belum ada data aktivitas</p>
            <p className="text-sm">Data akan muncul setelah ada aktivitas</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('pt-0 grid', className)}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-7.5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="line-clamp-1">{title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {description}
          </CardDescription>
        </div>

        <CardAction className="flex items-center gap-4">
          {/* Summary Stats */}
          <div className="hidden md:flex sr-only items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: 'var(--chart-1)' }}
              />
              <span className="text-muted-foreground">Votes:</span>
              <span className="font-medium">{totals.votes}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: 'var(--chart-2)' }}
              />
              <span className="text-muted-foreground">Destinasi:</span>
              <span className="font-medium">{totals.destinations}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: 'var(--chart-3)' }}
              />
              <span className="text-muted-foreground">Artikel:</span>
              <span className="font-medium">{totals.articles}</span>
            </div>
          </div>

          {/* Time Range Selector */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className=" rounded-xl sm:ml-auto"
              aria-label="Pilih rentang waktu"
            >
              <SelectValue placeholder="3 bulan terakhir" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-xl">
                3 bulan terakhir
              </SelectItem>
              <SelectItem value="30d" className="rounded-xl">
                30 hari terakhir
              </SelectItem>
              <SelectItem value="7d" className="rounded-xl">
                7 hari terakhir
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 min-h-[300px] h-full content-center sm:px-6 sm:pt-6">
        {filteredData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto max-h-[250px] h-full w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillVotes" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillDestinations"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillArticles" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-3)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-3)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('id-ID', {
                    month: 'short',
                    day: 'numeric',
                  })
                }}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    }}
                    indicator="dot"
                  />
                }
              />

              <Area
                dataKey="votes"
                type="monotone"
                fill="url(#fillVotes)"
                stroke="var(--chart-1)"
                strokeWidth={2}
                stackId="a"
              />

              <Area
                dataKey="destinations"
                type="monotone"
                fill="url(#fillDestinations)"
                stroke="var(--chart-2)"
                strokeWidth={2}
                stackId="a"
              />

              <Area
                dataKey="articles"
                type="monotone"
                fill="url(#fillArticles)"
                stroke="var(--chart-3)"
                strokeWidth={2}
                stackId="a"
              />

              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="text-center aspect-auto content-center min-h-[250px] w-full text-muted-foreground">
            <LucideChartNoAxesCombined className="size-6 m-auto mb-3" />
            <p className="text-lg font-medium">Tidak ada data</p>
            <p className="text-sm">Pilih rentang waktu yang berbeda</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
