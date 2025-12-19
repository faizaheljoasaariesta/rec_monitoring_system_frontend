import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconGripVertical,
  IconLayoutColumns,
  IconCircleX,
  IconAlertCircle,
  IconLoader2,
  IconCopy,
} from "@tabler/icons-react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getReportData, type ReportDataResponse } from "@/services/api/reports/aa-reports"
import { getAIQTReportData } from "@/services/api/reports/aiqt-reports"
import { getBIQTReportData } from "@/services/api/reports/biqt-reports"

import { useAppSource } from "@/contexts/app-source-provider"

export const schema = z.object({
  LOG_ID: z.number(),
  EMP_NO: z.string(),
  TRAVEL_CARD_NUMBER: z.string(),
  PRODUCT_NO: z.string(),
  LOG_FILENAME: z.string(),
  PROGRAM_NAME: z.string(),
  PROGRAM_VERSION: z.string(),
  TEST_DESC: z.string(),
  TEST_ITEM: z.string(),
  TEST_RESULT: z.string(),
  TEST_DATETIME: z.string(),
  TEST_CE0: z.string(),
  TEST_CE1: z.string(),
  TEST_UL0: z.string(),
  TEST_UL1: z.string(),
  TEST_UR0: z.string(),
  TEST_UR1: z.string(),
  TEST_BL0: z.string(),
  TEST_BL1: z.string(),
  TEST_BR0: z.string(),
  TEST_BR1: z.string(),
  TEST_L0: z.string(),
  TEST_L1: z.string(),
  TEST_R0: z.string(),
  TEST_R1: z.string(),
  TEST_Xf: z.string(),
  TEST_Yf: z.string(),
  TEST_Xi: z.string(),
  TEST_Yi: z.string(),
  TEST_FRr: z.string(),
  TEST_FRl: z.string(),
  TEST_FRb: z.string(),
  TEST_FRt: z.string(),
  CREATE_USERID: z.number(),
  CREATE_DATETIME: z.string(),
})

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.LOG_ID} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "LOG_ID",
    header: "Log ID",

    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "EMP_NO",
    header: "Employee No.",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.EMP_NO}
      </div>
    ),
  },
  {
    accessorKey: "PRODUCT_NO",
    header: "Product No.",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.PRODUCT_NO}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "TEST_ITEM",
    header: "Test Item",
    cell: ({ row }) => (
      <div className="w-40">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.TEST_ITEM}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "TEST_RESULT",
    header: "Test Result",
    cell: ({ row }) => {
      const isOK = row.original.TEST_RESULT.startsWith("OK")
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {isOK ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400 mr-1" />
          ) : (
            <IconCircleX className="text-red-500 dark:text-red-400 mr-1" />
          )}
          {row.original.TEST_RESULT}
        </Badge>
      )
    },
  },
  {
    accessorKey: "TEST_DATETIME",
    header: "Test Date",
    cell: ({ row }) => (
      <div className="text-sm">
        {new Date(row.original.TEST_DATETIME).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "UTC",
        })}
      </div>
    ),
  },
  {
    accessorKey: "LOG_FILENAME",
    header: "Log File",
    cell: ({ row }) => (
      <div className="text-sm font-mono text-muted-foreground">
        {row.original.LOG_FILENAME}
      </div>
    ),
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.LOG_ID,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

interface DataTableProps {
  startDate?: string
  endDate?: string
  selectedProduct?: string
}

export function DashboardTable({ startDate, endDate, selectedProduct }: DataTableProps) {
  const [data, setData] = React.useState<z.infer<typeof schema>[]>([])
  const [apiResponse, setApiResponse] = React.useState<ReportDataResponse | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const { appSource } = useAppSource();

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const storedChartRange = localStorage.getItem("chart-range")
      const storedProduct = localStorage.getItem("product")

      let start: string | undefined
      let end: string | undefined
      let product: string | undefined

      if (storedChartRange) {
        const parsed = JSON.parse(storedChartRange)
        start = parsed.start
        end = parsed.end
      }

      if (storedProduct) {
        product = storedProduct
      }

      if (!start || !end) {
        const storedRange = localStorage.getItem("chart-time-range") || "30d"
        const storedDateRange = localStorage.getItem("chart-date-range")

        if (storedRange === "custom" && storedDateRange) {
          const parsed = JSON.parse(storedDateRange)
          if (parsed?.from && parsed?.to) {
            start = new Date(parsed.from).toISOString().split("T")[0]
            end = new Date(parsed.to).toISOString().split("T")[0]
          }
        }

        if (!start || !end) {
          const now = new Date()
          let days = 30
          if (storedRange === "7d") days = 7
          if (storedRange === "90d") days = 90

          const endDate = now.toISOString().split("T")[0]
          const startDate = new Date(now)
          startDate.setDate(startDate.getDate() - days)
          start = startDate.toISOString().split("T")[0]
          end = endDate
        }
      }

      const apiMapping: Record<string, Function> = {
        RG_AA_IOT: getReportData,
        RG_AIQT_IOT: getAIQTReportData,
        RG_BIQT_IOT: getBIQTReportData,
      }

      const apiFn = apiMapping[appSource] ?? getReportData;

      const response = await apiFn(start, end, product);
      
      if (response.success) {
        setData(response.data)
        setApiResponse(response)
      } else {
        setError("Failed to fetch data")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching data")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()

    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === "chart-range" ||
        e.key === "chart-time-range" ||
        e.key === "chart-date-range" ||
        e.key === "product"
      ) {
        fetchData()
      }
    }

    const handleCustomEvent = () => {
      fetchData()
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener("chart-range-updated", handleCustomEvent)
    window.addEventListener("product-updated", handleCustomEvent)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("chart-range-updated", handleCustomEvent)
      window.removeEventListener("product-updated", handleCustomEvent)
    }
  }, [startDate, endDate, selectedProduct, appSource])

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ LOG_ID }) => LOG_ID) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.LOG_ID.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  if (error) {
    return (
      <div className="w-full flex flex-col gap-6 px-4 lg:px-6">
        <Alert variant="destructive">
          <IconAlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Test Report</h2>
          <p className="text-sm text-muted-foreground">
            {apiResponse?.count || 0} total records • {apiResponse?.filters.product || "All Products"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            {isLoading ? (
              <IconLoader2 className="size-4 animate-spin text-muted-foreground" />
            ) : (
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id.replace(/_/g, " ")}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </div>
      
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function extractTestData(item: z.infer<typeof schema>) {
  const TEST_EXCLUDE = [
    "TEST_DESC",
    "TEST_ITEM",
    "TEST_RESULT",
    "TEST_DATETIME",
  ];

  const entries = Object.entries(item)
    .filter(([key]) => key.startsWith("TEST_"))
    .filter(([key]) => !TEST_EXCLUDE.includes(key))
    .map(([key, value]) => ({
      name: key,
      rawKey: key,
      value: value,
    }));

  return entries;
}

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()
  const testEntries = extractTestData(item);

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.LOG_ID}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Log Details - {item.LOG_ID}</DrawerTitle>
          <DrawerDescription>
            Test record information and statistics
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="log-id">Program Name</Label>
              <Input id="log-id" defaultValue={item.PROGRAM_NAME} disabled />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="log-id">Program Version</Label>
              <Input id="log-id" defaultValue={item.PROGRAM_VERSION} disabled />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="emp-no">Travel Card No.</Label>
                <Input id="emp-no" defaultValue={item.TRAVEL_CARD_NUMBER} disabled />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="product-no">Product No.</Label>
                <Input id="product-no" defaultValue={item.PRODUCT_NO} disabled/>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="log-filename">Test Desc</Label>
              <Input id="log-filename" defaultValue={item.TEST_DESC} className="font-mono" disabled/>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 flex flex-col gap-3">
                <Label htmlFor="test-item">Test Item</Label>
                <Input id="test-item" defaultValue={item.TEST_ITEM} disabled/>
              </div>
              <div className="col-span-1 flex flex-col gap-3">
                <Label htmlFor="test-result">Test Result</Label>
                <Input id="test-result" defaultValue={item.TEST_RESULT} disabled/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="test-datetime">Test Date</Label>
                <Input 
                  id="test-datetime" 
                  defaultValue={new Date(item.TEST_DATETIME).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                    timeZone: "UTC",
                  })}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="create-datetime">Create Date</Label>
                <Input 
                  id="create-datetime" 
                  defaultValue={new Date(item.CREATE_DATETIME).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                    timeZone: "UTC",
                  })}
                  disabled
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-2">
              <div className="flex gap-2 leading-none font-medium">
                Test Product Result
              </div>
              <div className="text-muted-foreground">
                Historical test results value for this product
              </div>
            </div>

            <Separator />

            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="w-1/2">Test Name</TableHead>
                  <TableHead className="text-center w-1/2">Data Point</TableHead>
                  <TableHead className="text-right w-1/2">Copy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testEntries.map((t) => (
                  <TableRow key={t.rawKey}>
                    <TableCell className="font-medium">
                      <Badge
                        variant="outline"
                        className="text-muted-foreground px-1.5"
                      >
                        {t.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className="text-muted-foreground px-1.5"
                      >
                        {t.value}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className="text-muted-foreground px-1.5"
                      >
                        <IconCopy />
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </form>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}