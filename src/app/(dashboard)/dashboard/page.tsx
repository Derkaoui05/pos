"use client";
import { useQuery } from "@tanstack/react-query";
import StatsCards from "@/components/dashboard/StatsCards";
import SalesTable from "@/components/dashboard/SalesTable";
import TopProducts from "@/components/dashboard/TopProducts";
import SalesChart from "@/components/dashboard/SalesChart";
import AppNavbar from "@/components/layout/AppNavbar";
import DashboardSubNav from "@/components/dashboard/DashboardSubNav";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetch("/api/dashboard").then(r => r.json()),
    refetchInterval: 30000, // refresh every 30s
  });

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/50 dark:bg-zinc-950/20 pb-10">
      {/* Navigation Headers */}
      <AppNavbar />
      <DashboardSubNav />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Dashboard Overview
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
              Real-time sales performance metrics
            </p>
          </div>
        </div>

        {/* Stats Cards Row */}
        <StatsCards stats={data.stats} />

        {/* Analytics & Top Sellers Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesChart stats={data.stats} orderHistory={data.orderHistory || []} />
          </div>
          <div>
            <TopProducts products={data.topProducts} />
          </div>
        </div>

        {/* Recent Ledger Row */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-950 p-6 shadow-2xs">
          <div className="pb-4">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Recent Transactions Ledger
            </h2>
            <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mt-0.5">
              Overview of the last 10 completed terminal checkouts
            </p>
          </div>
          <SalesTable orders={data.recentOrders} />
        </div>
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/50 dark:bg-zinc-950/20">
      <AppNavbar />
      <DashboardSubNav />
      <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[340px] rounded-3xl" />
          <Skeleton className="h-[340px] rounded-3xl" />
        </div>
      </main>
    </div>
  );
}