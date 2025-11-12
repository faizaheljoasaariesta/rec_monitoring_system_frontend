"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, Bar, BarChart } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Calendar as CalendarIcon, BarChart3, LineChart, Layers } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { getSummaryDaily } from "@/services/aaIotService"
import { Calendar } from "@/components/ui/calendar"
import { Combobox } from "./combo-box"

export const description = "An interactive area chart"

const chartConfig = {
  rateOK: { label: "Test (OK)", color: "var(--primary)" },
  rateNG: { label: "Test (NG)", color: "var(--childprimary)" },
  rateRetry: { label: "Test (Retry)", color: "var(--subprimary)" },
} satisfies ChartConfig

interface ChartData {
  date: string
  rateOK: number
  rateNG: number
  rateRetry: number
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartData, setChartData] = React.useState<ChartData[]>([])
  const [loading, setLoading] = React.useState(false)
  const [openCalendar, setOpenCalendar] = React.useState(false)
  const [openChartStyle, setOpenChartStyle] = React.useState(false)
  const [chartType, setChartType] = React.useState<"area" | "line" | "tooltip">("area")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        let start: string
        let end: string

        if (timeRange === "custom" && dateRange?.from && dateRange?.to) {
          start = dateRange.from.toISOString().split("T")[0]
          end = dateRange.to.toISOString().split("T")[0]
        } else {
          const referenceDate = new Date()
          let daysToSubtract = 90
          if (timeRange === "30d") daysToSubtract = 30
          else if (timeRange === "7d") daysToSubtract = 7

          const endDate = referenceDate.toISOString().split("T")[0]
          const startDate = new Date(referenceDate)
          startDate.setDate(startDate.getDate() - daysToSubtract)
          start = startDate.toISOString().split("T")[0]
          end = endDate
        }

        const response = await getSummaryDaily(start, end)
        const formatted = response.data.map((item: any) => ({
          date: new Date(item.test_date).toISOString().split("T")[0],
          rateOK: item.total_ok,
          rateNG: item.total_ng,
          rateRetry: item.total_retry,
        }))
        setChartData(formatted)
      } catch (err) {
        console.error("Failed to fetch chart data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange, dateRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        {loading ? (
          <Skeleton className="h-5 w-20 rounded-full" />
        ) : (
          <CardTitle>Total Test</CardTitle>
        )}
        {loading ? (
          <Skeleton className="h-4 w-28 rounded-full" />
        ) : (
          <CardDescription>
            {timeRange === "7d"
              ? "Last 7 days"
              : timeRange === "30d"
              ? "Last 30 days"
              : timeRange === "90d"
              ? "Last 3 months"
              : dateRange?.from && dateRange?.to
              ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
              : "Custom range"}
          </CardDescription>
        )}

        <CardAction className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>

          <Combobox />

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>

          <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden items-center gap-2 h-9 rounded-md @[767px]/card:flex"
              >
                <CalendarIcon className="w-4 h-4" />
                Calendar
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-2 w-auto"
              align="end"
            >
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range)
                  if (range?.from && range?.to) {
                    setTimeRange("custom")
                  }
                }}
                className="rounded-lg shadow-sm"
              />
            </PopoverContent>
          </Popover>

          <Popover open={openChartStyle} onOpenChange={setOpenChartStyle}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden items-center gap-2 h-9 rounded-md @[767px]/card:flex"
              >
                <LineChart className="w-4 h-4" />
                Chart Style
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-2 w-40"
              align="end"
            >
              <div className="flex flex-col space-y-1">
                <Button
                  variant={chartType === "area" ? "default" : "ghost"}
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    setChartType("area")
                    setOpenChartStyle(false)
                  }}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Area Chart
                </Button>
                <Button
                  variant={chartType === "line" ? "default" : "ghost"}
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    setChartType("line")
                    setOpenChartStyle(false)
                  }}
                >
                  <LineChart className="w-4 h-4 mr-2" />
                  Line Chart
                </Button>
                <Button
                  variant={chartType === "tooltip" ? "default" : "ghost"}
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    setChartType("tooltip")
                    setOpenChartStyle(false)
                  }}
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Tooltip View
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          {loading ? (
            <div className="flex w-full h-full gap-2 justify-center items-center">
              <Spinner className="size-6" />
              <p>Loading...</p>
            </div>
          ) : chartType === "tooltip" ? (
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <Bar
                dataKey="rateRetry"
                stackId="a"
                fill="var(--color-rateRetry)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="rateNG"
                stackId="a"
                fill="var(--color-rateNG)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="rateOK"
                stackId="a"
                fill="var(--color-rateOK)"
                radius={[4, 4, 0, 0]}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                  />
                }
                cursor={false}
                defaultIndex={1}
              />
            </BarChart>
          ) : (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillRateOK" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-rateOK)" stopOpacity={chartType === "area" ? 1 : 0} />
                  <stop offset="95%" stopColor="var(--color-rateOK)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillRateNG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-rateNG)" stopOpacity={chartType === "area" ? 0.8 : 0} />
                  <stop offset="95%" stopColor="var(--color-rateNG)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillRateRetry" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-rateRetry)" stopOpacity={chartType === "area" ? 0.8 : 0} />
                  <stop offset="95%" stopColor="var(--color-rateRetry)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="rateRetry"
                type="natural"
                fill="url(#fillRateRetry)"
                stroke="var(--color-rateRetry)"
                stackId="a"
              />
              <Area
                dataKey="rateNG"
                type="natural"
                fill="url(#fillRateNG)"
                stroke="var(--color-rateNG)"
                stackId="a"
              />
              <Area
                dataKey="rateOK"
                type="natural"
                fill="url(#fillRateOK)"
                stroke="var(--color-rateOK)"
                stackId="a"
              />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}