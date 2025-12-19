import { AnalyticTable } from "@/components/table/analytic-table"
import { AppSidebar } from "@/components/app-sidebar"
import AAChart from "@/components/chart/chart-analytic-report"
import { SiteHeaderDynamic } from "@/components/header/site-header-dynamic"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Analytic() {
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
        <SiteHeaderDynamic />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <AAChart />
              </div>
              <AnalyticTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
