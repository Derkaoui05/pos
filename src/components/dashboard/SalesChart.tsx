"use client";
import React, { useState } from "react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart3, Coins, Calendar, TrendingUp } from "lucide-react";

interface OrderHistoryItem {
  createdAt: string | Date;
  total: number;
}

interface StatsProps {
  stats: {
    today: { total: number; count: number };
    week: { total: number; count: number };
    month: { total: number; count: number };
    allTime: { total: number; count: number };
  };
  orderHistory: OrderHistoryItem[];
}

type TimeCycle = "days" | "weeks" | "months";

export default function SalesChart({ stats, orderHistory = [] }: StatsProps) {
  const [timeCycle, setTimeCycle] = useState<TimeCycle>("days");
  const [metric, setMetric] = useState<"count" | "revenue">("count");

  const isRevenue = metric === "revenue";

  // 1. Group by Days (Last 7 Days)
  const getDailyData = () => {
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const start = d.getTime();
      const end = d.getTime() + 86400000 - 1; // 24 Hours duration
      
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      
      const filtered = orderHistory.filter((o) => {
        const t = new Date(o.createdAt).getTime();
        return t >= start && t <= end;
      });

      const totalValue = filtered.reduce((sum, o) => sum + o.total, 0);
      days.push({
        period: label,
        value: isRevenue ? totalValue : filtered.length,
      });
    }
    return days;
  };

  // 2. Group by Weeks (Last 4 Weeks)
  const getWeeklyData = () => {
    const weeks = [];
    const now = new Date();
    for (let i = 3; i >= 0; i--) {
      const start = new Date();
      start.setDate(now.getDate() - (now.getDay() + i * 7)); // Starts Sunday
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      
      const label = i === 0 ? "This Week" : `Week -${i}`;
      
      const filtered = orderHistory.filter((o) => {
        const t = new Date(o.createdAt).getTime();
        return t >= start.getTime() && t <= end.getTime();
      });

      const totalValue = filtered.reduce((sum, o) => sum + o.total, 0);
      weeks.push({
        period: label,
        value: isRevenue ? totalValue : filtered.length,
      });
    }
    return weeks;
  };

  // 3. Group by Months (Last 6 Months)
  const getMonthlyData = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("en-US", { month: "short" });
      
      const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0).getTime();
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
      
      const filtered = orderHistory.filter((o) => {
        const t = new Date(o.createdAt).getTime();
        return t >= start && t <= end;
      });

      const totalValue = filtered.reduce((sum, o) => sum + o.total, 0);
      months.push({
        period: label,
        value: isRevenue ? totalValue : filtered.length,
      });
    }
    return months;
  };

  // Resolve active chart dataset
  const chartData = timeCycle === "days"
    ? getDailyData()
    : timeCycle === "weeks"
    ? getWeeklyData()
    : getMonthlyData();

  const chartConfig = {
    value: {
      label: isRevenue ? "Revenue" : "Orders",
      color: "var(--primary)",
    },
  };

  // Computed summary metrics
  const totalSum = chartData.reduce((sum, d) => sum + d.value, 0);
  const averageValue = totalSum / chartData.length;
  
  // Find highest period
  const peakPeriod = [...chartData].sort((a, b) => b.value - a.value)[0];

  return (
    <div className="border border-border rounded-3xl p-6 bg-card text-card-foreground flex flex-col h-full shadow-2xs">
      
      {/* Chart Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-border/60 mb-6">
        <div>
          <h2 className="text-sm font-bold text-foreground tracking-tight">
            Order Performance Analyzer
          </h2>
          <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
            Analyze terminal volume and transaction values
          </p>
        </div>

        {/* Dual Switcher Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Cycle Selector */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border/40">
            {(["days", "weeks", "months"] as const).map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => setTimeCycle(cycle)}
                className={`h-7 px-2.5 text-[9px] font-bold rounded-lg uppercase tracking-wider transition-all duration-205 select-none
                  ${timeCycle === cycle
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"}`}
              >
                {cycle}
              </button>
            ))}
          </div>

          {/* Metric Selector (Orders / Revenue) */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border/40">
            <button
              type="button"
              onClick={() => setMetric("count")}
              className={`h-7 px-2.5 text-[9px] font-bold rounded-lg uppercase tracking-wider gap-1 flex items-center transition-all duration-200 select-none
                ${metric === "count"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"}`}
            >
              <BarChart3 className="h-3 w-3" />
              Volume
            </button>
            <button
              type="button"
              onClick={() => setMetric("revenue")}
              className={`h-7 px-2.5 text-[9px] font-bold rounded-lg uppercase tracking-wider gap-1 flex items-center transition-all duration-200 select-none
                ${metric === "revenue"
                  ? "bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"}`}
            >
              <Coins className="h-3 w-3" />
              Revenue
            </button>
          </div>
        </div>
      </div>

      {/* Visual Chart Area */}
      <div className="flex-1 w-full min-h-[220px] relative">
        <ChartContainer config={chartConfig} className="w-full h-full max-h-[240px]">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
            
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              className="text-[10px] font-extrabold text-muted-foreground tracking-wider uppercase"
              dy={10}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-[10px] font-bold text-muted-foreground font-mono"
              tickFormatter={(v) => isRevenue ? `${v} DH` : `${v}`}
              dx={-5}
            />

            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.15, radius: 12 }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="border border-border bg-popover text-popover-foreground"
                  formatter={(value) => (
                    <span className="font-extrabold text-foreground font-mono">
                      {isRevenue ? `${Number(value).toFixed(2)} MAD` : `${value} Orders`}
                    </span>
                  )}
                />
              }
            />

            <Bar
              dataKey="value"
              fill="currentColor"
              radius={[10, 10, 0, 0]}
              maxBarSize={45}
              className="fill-primary transition-all duration-300"
            />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-3 border-t border-border/60 pt-4 mt-6 gap-4 text-center">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
            Total Volume
          </span>
          <span className="text-xs font-extrabold font-mono text-foreground">
            {isRevenue 
              ? `${totalSum.toFixed(2)} MAD`
              : `${totalSum} Orders`}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
            Cycle Average
          </span>
          <span className="text-xs font-extrabold font-mono text-foreground">
            {isRevenue 
              ? `${averageValue.toFixed(2)} MAD`
              : `${averageValue.toFixed(1)} / period`}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
            Peak Performance
          </span>
          <span className="text-xs font-extrabold font-mono text-foreground flex items-center justify-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            {peakPeriod ? peakPeriod.period : "N/A"}
          </span>
        </div>
      </div>

    </div>
  );
}
