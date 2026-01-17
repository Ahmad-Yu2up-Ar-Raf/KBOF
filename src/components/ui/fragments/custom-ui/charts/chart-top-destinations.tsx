'use client'

import { LucideChartColumn, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from 'recharts'
import { useMemo } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/fragments/shadcn-ui/chart'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================

export interface TopDestinationData {
  id: number
  name: string
  slug: string
  coverImage: string | null
  provinsi: string
  voteCount: number
}

interface ChartTopDestinationsProps {
  data: TopDestinationData[]
  title?: string
  description?: string
  footerText?: string
  subFooter?: string
  className?: string
}

// ============================================
// COLORS
// ============================================

const chartColors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

// ============================================
// COMPONENT
// ============================================

export function ChartTopDestinations({
  data,
  title = 'Top Destinasi',
  description = 'Destinasi dengan votes terbanyak',
  footerText = 'Berdasarkan jumlah votes',
  subFooter = 'Menampilkan top destinasi populer',
  className,
}: ChartTopDestinationsProps) {
  // Transform data for chart
  const { chartData, chartConfig } = useMemo(() => {
    const transformedData = data.slice(0, 5).map((item, index) => ({
      name: item.name,
      voteCount: item.voteCount,
      fill: chartColors[index % chartColors.length],
    }))

    // Generate dynamic config
    const config: ChartConfig = {
      voteCount: {
        label: 'Votes',
      },
    }

    // Add config for each item
    data.slice(0, 5).forEach((item, index) => {
      const key = item.name.toLowerCase().replace(/\s+/g, '_')
      config[key] = {
        label: item.name,
        color: chartColors[index % chartColors.length],
      }
    })

    return {
      chartData: transformedData,
      chartConfig: config,
    }
  }, [data])

  const totalVotes = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.voteCount, 0)
  }, [data])

  // Empty state
  if (chartData.length === 0) {
    return (
      <Card className={cn('flex flex-col w-full', className)}>
        <CardHeader className="space-y-0 border-b py-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[35lvh]">
          <div className="text-center text-muted-foreground">
            <LucideChartColumn className="size-8 m-auto mb-3" />
            <p className="text-lg font-medium">Belum ada destinasi</p>
            <p className="text-sm">Tambahkan destinasi untuk melihat ranking</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('flex flex-col w-full', className)}>
      <CardHeader className="space-y-0 border-b py-1">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="w-full pb-0 h-full">
        <ChartContainer
          className="w-full h-full min-h-[200px]"
          config={chartConfig}
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                // Truncate long names
                return value.length > 12
                  ? `${value.substring(0, 12)}...`
                  : value
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="voteCount"
              strokeWidth={2}
              radius={8}
              barSize={chartData.length <= 3 ? 50 : undefined}
              activeBar={({ ...props }) => (
                <Rectangle
                  {...props}
                  fillOpacity={0.8}
                  stroke={props.payload.fill}
                  strokeDasharray={4}
                  strokeDashoffset={4}
                />
              )}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {footerText}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          {subFooter} ({totalVotes.toLocaleString()} total votes)
        </div>
      </CardFooter>
    </Card>
  )
}
