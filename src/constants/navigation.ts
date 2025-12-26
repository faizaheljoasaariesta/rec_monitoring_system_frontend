import { IconBrandDatabricks, IconChartBar, IconDashboard, IconDeviceComputerCamera } from "@tabler/icons-react";

export const navigation = {
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
          title: "ALT",
          url: "/airreport",
        },
        {
          title: "AHM",
          url: "/atreport",
        },
        {
          title: "DC",
          url: "/dcreport",
        },
        {
          title: "AS",
          url: "/asreport",
        },
      ],
    },
    {
      title: "Product",
      url: "/product",
      icon: IconDeviceComputerCamera,
    },
  ],
}