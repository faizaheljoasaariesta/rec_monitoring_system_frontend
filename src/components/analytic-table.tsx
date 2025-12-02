"use client";

import * as React from "react";
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
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconGripVertical,
  IconLayoutColumns,
  IconPlus,
  IconAlertCircle,
  IconLoader2,
} from "@tabler/icons-react";
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
} from "@tanstack/react-table";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getMonthlyAnalytic } from "@/services/api/aa-reports";
import { getAIQTMonthlyAnalytic } from "@/services/api/aiqt-reports";
import { getBIQTMonthlyAnalytic } from "@/services/api/biqt-reports";

import { useAppSource } from "@/contexts/AppSourceContext"

const type: Record<string, string> = {
  RG_AA_IOT: "AA",
  RG_AIQT_IOT: "AIQT",
  RG_BIQT_IOT: "BIQT",
}

type Mode = "machine" | "date";

type MachineDetail = {
  machineId: string;
  ok: number;
  ng: number;
  retry: number;
  okYear: number;
  ngYear: number;
  retryYear: number;
  rateRetry: number;
  rateRetryYear: number;
};

type DailyDetail = {
  date: string;
  ok: number;
  ng: number;
  retry: number;
  okYear: number;
  ngYear: number;
  retryYear: number;
  rateRetry: number;
  rateRetryYear: number;
};

type RowByDate = {
  id: string;
  label: string;
  totalOK: number;
  totalNG: number;
  totalRetry: number;
  details: MachineDetail[];
};

type RowByMachine = {
  id: string;
  label: string;
  totalOK: number;
  totalNG: number;
  totalRetry: number;
  details: DailyDetail[];
};

type TableRowItem = RowByDate | RowByMachine;

export const analyticSchema = z.object({
  id: z.string(),
  type: z.string(),
  date: z.string(),
  totalTest: z.number(),
  totalNGTest: z.number(),
  dailyRetestPercentage: z.number(),
  yearlyRetestPercentage: z.number(),
  imageUrl: z.string().optional(),
});

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

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
  );
}

const makeColumns = (appSource: string): 
ColumnDef<TableRowItem>[] => [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={String(row.original.id)} />,
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
    accessorKey: "type",
    header: "Type",
    cell: () => <div className="font-medium">{type[appSource]}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "label",
    header: "Date / Machine",
    cell: ({ row }) => <div className="font-medium">{(row.original as any).label}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "totalOK",
    header: "Total OK",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {(row.original as any).totalOK ?? 0}
      </Badge>
    ),
  },
  {
    accessorKey: "totalNG",
    header: "Total (NG)",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {(row.original as any).totalNG ?? 0}
      </Badge>
    ),
  },
  {
    accessorKey: "totalRetry",
    header: "Total (Retry)",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {(row.original as any).totalRetry ?? 0}
      </Badge>
    ),
  },
];

function DraggableRow({
  row,
  onClick,
}: {
  row: Row<TableRowItem>;
  onClick?: () => void;
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: String(row.original.id),
  });

  return (
    <TableRow
      onClick={onClick}
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef as any}
      className="relative z-0 cursor-pointer data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
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
  );
}

export function AnalyticTable() {
  const [rows, setRows] = React.useState<TableRowItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { appSource } = useAppSource();

  const [mode, setMode] = React.useState<Mode>("machine");

  const columns = React.useMemo(
    () => makeColumns(appSource),
    [appSource]
  );

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const toggleExpand = (id: string) => setExpandedId((s) => (s === id ? null : id));

  const fetchData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const formatLocalDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const today = new Date();

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const oneMonthBeforeToday = new Date()
      oneMonthBeforeToday.setMonth(oneMonthBeforeToday.getMonth() - 1)

      const startDate = formatLocalDate(oneMonthBeforeToday);
      const endDate = formatLocalDate(yesterday);

      const apiMapping: Record<string, Function> = {
        RG_AA_IOT: getMonthlyAnalytic,
        RG_AIQT_IOT: getAIQTMonthlyAnalytic,
        RG_BIQT_IOT: getBIQTMonthlyAnalytic,
      }

      const apiFn = apiMapping[appSource] ?? getMonthlyAnalytic;

      const res = await apiFn(startDate, endDate, mode);

      if (mode === "date") {
        const days = res?.days ?? res?.data?.days ?? [];
        const mapped: RowByDate[] = (days as any[]).map((d: any) => ({
          id: d.date,
          label: d.date,
          totalOK: d.totalOK ?? 0,
          totalNG: d.totalNG ?? 0,
          totalRetry: d.totalRetry ?? 0,
          details: (d.machines ?? []).map((m: any) => {
            const totalDaily = m.ok + m.retry;
            const totalYearly = m.okYear + m.retryYear;

            const dailyRate = totalDaily > 10 ? (m.retry / totalDaily) * 100 : 0;
            const yearlyRate = totalYearly > 10 ? (m.retryYear / totalYearly) * 100 : 0;

            return {
              ...m,
              rateRetry: Number(dailyRate.toFixed(2)),
              rateRetryYear: Number(yearlyRate.toFixed(2)),
            } as MachineDetail;
          }),
        }));
        setRows(mapped);
      } else {
        const machines = res?.machines ?? res?.data?.machines ?? [];
        const mapped: RowByMachine[] = (machines as any[]).map((m: any) => ({
          id: m.machineId,
          label: `Machine ${m.machineId}`,
          totalOK: m.totalOK ?? 0,
          totalNG: m.totalNG ?? 0,
          totalRetry: m.totalRetry ?? 0,
          details: (m.daily ?? []).map((d: any) => {
            const totalDaily = d.ok + d.retry;
            const totalYearly = d.okYear + d.retryYear;

            const dailyRate = totalDaily > 10 ? (d.retry / totalDaily) * 100 : 0;
            const yearlyRate = totalYearly > 10 ? (d.retryYear / totalYearly) * 100 : 0;

            return {
              ...d,
              rateRetry: Number(dailyRate.toFixed(2)),
              rateRetryYear: Number(yearlyRate.toFixed(2)),
            } as DailyDetail;
          }),
        }));
        setRows(mapped);
      }
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setIsLoading(false);
    }
  }, [mode, appSource]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const table = useReactTable({
    data: rows,
    columns: columns as any,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => String((row as any).id),
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
  });

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => (rows?.map((r) => r.id) as UniqueIdentifier[]) || [],
    [rows]
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setRows((prev) => {
        const oldIndex = prev.findIndex((p) => String(p.id) === String(active.id));
        const newIndex = prev.findIndex((p) => String(p.id) === String(over.id));
        return arrayMove(prev, oldIndex, newIndex);
      });
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
        <Button onClick={() => fetchData()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Analytic Report Pretest</h2>
          <p className="text-sm text-muted-foreground">
            {rows.length} item(s) — mode: <strong className="capitalize">{mode}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={mode === "machine" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("machine")}
          >
            By Machine
          </Button>

          <Button
            variant={mode === "date" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("date")}
          >
            By Date
          </Button>

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
                  .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            )}
          </DropdownMenu>

          <Button variant="outline" size="sm">
            <IconPlus />
            <span className="hidden lg:inline">Export Data</span>
          </Button>
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
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <IconLoader2 className="size-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => {
                      const rowItem = row.original as TableRowItem;
                      const isExpanded = expandedId === String(rowItem.id);

                      return (
                        <React.Fragment key={String(row.id)}>
                          <DraggableRow
                            row={row}
                            onClick={() => toggleExpand(String(rowItem.id))}
                          />

                          {isExpanded && (
                            <TableRow className="bg-muted/20">
                              <TableCell colSpan={columns.length} className="p-0">
                                <div className="border-t bg-muted/10">
                                  <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <div>
                                        <h4 className="text-base font-semibold">
                                          {mode === "date"
                                            ? `Machine Details — ${rowItem.label}`
                                            : `Daily Details — ${rowItem.label}`}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          Showing breakdown data for this row
                                        </p>
                                      </div>

                                      <Badge variant="secondary" className="text-xs px-2 py-1">
                                        {mode === "date" ? "By Date" : "By Machine"}
                                      </Badge>
                                    </div>

                                    {/* INNER TABLE */}
                                    <div className="p-2 rounded-md border bg-background shadow-sm">
                                      <Table>
                                        <TableHeader className="bg-muted/50">
                                          <TableRow>
                                            {mode === "date" ? (
                                              <>
                                                <TableHead className="font-medium">Machine</TableHead>
                                                <TableHead className="font-medium text-center">OK</TableHead>
                                                <TableHead className="font-medium text-center">NG</TableHead>
                                                <TableHead className="font-medium text-center">Retry</TableHead>
                                                <TableHead className="font-medium text-center">OK (Year)</TableHead>
                                                <TableHead className="font-medium text-center">NG (Year)</TableHead>
                                                <TableHead className="font-medium text-center">Retry (Year)</TableHead>
                                                <TableHead className="font-medium text-center">% Retry</TableHead>
                                                <TableHead className="font-medium text-center">% Retry (Year)</TableHead>
                                              </>
                                            ) : (
                                              <>
                                                <TableHead className="font-medium">Date Taken</TableHead>
                                                <TableHead className="font-medium text-center">OK</TableHead>
                                                <TableHead className="font-medium text-center">NG</TableHead>
                                                <TableHead className="font-medium text-center">Retry</TableHead>
                                                <TableHead className="font-medium text-center">OK (Year)</TableHead>
                                                <TableHead className="font-medium text-center">NG (Year)</TableHead>
                                                <TableHead className="font-medium text-center">Retry (Year)</TableHead>
                                                <TableHead className="font-medium text-center">% Retry</TableHead>
                                                <TableHead className="font-medium text-center">% Retry (Year)</TableHead>
                                              </>
                                            )}
                                          </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                          {mode === "date"
                                            ? (rowItem as any).details.map((m: MachineDetail) => (
                                                <TableRow key={m.machineId} className="hover:bg-muted/30">
                                                  <TableCell className="font-medium">Machine {m.machineId}</TableCell>
                                                  <TableCell className="text-center">{m.ok}</TableCell>
                                                  <TableCell className="text-center">{m.ng}</TableCell>
                                                  <TableCell className="text-center">{m.retry}</TableCell>
                                                  <TableCell className="text-center">{m.okYear}</TableCell>
                                                  <TableCell className="text-center">{m.ngYear}</TableCell>
                                                  <TableCell className="text-center">{m.retryYear}</TableCell>
                                                  <TableCell className="text-center">{m.rateRetry}%</TableCell>
                                                  <TableCell className="text-center">{m.rateRetryYear}%</TableCell>
                                                </TableRow>
                                              ))
                                            : (rowItem as any).details.map((d: DailyDetail) => (
                                                <TableRow key={d.date} className="hover:bg-muted/30">
                                                  <TableCell className="font-medium">
                                                    {d.date} <span className="text-muted-foreground">08:00 PM</span>
                                                  </TableCell>
                                                  <TableCell className="text-center">{d.ok}</TableCell>
                                                  <TableCell className="text-center">{d.ng}</TableCell>
                                                  <TableCell className="text-center">{d.retry}</TableCell>
                                                  <TableCell className="text-center">{d.okYear}</TableCell>
                                                  <TableCell className="text-center">{d.ngYear}</TableCell>
                                                  <TableCell className="text-center">{d.retryYear}</TableCell>
                                                  <TableCell className="text-center">{d.rateRetry}%</TableCell>
                                                  <TableCell className="text-center">{d.rateRetryYear}%</TableCell>
                                                </TableRow>
                                              ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
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
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
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
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>

            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button variant="outline" className="size-8" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button variant="outline" className="size-8" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button variant="outline" className="hidden size-8 lg:flex" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
