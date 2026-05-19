"use client";
import { cn } from "@/lib/utils";
import { Clock, LayoutDashboard, ShoppingBag, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// src/app/(pos)/pos/page.tsx — add to header
import { signOut, useSession } from "next-auth/react";

export default function AppNavbar() {
  const { data: session } = useSession();
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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex h-16 items-center justify-between px-6">

        {/* Brand/Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-50 block leading-none">
              NEXUS
            </span>
            <span className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">
              POS System
            </span>
          </div>
        </div>


        {/* Primary Navigation Pills */}
        <nav className="flex items-center gap-1.5 bg-zinc-100/80 dark:bg-zinc-900/80 p-1 rounded-full border border-zinc-200/50 dark:border-zinc-800/50">
          <Link
            href="/pos"
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 select-none",
              isPOS
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
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
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard Hub
          </Link>
        </nav>

        {/* Status / Meta Info */}
        <div className="flex items-center gap-4">
          {/* Live System Time */}
          <div className="hidden md:flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900/50 px-3.5 py-1.5 rounded-lg border border-zinc-200/40 dark:border-zinc-800/40 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
            <Clock className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 animate-pulse" />
            <span>{time || "--:--:--"}</span>
          </div>

          {/* Sync indicator */}
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-200/50 dark:border-emerald-900/30">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="hidden sm:inline text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 tracking-wide">
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
