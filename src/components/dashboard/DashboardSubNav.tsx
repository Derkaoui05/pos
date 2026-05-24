"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Package, Layers, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function DashboardSubNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const links = [
    {
      href: "/dashboard",
      label: t('nav.dashboard', "Overview"),
      icon: BarChart3,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/products",
      label: t('nav.products', "Products"),
      icon: Package,
      active: pathname?.startsWith("/dashboard/products"),
    },
    {
      href: "/dashboard/categories",
      label: t('nav.categories', "Categories"),
      icon: Layers,
      active: pathname?.startsWith("/dashboard/categories"),
    },
    {
      href: "/dashboard/settings",
      label: t('nav.settings', "Settings"),
      icon: Settings,
      active: pathname?.startsWith("/dashboard/settings"),
    },
  ];

  return (
    <div className="w-full bg-muted/10 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 relative",
                  link.active
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/55"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
                {link.active && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Action / Context Badge */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground font-semibold tracking-widest uppercase">
            Control Panel
          </span>
        </div>

      </div>
    </div>
  );
}
