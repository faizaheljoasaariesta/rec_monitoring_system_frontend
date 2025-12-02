import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
  IconCircleCheckFilled,
} from "@tabler/icons-react"

import { useAppSource } from "@/contexts/AppSourceContext"

export function SiteHeader() {
  const { appSource, setAppSource } = useAppSource();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex items-center gap-2">
          <h1 className="text-base font-medium">Monitoring System</h1>
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            AA IoT
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400 mr-1" />
          </Badge>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex">
            <Select value={appSource} onValueChange={setAppSource}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RG_AA_IOT">RG AA IOT</SelectItem>
                <SelectItem value="RG_AIQT_IOT">RG AIOT IOT</SelectItem>
                <SelectItem value="RG_BIQT_IOT">RG BIQT IOT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="#"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              Export
            </a>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
