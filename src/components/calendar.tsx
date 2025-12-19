"use client"

import * as React from "react"
import { type DateRange } from "react-day-picker"

import { Calendar as CalenderUI } from "@/components/ui/calendar"

export default function Calendar() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(2025, 10, 3),
    to: new Date(2025, 10, 6),
  })

  return (
    <CalenderUI
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={setDateRange}
      className="rounded-lg border shadow-sm"
    />
  )
}
