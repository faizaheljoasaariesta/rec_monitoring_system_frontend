import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconDeviceComputerCamera,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
  IconBrandDatabricks,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "./ui/separator"

const data = {
  user: {
    name: "Faizahel Joasa Ariesta",
    email: "faizaheljoasaariesta@mail.ugm.ac.id",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Analytic",
      url: "#",
      icon: IconChartBar,
      isActive: true,
      items: [
        {
          title: "Daily Report",
          url: "/analytic",
        },
        {
          title: "Machine Report",
          url: "/machinereport",
        },
      ],
    },
    {
      title: "More Report",
      url: "#",
      icon: IconBrandDatabricks,
      isActive: true,
      items: [
        {
          title: "Air Pressure",
          url: "/airreport",
        },
        {
          title: "Auto Trimming",
          url: "/atreport",
        },
        {
          title: "Digital Camera",
          url: "/dcreport",
        },
        // {
        //   title: "Screw Locking (LOCK)",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Product",
      url: "/product",
      icon: IconDeviceComputerCamera,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-10!"
            >
              <a href="/dashboard">
                <img src="/logo.png" className="size-40!"/>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
