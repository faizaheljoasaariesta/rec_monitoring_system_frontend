import { AppSidebar } from "@/components/app-sidebar"
import { ProductTable } from "@/components/table/product-table"
import { SiteHeaderStatic } from "@/components/header/site-header-static"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Product() {
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
        <SiteHeaderStatic title="Product List" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <ProductTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
