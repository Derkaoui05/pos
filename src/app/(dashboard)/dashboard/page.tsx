"use client";
import { useQuery } from "@tanstack/react-query";
import StatsCards from "@/components/dashboard/StatsCards";
import SalesTable from "@/components/dashboard/SalesTable";
import TopProducts from "@/components/dashboard/TopProducts";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn:  () => fetch("/api/dashboard").then(r => r.json()),
    refetchInterval: 30000, // refresh every 30s
  });

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Sales overview</p>
        </div>
        <a
      href="/pos"
          className="text-sm text-primary hover:underline font-medium"
>
          ← Back to POS
        </a>
      </div>

      <StatsCards stats={data.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesTable orders={data.recentOrders} />
        </div>
        <div>
          <TopProducts products={data.topProducts} />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}