import { AppSidebar } from "@/components/app-sidebar"
import { ATDataTable } from "@/components/table/at-data-table"
import ChartATReport from "@/components/chart/chart-at-report"
import { SiteHeaderStatic } from "@/components/header/site-header-static"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function ATReport() {
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
        <SiteHeaderStatic title="AT IOT" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <ChartATReport />
              </div>
              <ATDataTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
