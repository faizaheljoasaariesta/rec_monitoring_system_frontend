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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"

import { type DateRange } from "react-day-picker"
import { getAIRFocusAnalytic } from "@/services/api/air-reports";

export interface MachineData {
  date: string;
  NGCount: number;
  OKCount: number;
  NGCountYear: number;
  OKCountYear: number,
  NGRate: number;
  NGYearRate: number;
}

interface AAChartProps {
  data?: MachineData[];
  loading?: boolean;
  chartConfig?: ChartConfig;
}


const transformApiToMachineData = (items: any[]): MachineData[] => {
  const fy = items.find(
    (item) => String(item.date_value).toLowerCase() === "full year"
  );

  const NGCountYear = fy ? Number(fy.NG_Count) : 0;
  const OKCountYear = fy ? Number(fy.OK_Count) : 0;

  const NGYearRate =
    NGCountYear + OKCountYear > 0
      ? (NGCountYear / (NGCountYear + OKCountYear)) * 100
      : 0;

  return items
    .filter(
      (item) => String(item.date_value).toLowerCase() !== "full year"
    )
    .map((item) => {
      const date = String(item.date_value);
      const NGCount = Number(item.NG_Count);
      const OKCount = Number(item.OK_Count);

      const NGRate =
        NGCount + OKCount > 0
          ? (NGCount / (NGCount + OKCount)) * 100
          : 0;

      return {
        date,
        NGCount,
        OKCount,
        NGCountYear,
        OKCountYear,
        NGRate,
        NGYearRate,
      };
    }); 
};

const ChartAIRReport: React.FC<AAChartProps> = ({
  chartConfig = {},
}) => {
  const [chartData, setChartData] = React.useState<MachineData[]>();
  const [loadingData, setLoadingData] = React.useState(false);
  const [interval, setInterval] = React.useState("15");

  const today = new Date();

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - Number(interval))

  React.useEffect(() => {
    const fetchInitial = async () => {
      setLoadingData(true);
      window.startTopLoading();

      try {
        const res = await getAIRFocusAnalytic(interval);
        const parsed = transformApiToMachineData(res.data);
        setChartData(parsed);
      } catch (err) {
        console.error("Error fetching analytic data:", err);
      } finally {
        setLoadingData(false);
        window.stopTopLoading();
      }
    };

    fetchInitial();
  }, [interval]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Analytic Air Pressure Report</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Result report for {interval} Day Ago.
          </span>
        </CardDescription>
        <CardAction className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={interval}
            onValueChange={setInterval}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="30">Last 1 months</ToggleGroupItem>
            <ToggleGroupItem value="15">Last 15 days</ToggleGroupItem>
            <ToggleGroupItem value="7">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="w-full h-[400px]">
          {loadingData ? (
            <div className="flex w-full h-full justify-center items-center gap-2">
              <p>Loading...</p>
            </div>
          ) : (
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="date"
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
                dataKey="OKCount" 
                stackId="a" 
                fill="var(--primary)">
                <LabelList dataKey="OKCount" position="inside" fill="white" fontWeight="bold" />
              </Bar>
              <Bar yAxisId="left" dataKey="NGCount" stackId="a" fill="red">
                <LabelList dataKey="NGCount" position="inside" fill="white" fontWeight="bold" />
              </Bar>

              <Line
                yAxisId="right"
                type="linear"
                dataKey="NGRate"
                stroke="red"
                strokeWidth={2}
                dot={{ r: 4 }}
              >
                <LabelList
                  dataKey="NGRate"
                  position="top"
                  formatter={(v: number) => (v === 0 ? "NA" : `${v.toFixed(1)}%`)}
                  fill="red"
                />
              </Line>

              <Line
                yAxisId="right"
                type="linear"
                dataKey="NGYearRate"
                stroke="green"
                strokeWidth={2}
                dot={{ r: 4 }}
              >
                <LabelList
                  dataKey="NGYearRate"
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
  )

}

export default ChartAIRReport;