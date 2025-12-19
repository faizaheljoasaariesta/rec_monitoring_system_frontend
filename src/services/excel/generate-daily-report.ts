import * as XLSX from "xlsx"
import type { MachineDataAnalytic } from "@/types/report";

interface ExportExcelOptions {
  title?: string
  dateRange?: { from?: Date; to?: Date }
  dataType?: string
}

export const exportChartExcel = (
  data: MachineDataAnalytic[],
  options: ExportExcelOptions = {}
) => {
  if (!data || data.length === 0) return

  const metaRows = [
    ["Report Title", options.title ?? "Analytic Daily Report"],
    ["Data Type", options.dataType ?? "-"],
    ["Date Range", formatDateRange(options.dateRange)],
    [],
  ]

  const tableHeader = [
    [
      "Machine",
      "OK",
      "NG",
      "Retry",
      "OK (Year)",
      "NG (Year)",
      "Retry (Year)",
      "Daily Retry (%)",
      "Yearly Retry (%)",
    ],
  ]

  const tableRows = data.map((d) => [
    d.machine,
    d.ok,
    d.ng,
    d.retry,
    d.okYear,
    d.ngYear,
    d.retryYear,
    Number(d.rateRetry.toFixed(2)),
    Number(d.rateRetryYear.toFixed(2)),
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
    { wch: 18 },
    { wch: 18 },
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Analytic Report")

  XLSX.writeFile(
    workbook,
    `${options.title ?? "Analytic_Report"}.xlsx`
  )
}

const formatDateRange = (
  range?: { from?: Date; to?: Date }
) => {
  if (!range?.from || !range?.to) return "-"
  return `${formatDate(range.from)} → ${formatDate(range.to)}`
}

const formatDate = (date: Date) => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  const hh = String(date.getHours()).padStart(2, "0")
  const mi = String(date.getMinutes()).padStart(2, "0")
  const ss = String(date.getSeconds()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
}
