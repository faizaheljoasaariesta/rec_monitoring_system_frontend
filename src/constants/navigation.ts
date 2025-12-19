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
        {
          title: "Screw Locking (LOCK)",
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