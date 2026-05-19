"use client";
import { cn } from "@/lib/utils";
import { Clock, LayoutDashboard, ShoppingBag, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// src/app/(pos)/pos/page.tsx — add to header
import { useSettings } from "@/providers/SettingsProvider";
import { signOut, useSession } from "next-auth/react";

export default function AppNavbar() {
  const { data: session } = useSession();
  const { settings } = useSettings();
  const pathname = usePathname();
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isPOS = pathname?.startsWith("/pos");
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-20 items-center justify-between px-6">

        {/* Brand/Logo */}
        <div className="flex items-center gap-2">
          {settings.logo ? (
            <img
              src={settings.logo}
              alt="Brand Logo"
              className="h-16 w-32  object-cover "
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Store className="h-5 w-5" />
            </div>
          )}
          <div>
            <span className="font-bold text-sm tracking-tight text-foreground block leading-none">
              {settings.logoText || "NEXUS"}
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase">
              POS System
            </span>
          </div>
        </div>

        {/* Primary Navigation Pills */}
        <nav className="flex items-center gap-1.5 bg-muted p-1 rounded-full border border-border/40">
          <Link
            href="/pos"
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 select-none",
              isPOS
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            POS Terminal
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 select-none",
              isDashboard
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard Hub
          </Link>
        </nav>

        {/* Status / Meta Info */}
        <div className="flex items-center gap-4">
          {/* Live System Time */}
          <div className="hidden md:flex items-center gap-2 bg-muted/40 px-3.5 py-1.5 rounded-lg border border-border/30 text-xs font-mono font-medium text-foreground">
            <Clock className="h-3.5 w-3.5 text-muted-foreground animate-pulse" />
            <span>{time || "--:--:--"}</span>
          </div>

          {/* Sync indicator */}
          <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/25">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="hidden sm:inline text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide">
              ONLINE
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Sign out
          </button>
          <span className="text-sm text-muted-foreground">{session?.user?.name}</span>
        </div>

      </div>
    </header>
  );
}
