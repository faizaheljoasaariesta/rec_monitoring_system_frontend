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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
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
import { IconFileTypePdf, IconFileSpreadsheet } from "@tabler/icons-react"

import { Calendar } from "@/components/ui/calendar"

import { type DateRange } from "react-day-picker"
import { getAnalytic } from "@/services/api/reports/aa-reports";
import { getAIQTAnalytic } from "@/services/api/reports/aiqt-reports";
import { getBIQTAnalytic } from "@/services/api/reports/biqt-reports";

import { exportChartPDF } from "@/services/pdf/generate-daily-report";
import { exportChartExcel } from "@/services/excel/generate-daily-report"

import { useAppSource } from "@/contexts/app-source-provider"
import { toast } from "sonner";
import type { MachineDataAnalytic } from "@/types/report";

const titleMapping: Record<string, String> = {
  RG_AA_IOT: "AA IOT",
  RG_AIQT_IOT: "AIQT IOT",
  RG_BIQT_IOT: "BIQT IOT",
}

interface AAChartProps {
  data?: MachineDataAnalytic[];
  loading?: boolean;
  chartConfig?: ChartConfig;
}

const transformApiToMachineData = (items: any[]): MachineDataAnalytic[] => {
  return items.map((item) => {
    const ok = Number(item.OK);
    const retry = Number(item.RETRY);
    const okYear = Number(item.OK_YEAR);
    const retryYear = Number(item.RETRY_YEAR);

    const totalDaily = ok + retry;
    const totalYearly = okYear + retryYear;

    const dailyRate = totalDaily > 10 ? (retry / totalDaily) * 100 : 0;
    const yearlyRate = totalYearly > 10 ? (retryYear / totalYearly) * 100 : 0;

    return {
      machine: `Machine-${item.MACHINE_ID}`,
      ok,
      ng: Number(item.NG),
      retry,
      okYear,
      ngYear: Number(item.NG_YEAR),
      retryYear,
      rateRetry: dailyRate,
      rateRetryYear: yearlyRate,
    };
  });
};

const ChartAnalyticReport: React.FC<AAChartProps> = ({
  chartConfig = {},
}) => {
  const [chartData, setChartData] = React.useState<MachineDataAnalytic[]>();
  
  const [loadingData, setLoadingData] = React.useState(false);
  const [openCalendar, setOpenCalendar] = React.useState(false);
  const [date, setDate] = React.useState('Yesterday');
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  const chartRef = React.useRef<HTMLDivElement>(null);

  const { appSource } = useAppSource();

  const today = new Date();

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  const oneMonthBeforeToday = new Date()
  oneMonthBeforeToday.setMonth(oneMonthBeforeToday.getMonth() - 1)

  React.useEffect(() => {
    const fetchInitial = async () => {
      setLoadingData(true);
      window.startTopLoading();
      try {
        const formatLocalDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };
        
        const start = formatLocalDate(twoDaysAgo);
        const end = formatLocalDate(yesterday);

        const apiMapping: Record<string, Function> = {
          RG_AA_IOT: getAnalytic,
          RG_AIQT_IOT: getAIQTAnalytic,
          RG_BIQT_IOT: getBIQTAnalytic,
        }

        const apiFn = apiMapping[appSource] ?? getAnalytic;

        const res = await apiFn(start, end);
        const parsed = transformApiToMachineData(res.data.analytic);

        setChartData(parsed);
        
        setDateRange({
          from: twoDaysAgo,
          to: yesterday
        });

      } catch (err) {
        console.error("Error fetching analytic data:", err);
      } finally {
        setLoadingData(false);
        window.stopTopLoading();
      }
    };
  
    fetchInitial();
  }, [appSource]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Analytic Daily Report</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Result report for {date}
          </span>
        </CardDescription>
        <CardAction className="flex gap-2">
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
                mode="single"
                // disabled={{
                //   after: yesterday,
                //   before: oneMonthBeforeToday,
                // }}
                selected={dateRange?.to}
                onSelect={(selected) => {
                  if (!selected) return;

                  setDateRange({ from: selected, to: selected });

                  const formatLocalDate = (date: Date) => {
                    const y = date.getFullYear();
                    const m = String(date.getMonth() + 1).padStart(2, "0");
                    const d = String(date.getDate()).padStart(2, "0");
                    return `${y}-${m}-${d}`;
                  };

                  const end = formatLocalDate(selected);

                  const startDate = new Date(selected);
                  startDate.setDate(selected.getDate() - 1);
                  const start = formatLocalDate(startDate);

                  setLoadingData(true);

                  const apiMapping: Record<string, Function> = {
                    RG_AA_IOT: getAnalytic,
                    RG_AIQT_IOT: getAIQTAnalytic,
                    RG_BIQT_IOT: getBIQTAnalytic,
                  }

                  const apiFn = apiMapping[appSource] ?? getAnalytic;

                  apiFn(start, end)
                    .then((res: { data: { analytic: any[]; date: {startDate: string, endDate: string}; }; }) => {
                      const parsed = transformApiToMachineData(res.data.analytic);
                      setChartData(parsed);

                      const raw = res.data.date;
                      let display = "";

                      if (Array.isArray(raw) && raw.length >= 2 && raw[0] && raw[1]) {
                        display = `${raw[0]} → ${raw[1]}`;
                      } else if (Array.isArray(raw) && raw.length === 1 && raw[0]) {
                        display = raw[0];
                      } else {
                        display = end;
                      }

                      setDate(display);
                    })
                    .catch((err: any) => console.error(err))
                    .finally(() => setLoadingData(false));
                }}
                className="rounded-lg shadow-sm"
              />
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden items-center gap-2 h-9 rounded-md @[767px]/card:flex"
              >
                Export
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  try {
                    if (!chartRef.current) {
                      console.error("Chart container not found")
                      return
                    }
  
                    exportChartPDF(chartData || [], chartRef.current, {
                      title: `Analytic Daily Report: ${titleMapping[appSource]}`,
                      dateRange,
                      dataType: `${titleMapping[appSource]}`,
                    })

                    toast.success("PDF exported successfully.");
                  } catch {
                    toast.error("Failed to export PDF.");
                  }
                }}
              >
                <IconFileTypePdf className="size-4 text-red-500" />
                Export PDF
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => {
                  try {
                    exportChartExcel(chartData || [], {
                      title: `Analytic Daily Report: ${titleMapping[appSource]}`,
                      dateRange,
                      dataType: `${titleMapping[appSource]}`,
                    })

                    toast.success("Excel file exported successfully.")
                  } catch {
                    toast.error("Failed to export Excel file.")
                  }
                }}
              >
                <IconFileSpreadsheet className="size-4 text-green-600" />
                Export Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer ref={chartRef} config={chartConfig} className="w-full h-[400px]">
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

export default ChartAnalyticReport;
