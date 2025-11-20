"use client";

import React from "react";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardAction,
  CardTitle,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import {
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"

import { type DateRange } from "react-day-picker"

export interface MachineData {
  machine: string;
  ok: number;
  ng: number;
  retry: number;
  okYear: number;
  ngYear: number;
  retryYear: number;
  rateRetry: number;
  rateRetryYear: number;
}

interface AAChartProps {
  data?: MachineData[];
  loading?: boolean;
  chartConfig?: ChartConfig;
}

const dummyDataRaw: [string, number, number, number, number, number, number][] = [
  ["2", 180, 0, 1, 31238, 25, 493],
  ["3", 0, 0, 0, 19892, 39, 772],
  ["4", 0, 0, 0, 20156, 14, 469],
  ["5", 195, 0, 1, 23175, 26, 502],
  ["7", 205, 0, 3, 23533, 40, 785],
  ["8", 159, 0, 4, 31165, 9, 331],
  ["9", 170, 0, 3, 28248, 15, 1043],
  ["10", 191, 0, 6, 29852, 94, 816],
  ["11", 0, 0, 0, 472, 0, 19],
];

const dummyData: MachineData[] = dummyDataRaw.map((d) => {
  const [machine, ok, ng, retry, okYear, ngYear, retryYear] = d;

  const totalDaily = ok + retry;
  const totalYearly = okYear + retryYear;

  const dailyRate =
    totalDaily > 10 ? (retry / totalDaily) * 100 : 0;

  const yearlyRate =
    totalYearly > 10 ? (retryYear / totalYearly) * 100 : 0;

  return {
    machine: `AA-${machine}`,
    ok,
    ng,
    retry,
    okYear,
    ngYear,
    retryYear,
    rateRetry: dailyRate,
    rateRetryYear: yearlyRate,
  };
});


const AAChart: React.FC<AAChartProps> = ({
  data = dummyData,
  loading = false,
  chartConfig = {},
}) => {
  const [openCalendar, setOpenCalendar] = React.useState(false)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [timeRange, setTimeRange] = React.useState("30d")

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Analytic Report</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Result report for 20 November 2025
          </span>
        </CardDescription>
        <CardAction>
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
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="w-full h-[400px]">
          {loading ? (
            <div className="flex w-full h-full justify-center items-center gap-2">
              <p>Loading...</p>
            </div>
          ) : (
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="machine"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
              />

              <YAxis
                yAxisId="left"
                label={{ value: "Counts", angle: -90, position: "insideLeft" }}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: "Rate (%)", angle: 90, position: "insideRight" }}
              />

              <Bar 
                yAxisId="left" 
                dataKey="ok" 
                stackId="a" 
                fill="var(--primary)">
                <LabelList dataKey="ok" position="inside" fill="white" fontWeight="bold" />
              </Bar>
              <Bar yAxisId="left" dataKey="retry" stackId="a" fill="red">
                <LabelList dataKey="retry" position="inside" fill="white" fontWeight="bold" />
              </Bar>

              <Line
                yAxisId="right"
                type="linear"
                dataKey="rateRetry"
                stroke="red"
                strokeWidth={2}
                dot={{ r: 4 }}
              >
                <LabelList
                  dataKey="rateRetry"
                  position="top"
                  formatter={(v: number) => (v === 0 ? "NA" : `${v.toFixed(1)}%`)}
                  fill="red"
                />
              </Line>

              <Line
                yAxisId="right"
                type="linear"
                dataKey="rateRetryYear"
                stroke="green"
                strokeWidth={2}
                dot={{ r: 4 }}
              >
                <LabelList
                  dataKey="rateRetryYear"
                  position="top"
                  formatter={(v: number) => (v === 0 ? "NA" : `${v.toFixed(1)}%`)}
                  fill="green"
                />
              </Line>

              <ChartTooltip
                content={<ChartTooltipContent labelFormatter={(value) => value} />}
              />
            </ComposedChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AAChart;
