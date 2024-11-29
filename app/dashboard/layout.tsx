import DashboardNav from "@/components/navigations/dashboard-nav";
import { auth } from "@/server/auth";
import { BarChart, Package, PenSquare, Settings, Truck } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // get the role from the user auth
  const session = await auth();

  // LINKS FOR THE USER: consumer || seller
  const userLinks = [
    { label: "Orders", path: "/dashboard/orders", icon: <Truck size={16} /> },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: <Settings size={16} />,
    },
  ];

  // LINKS FOR TH ADMIN
  const adminLinks =
    session?.user.role === "admin"
      ? [
          {
            label: "Analytics",
            path: "/dashboard/analytics",
            icon: <BarChart size={16} />,
          },
          {
            label: "Create",
            path: "/dashboard/add-product",
            icon: <PenSquare size={16} />,
          },
          {
            label: "Products",
            path: "/dashboard/products",
            icon: <Package size={16} />,
          },
        ]
      : [];

  const navLinks = [...adminLinks, ...userLinks];

  // get the url pathname for link highlight
  return (
    <div>
      {/* // NAV LINK */}
      <DashboardNav navLinks={navLinks} />
      {children}
    </div>
  );
}
