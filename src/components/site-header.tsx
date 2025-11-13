import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

import {
  IconCircleCheckFilled,
} from "@tabler/icons-react"

export function SiteHeader() {
  const [filterStatus, setFilterStatus] = useState("RG_AA_IOT")

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
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RG_AA_IOT">RG_AA_IOT</SelectItem>
                <SelectItem value="RG_AIOT_IOT">RG_AIOT_IOT</SelectItem>
                <SelectItem value="RG_BIQT_IOT">RG_BIQT_IOT</SelectItem>
                <SelectItem value="RG_DC_IOT">RG_DC_IOT</SelectItem>
                <SelectItem value="RG_AIR">RG_AIR</SelectItem>
                <SelectItem value="AT_IOT">AT_IOT</SelectItem>
                <SelectItem value="LOCK_IOT">LOCK_IOT</SelectItem>
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
