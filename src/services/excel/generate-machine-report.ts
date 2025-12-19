import * as XLSX from "xlsx"
import type { MachineData } from "@/components/chart/chart-machine-report"

interface ExportExcelOptions {
  title?: string
  interval?: string
  machineId?: string
  dataType?: string
}

export const exportChartMachineExcel = (
  data: MachineData[],
  options: ExportExcelOptions = {}
) => {
  if (!data || data.length === 0) return
  let metaRows;

  if (options.machineId) {
    metaRows = [
      ["Report Title", options.title ?? "Analytic Daily Report"],
      ["Interval", options.interval ?? "-"],
      ["Machine ID", options.machineId ?? "-"],
      ["Data Type", options.dataType ?? "-"],
      [],
    ]
  } else {
    metaRows = [
      ["Report Title", options.title ?? "Analytic Daily Report"],
      ["Interval", options.interval ?? "-"],
      ["Data Type", options.dataType ?? "-"],
      [],
    ]
  }

  const tableHeader = [
    [
      "Date",
      "OKCount",
      "NGCount",
      "OKCountYear",
      "NGCountYear",
      "NGRate (%)",
      "NGYearRate (%)",
    ],
  ]

  const tableRows = data.map((d) => [
    d.date,
    d.OKCount,
    d.NGCount,
    d.OKCountYear,
    d.NGCountYear,
    Number(d.NGRate.toFixed(2)),
    Number(d.NGYearRate.toFixed(2)),
  ])

  const worksheetData = [
    ...metaRows,
    ...tableHeader,
    ...tableRows,
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

  worksheet["!cols"] = [
    { wch: 18 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
    { wch: 14 },
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Analytic Report")

  XLSX.writeFile(
    workbook,
    `${options.title ?? "Analytic_Report"}.xlsx`
  )
}
