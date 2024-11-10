// MainNav.tsx
"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LayoutList,
  Tags,
  Package,
  ShoppingCart,
  Settings,
} from "lucide-react";

export const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "לוח בקרה",
      icon: LayoutDashboard,
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "באנרים",
      icon: LayoutList,
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "קטגוריות",
      icon: Tags,
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "מוצרים",
      icon: Package,
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "הזמנות",
      icon: ShoppingCart,
      active: pathname === `/${params.storeId}/orders`,
    },
  ];

  return (
    <nav
      dir="rtl"
      className={cn(
        "md:flex md:items-center md:space-x-6 md:space-x-reverse",
        className
      )}
      {...props}
    >
      {routes.map((route) => {
        const Icon = route.icon;
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              "hover:bg-accent/50",
              route.active
                ? "text-primary bg-accent"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{route.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
