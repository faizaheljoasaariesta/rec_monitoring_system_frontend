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
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { IconFileTypePdf, IconFileSpreadsheet } from "@tabler/icons-react"

import { getAAFocusAnalytic } from "@/services/api/reports/aa-reports";
import { getAIQTFocusAnalytic } from "@/services/api/reports/aiqt-reports";
import { getBIQTFocusAnalytic } from "@/services/api/reports/biqt-reports";

import { useAppSource } from "@/contexts/app-source-provider"
import { MachineTable } from "@/components/table/machine-table";
import { ComboBoxConfig } from "@/components/combo-box/combo-box-config";
import { exportChartMachinePDF } from "@/services/pdf/generate-machine-report";
import { exportChartMachineExcel } from "@/services/excel/generate-machine-report";
import { toast } from "sonner";
import type { MachineData } from "@/types/report";

const titleMapping: Record<string, String> = {
  RG_AA_IOT: "AA IOT",
  RG_AIQT_IOT: "AIQT IOT",
  RG_BIQT_IOT: "BIQT IOT",
}

interface ChartProps {
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

const machineMapping: Record<string, string[]> = {
  RG_AA_IOT: ["2", "3", "4", "5", "7", "8", "9", "10", "11"],
  RG_AIQT_IOT: ["1", "2", "3"],
  RG_BIQT_IOT: ["1", "2", "3"],
};

const ChartMachineReport: React.FC<ChartProps> = ({
  chartConfig = {},
}) => {
  const [chartData, setChartData] = React.useState<MachineData[]>();
  const [loadingData, setLoadingData] = React.useState(false);
  const [machineId, setMachineID] = React.useState("2");
  const [interval, setInterval] = React.useState("15");

  const chartRef = React.useRef<HTMLDivElement>(null);

  const { appSource } = useAppSource();

  const today = new Date();

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - Number(interval))

  React.useEffect(() => {
    const fetchInitial = async () => {
      setLoadingData(true);
      window.startTopLoading();

      try {
        const apiMapping: Record<string, Function> = {
          RG_AA_IOT: getAAFocusAnalytic,
          RG_AIQT_IOT: getAIQTFocusAnalytic,
          RG_BIQT_IOT: getBIQTFocusAnalytic,
        }

        const apiFn = apiMapping[appSource] ?? getAAFocusAnalytic;

        const res = await apiFn(machineId, interval);

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
  }, [interval, machineId, appSource]);

  React.useEffect(() => {
    const defaultMachine = machineMapping[appSource]?.[0] ?? "1";
    setMachineID(defaultMachine);
  }, [appSource]);
  

  return (
    <>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Analytic Machine Report</CardTitle>
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
            
            <ComboBoxConfig
              appSource={appSource}
              value={machineId}
              onChange={(v) => setMachineID(v)}
            />

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
    
                      exportChartMachinePDF(chartData || [], chartRef.current, {
                        title: `Analytic Machine Report: ${titleMapping[appSource]}`,
                        interval,
                        machineId,
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
                      exportChartMachineExcel(chartData || [], {
                        title: `Analytic Daily Report: ${titleMapping[appSource]}`,
                        interval,
                        machineId,
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
      {chartData && <MachineTable data={chartData} />}
    </>
  )
}

export default ChartMachineReport;