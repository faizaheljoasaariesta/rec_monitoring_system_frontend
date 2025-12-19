import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeaderStatic } from "@/components/header/site-header-static"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { UserTable } from "@/components/table/user-table"

export default function Users() {
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
        <SiteHeaderStatic title="User Settings" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <UserTable />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
