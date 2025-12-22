import * as React from "react"
import { useContext } from "react";
import {
  IconHelp,
  IconSettings,
} from "@tabler/icons-react"

import { NavMain } from "@/components/navigation/nav-main"
import { NavSecondary } from "@/components/navigation/nav-secondary"
import { NavUser } from "@/components/navigation/nav-user"
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
import { AuthContext } from "@/contexts/auth-context";
import { navigation } from "@/constants/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { auth } = useContext(AuthContext);

  const navSecondaryItems = [
    { title: "Settings", url: "/users", icon: IconSettings, roles: ["administrator"] },
    { title: "Get Help", url: "https://faizaheljoasaariesta.com", icon: IconHelp, roles: ["administrator", "operator"] },
  ].filter(item => auth.user && item.roles.includes(auth.user.role));

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-10!"
            >
              <a href="/">
                <img src="/logo.png" className="size-40!"/>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain items={navigation.navMain} />
        <NavSecondary items={navSecondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {auth.user ? (
          <NavUser user={auth.user} />
        ) : (
          <div className="p-4 text-muted-foreground">Not logged in</div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
