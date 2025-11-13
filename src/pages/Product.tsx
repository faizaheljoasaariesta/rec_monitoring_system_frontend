import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { DatePicker } from "@/components/ui/date-picker"
// import { DataTable } from "@/components/data-table"
import { ProductTable } from "@/components/product-table"
import { useState } from "react"

export default function Product() {
  const [filterStatus, setFilterStatus] = useState("all")

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* === SECTION SUMMARY CARDS === */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 lg:px-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Total Product</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,314</div>
                    <p className="text-sm text-muted-foreground">All tested units</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>OK Product</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">2,108</div>
                    <p className="text-sm text-muted-foreground">Successfully passed all tests</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>NG Product</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">206</div>
                    <p className="text-sm text-muted-foreground">Need rework or failed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Yield Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">91.1%</div>
                    <p className="text-sm text-muted-foreground">OK / Total * 100%</p>
                  </CardContent>
                </Card>
              </div>

              {/* === FILTER BAR === */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-4 lg:px-6">
                <div className="flex items-center gap-4">
                  {/* <DatePicker /> */}
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="ok">OK</SelectItem>
                      <SelectItem value="ng">NG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Badge variant="outline">
                  Last updated: {new Date().toLocaleString()}
                </Badge>
              </div>

              {/* === PRODUCT TABLE === */}
              <div className="px-4 lg:px-6">
                <ProductTable filterStatus={filterStatus} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
