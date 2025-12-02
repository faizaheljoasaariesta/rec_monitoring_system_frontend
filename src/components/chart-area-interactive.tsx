"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, Bar, BarChart, Line, LineChart, LabelList } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
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
import { Calendar as CalendarIcon, BarChart3, LineChart as LineChartIcon, Layers } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { getSummaryDaily } from "@/services/api/aa-reports"
import { getAIQTSummaryDaily } from "@/services/api/aiqt-reports"
import { getBIQTSummaryDaily } from "@/services/api/biqt-reports"
import { getProduct } from "@/services/api/aa-reports"
import { getAIQTProduct } from "@/services/api/aiqt-reports"
import { getBIQTProduct } from "@/services/api/biqt-reports"
import { Calendar } from "@/components/ui/calendar"
import { Combobox, type ComboboxItem } from "./combo-box"

import { useAppSource } from "@/contexts/AppSourceContext"

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

interface RawDailyData {
  test_date: string;
  total_ok: number;
  total_ng: number;
  total_retry: number;
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [chartData, setChartData] = React.useState<ChartData[]>([])
  const [productList, setProductList] = React.useState<ComboboxItem[]>([])
  const [selectedProduct, setSelectedProduct] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [openCalendar, setOpenCalendar] = React.useState(false)
  const [openChartStyle, setOpenChartStyle] = React.useState(false)
  const [chartType, setChartType] = React.useState<"area" | "line" | "tooltip">("tooltip")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [filterChart, setFilterChart] = React.useState("Total All Test")

  const { appSource } = useAppSource();


  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

  React.useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      window.startTopLoading()

      try {
        const apiMapping: Record<string, Function> = {
          RG_AA_IOT: getProduct,
          RG_AIQT_IOT: getAIQTProduct,
          RG_BIQT_IOT: getBIQTProduct,
        }

        const apiFn = apiMapping[appSource] ?? getProduct;
  
        const response = await apiFn();
        const products = response.data.product
          .filter(Boolean)
          .map((p: string) => ({ value: p as string, label: p as string }))
        setProductList(products)
      } catch (err) {
        console.error("Failed to fetch chart data:", err)
      } finally {
        setLoading(false)
        window.stopTopLoading()
      }
    }

    fetchProduct()
  }, [appSource])

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true)
  //     try {
  //       let start: string
  //       let end: string

  //       if (timeRange === "custom" && dateRange?.from && dateRange?.to) {
  //         start = dateRange.from.toISOString().split("T")[0]
  //         end = dateRange.to.toISOString().split("T")[0]
  //       } else {
  //         const now = new Date()
  //         let days = 30
  //         if (timeRange === "7d") days = 7
  //         if (timeRange === "90d") days = 90

  //         const endDate = now.toISOString().split("T")[0]
  //         const startDate = new Date(now)
  //         startDate.setDate(startDate.getDate() - days)
  //         start = startDate.toISOString().split("T")[0]
  //         end = endDate
  //       }

  //       localStorage.setItem("chart-time-range", timeRange)
  //       if (dateRange)
  //         localStorage.setItem("chart-date-range", JSON.stringify(dateRange))
  //       localStorage.setItem("chart-range", JSON.stringify({ start, end }))

  //       window.dispatchEvent(new Event("chart-range-updated"))

  //       const response = await getSummaryDaily(start, end, selectedProduct)
  //       console.log(start, end, selectedProduct)
  //       const formatted = response.data.map((item: any) => ({
  //         date: new Date(item.test_date).toISOString().split("T")[0],
  //         rateOK: item.total_ok,
  //         rateNG: item.total_ng,
  //         rateRetry: item.total_retry,
  //       }))
  //       setChartData(formatted)
  //       console.log(chartData)
  //     } catch (err) {
  //       console.error("Failed to fetch chart data:", err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchData()
  // }, [timeRange, dateRange, selectedProduct])

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      window.startTopLoading();

      const formatLocalDate = (d: Date) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }
      
      try {
        let start: string;
        let end: string;
  
        if (timeRange === "custom" && dateRange?.from && dateRange?.to) {
          start = formatLocalDate(dateRange.from);
          end = formatLocalDate(dateRange.to);
        } else {
          const now = new Date();
          let days = 30;
          if (timeRange === "7d") days = 7;
          if (timeRange === "90d") days = 90;
  
          const endDate = now.toISOString().split("T")[0];
          const startDate = new Date(now);
          startDate.setDate(startDate.getDate() - days);
  
          start = startDate.toISOString().split("T")[0];
          end = endDate;
        }
  
        localStorage.setItem("chart-time-range", timeRange);
        if (dateRange) localStorage.setItem("chart-date-range", JSON.stringify(dateRange));
        localStorage.setItem("chart-range", JSON.stringify({ start, end }));
  
        window.dispatchEvent(new Event("chart-range-updated"));

        const apiMapping: Record<string, Function> = {
          RG_AA_IOT: getSummaryDaily,
          RG_AIQT_IOT: getAIQTSummaryDaily,
          RG_BIQT_IOT: getBIQTSummaryDaily,
        }

        const apiFn = apiMapping[appSource] ?? getSummaryDaily;
  
        const response = await apiFn(start, end, selectedProduct);
        const rawData = response.data;
  
        const generateDateRange = (startDate: string, endDate: string) => {
          const dates = [];
          const current = new Date(startDate);
          const endD = new Date(endDate);
          while (current <= endD) {
            dates.push(current.toISOString().split("T")[0]);
            current.setDate(current.getDate() + 1);
          }
          return dates;
        };
  
        const allDates = generateDateRange(start, end);
  
        const dataMap = new Map<string, RawDailyData>(
          rawData.map((item: RawDailyData) => [
            new Date(item.test_date).toISOString().split("T")[0],
            item,
          ])
        );
  
        const filledData = allDates.map((date) => {
          const item = dataMap.get(date);
          return {
            date,
            rateOK: item ? item.total_ok : 0,
            rateNG: item ? item.total_ng : 0,
            rateRetry: item ? item.total_retry : 0,
          };
        });
  
        setChartData(filledData);
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
      } finally {
        setLoading(false);
        window.stopTopLoading();
      }
    };
  
    fetchData();
  }, [timeRange, dateRange, selectedProduct, appSource]);

  const getFilteredDataKey = () => {
    if (filterChart === "(NG) Test") return "rateNG"
    if (filterChart === "(Retry) Test") return "rateRetry"
    return false
  }

  const filteredDataKey = getFilteredDataKey()

  return (
    <Card className="@container/card">
      <CardHeader>
        {loading ? (
          <Skeleton className="h-5 w-20 rounded-full" />
        ) : (
          <div className="hidden md:flex">
            <Select value={filterChart} onValueChange={setFilterChart}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Total All Test">Total All Test</SelectItem>
                <SelectItem value="(NG) Test">(NG) Test</SelectItem>
                <SelectItem value="(Retry) Test">(Retry) Test</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

          <Combobox 
            items={productList}
            value={selectedProduct}
            onChange={setSelectedProduct}
            loading={loading}
          />

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
                disabled={{
                  after: new Date(),
                }}
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range)
                  if (range?.from && range?.to) {
                    setTimeRange("custom")
                    console.log(range)
                    console.log(dateRange)
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
                <LineChartIcon className="w-4 h-4" />
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
                  <LineChartIcon className="w-4 h-4 mr-2" />
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

              {(
                filteredDataKey
                  ? [filteredDataKey]
                  : ["rateRetry", "rateNG", "rateOK"]
              ).map((key, index, arr) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={`var(--color-${key})`}
                  radius={
                    arr.length === 1
                      ? [4, 4, 4, 4]
                      : index === 0
                      ? [0, 0, 4, 4]
                      : index === arr.length - 1
                      ? [4, 4, 0, 0]
                      : [0, 0, 0, 0]
                  }
                />
              ))}

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
          ) : chartType === "area" ? (
            <AreaChart data={chartData}>
              <defs>
                {["rateOK", "rateNG", "rateRetry"].map((key) => (
                  <linearGradient key={key} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={chartType === "area" ? 1 : 0} />
                    <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.1} />
                  </linearGradient>
                ))}
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

              {(
                filteredDataKey
                  ? [filteredDataKey]
                  : ["rateRetry", "rateNG", "rateOK"]
              ).map((key) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="natural"
                  fill={`url(#fill${key})`}
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  stackId="a"
                />
              ))}
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 0, left: 20 }}>
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

              {/* {(
                filteredDataKey
                  ? [filteredDataKey]
                  : ["rateRetry", "rateNG", "rateOK"]
              ).map((key) => (
                <Line
                  key={key}
                  type="linear"
                  dataKey={key}
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Line>
              ))} */}

              {(
                filteredDataKey
                  ? [filteredDataKey]
                  : ["rateRetry", "rateNG", "rateOK"]
              ).map((key) => (
                <Line
                  key={key}
                  type="linear"
                  dataKey={key}
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                >
                  {(key === "rateNG" || key === "rateOK" || filteredDataKey === "rateRetry") && (
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  )}
                </Line>
              ))}
            </LineChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}