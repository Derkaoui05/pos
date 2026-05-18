"use client";
import { TrendingUp, ShoppingBag, Users, Package, ArrowUpRight, DollarSign, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardPage() {
  // Setup queries or mock stats for standard POS
  const stats = [
    {
      title: "Total Revenue",
      value: "$4,820.50",
      description: "+12.2% from last week",
      icon: DollarSign,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "Orders Processed",
      value: "148",
      description: "+8.4% from yesterday",
      icon: ShoppingBag,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Active Cashiers",
      value: "3",
      description: "2 currently logged in",
      icon: Users,
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      title: "Low Stock Items",
      value: "4",
      description: "Requires immediate attention",
      icon: Package,
      color: "text-amber-500 bg-amber-500/10",
    },
  ];

  const recentOrders = [
    { id: "ORD-9421", customer: "Walk-in Customer", items: 4, total: "$58.00", status: "Completed", time: "10 mins ago" },
    { id: "ORD-9420", customer: "John Doe", items: 2, total: "$24.00", status: "Completed", time: "18 mins ago" },
    { id: "ORD-9419", customer: "Walk-in Customer", items: 1, total: "$10.00", status: "Completed", time: "32 mins ago" },
    { id: "ORD-9418", customer: "Jane Smith", items: 6, total: "$114.50", status: "Refunded", time: "1 hour ago" },
    { id: "ORD-9417", customer: "Walk-in Customer", items: 3, total: "$42.00", status: "Completed", time: "2 hours ago" },
  ];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-zinc-50/50 dark:bg-zinc-950/20 min-h-screen">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Export Report
          </Button>
          <Button size="sm">
            View Live Sales
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Sales Chart / Activity */}
        <Card className="col-span-4 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>
              Hourly transaction values for today
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[240px] flex items-center justify-center border border-dashed rounded-lg border-zinc-200 dark:border-zinc-800 text-zinc-400 text-sm gap-2">
              <TrendingUp className="h-4 w-4" />
              Real-time analytics chart loading...
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-3 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest POS transactions</CardDescription>
            </div>
            <Button size="sm" variant="ghost" className="text-xs">
              View All <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-zinc-100 dark:bg-zinc-800">
                        {order.customer.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{order.customer}</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{order.time} • {order.items} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{order.total}</p>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-medium mt-1
                      ${order.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
