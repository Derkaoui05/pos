"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Package, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardSubNav() {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: BarChart3,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/products",
      label: "Products",
      icon: Package,
      active: pathname?.startsWith("/dashboard/products"),
    },
    {
      href: "/dashboard/categories",
      label: "Categories",
      icon: Layers,
      active: pathname?.startsWith("/dashboard/categories"),
    },
  ];

  return (
    <div className="w-full bg-zinc-50/50 dark:bg-zinc-950/30 border-b border-zinc-200 dark:border-zinc-800">
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
                    ? "text-zinc-900 bg-zinc-100 dark:text-zinc-50 dark:bg-zinc-800"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
                {link.active && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-zinc-900 dark:bg-zinc-50 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Action / Context Badge */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-[10px] text-zinc-400 font-semibold tracking-widest uppercase">
            Control Panel
          </span>
        </div>

      </div>
    </div>
  );
}
