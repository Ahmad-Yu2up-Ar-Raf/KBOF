'use client'

import * as React from 'react'
import { ChartPieIcon } from 'lucide-react'
import { Label, Pie, PieChart, Sector } from 'recharts'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/fragments/shadcn-ui/chart'
import { cn } from '@/lib/utils'
import { distributionColors } from '@/config/chart/analytics-chart-config'

// ============================================
// TYPES
// ============================================

export interface DistributionData {
  name: string
  count: number
}

interface ChartDistributionProps {
  data: DistributionData[]
  chartConfig: ChartConfig
  title?: string
  description?: string
  nameKey?: string
  className?: string
  emptyMessage?: string
  footerDescription?: string
}

// ============================================
// COMPONENT
// ============================================

export function ChartDistribution({
  data,
  chartConfig,
  title = 'Distribusi Data',
  description = 'Top 5 distribusi',
  nameKey = 'Data',
  className,
  emptyMessage = 'data',
  footerDescription,
}: ChartDistributionProps) {
  // Calculate total
  const total = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0)
  }, [data])

  // Transform data untuk recharts dengan warna dinamis
  const chartData = React.useMemo(() => {
    return data.map((item, index) => ({
      name: item.name,
      count: item.count,
      fill: distributionColors[index % distributionColors.length],
      label: chartConfig[item.name]?.label || item.name,
      percentage: total > 0 ? ((item.count / total) * 100).toFixed(1) : '0',
    }))
  }, [data, chartConfig, total])

  // Get highest item
  const highest = chartData[0]

  // Empty state
  if (data.length === 0 || total === 0) {
    return (
      <Card className={cn('flex flex-col w-full', className)}>
        <CardHeader className="space-y-0 border-b py-3">
          <CardTitle className="line-clamp-1 text-base">{title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[250px]">
          <div className="text-center text-muted-foreground">
            <ChartPieIcon className="size-8 m-auto mb-3" />
            <p className="text-lg font-medium">Belum ada {emptyMessage}</p>
            <p className="text-sm">
              Tambah data untuk melihat distribusi {emptyMessage}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('flex flex-col py-3 w-full', className)}>
      <CardHeader className="space-y-0  gap-0 border-b py-3">
        <CardTitle className="line-clamp-1 text-base">{title}</CardTitle>
        <CardDescription className="line-clamp-1">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pt-0 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto  pt-0 aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {nameKey}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend
              formatter={(value) => (
                <span className="capitalize ">
                  {chartConfig[value as keyof typeof chartConfig]?.label ||
                    value}
                </span>
              )}
              content={
                <ChartLegendContent
                  className=" "
                  nameKey="name"
                  payload={chartData.map((item) => ({
                    value: item.name,
                    color: item.fill,
                  }))}
                />
              }
              className=" flex-wrap gap-x-4   gap-y-2   *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      {/* {footerDescription && (
        <CardFooter className="flex-col gap-2 text-sm pt-4">
          {highest && (
            <div className="flex items-center gap-2 font-medium leading-none">
              {highest.label} tertinggi dengan {highest.percentage}%
            </div>
          )}
          <div className="leading-none text-muted-foreground">
            {footerDescription}
          </div>
        </CardFooter>
      )} */}
    </Card>
  )
}
