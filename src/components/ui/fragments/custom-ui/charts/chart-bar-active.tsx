'use client'

import { DoorOpen, LucideChartColumn, TrendingUp } from 'lucide-react'
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
import { TopDestination } from '@/types'

// Interface untuk props komponen
interface DynamicBarChartProps {
  data: TopDestination[]
  title?: string
  description?: string
  footerText?: string
  trendingPercentage?: number
  className?: string
  subFooter?: string
}

// Fungsi untuk generate warna dinamis
const generateColors = (length: number): string[] => {
  const baseColors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ]

  return [...baseColors]
}

export function ChartBarActive({
  data,
  title = 'Motor Chart - most expensive',
  description = 'Showing top 5 Motor with the most expensive',
  footerText = 'Showing user data',
  subFooter = '',
  trendingPercentage = 0,
  className,
}: DynamicBarChartProps) {
  // Transform data untuk chart dan config
  const { chartData, chartConfig } = useMemo(() => {
    const colors = generateColors(data.length)

    const transformedData = data.map((item, index) => ({
      nama_jurusan: item.nama_jurusan,
      siswas_count: item.siswas_count,
      fill: colors[index],
    }))

    // Generate dynamic config
    const config: ChartConfig = {
      siswas_count: {
        label: 'Siswa ',
      },
    }

    // Add config untuk setiap item data
    data.forEach((item, index) => {
      const key = item.nama_jurusan.toLowerCase().replace(/\s+/g, '_')
      config[key] = {
        label: item.nama_jurusan,
        color: colors[index],
      }
    })

    return {
      chartData: transformedData,
      chartConfig: config,
    }
  }, [data])

  if (chartData.length === 0) {
    return (
      <Card className={cn('flex flex-col  w-full', className)}>
        <CardHeader className=" space-y-0 border-b py-1 ">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[40dvh]">
          <div className="text-center text-muted-foreground">
            <LucideChartColumn className="  size-6 m-auto mb-3 " />
            <p className="text-lg font-medium">No Data found</p>
            <p className="text-sm">Add Motors to see the distribution</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('flex flex-col  w-full', className)}>
      <CardHeader className=" space-y-0 border-b py-1 ">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className=" w-full pb-0 h-full">
        <ChartContainer className="w-full h-full" config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="nama_jurusan"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                // Potong nama jika terlalu panjang
                return value.length > 10
                  ? `${value.substring(0, 10)}...`
                  : value
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="siswas_count"
              strokeWidth={2}
              radius={8}
              barSize={chartData.length <= 3 ? 40 : undefined}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                )
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col  items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">{footerText}</div>
        <div className="text-muted-foreground leading-none">{subFooter}</div>
      </CardFooter>
    </Card>
  )
}
