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
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 bg-white dark:bg-zinc-950 flex flex-col h-full shadow-2xs">
      
      {/* Chart Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-900 mb-6">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Order Performance Analyzer
          </h2>
          <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mt-0.5">
            Analyze terminal volume and transaction values
          </p>
        </div>

        {/* Dual Switcher Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Cycle Selector */}
          <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900/50 p-1 rounded-xl border border-zinc-250/20 dark:border-zinc-800/40">
            {(["days", "weeks", "months"] as const).map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => setTimeCycle(cycle)}
                className={`h-7 px-2.5 text-[9px] font-bold rounded-lg uppercase tracking-wider transition-all duration-205 select-none
                  ${timeCycle === cycle
                    ? "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 shadow-2xs"
                    : "text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"}`}
              >
                {cycle}
              </button>
            ))}
          </div>

          {/* Metric Selector (Orders / Revenue) */}
          <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900/50 p-1 rounded-xl border border-zinc-250/20 dark:border-zinc-800/40">
            <button
              type="button"
              onClick={() => setMetric("count")}
              className={`h-7 px-2.5 text-[9px] font-bold rounded-lg uppercase tracking-wider gap-1 flex items-center transition-all duration-200 select-none
                ${metric === "count"
                  ? "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 shadow-2xs"
                  : "text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"}`}
            >
              <BarChart3 className="h-3 w-3" />
              Volume
            </button>
            <button
              type="button"
              onClick={() => setMetric("revenue")}
              className={`h-7 px-2.5 text-[9px] font-bold rounded-lg uppercase tracking-wider gap-1 flex items-center transition-all duration-200 select-none
                ${metric === "revenue"
                  ? "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 shadow-2xs"
                  : "text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"}`}
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-zinc-100 dark:stroke-zinc-800/50" />
            
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase"
              dy={10}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 font-mono"
              tickFormatter={(v) => isRevenue ? `${v} DH` : `${v}`}
              dx={-5}
            />

            <ChartTooltip
              cursor={{ fill: "rgba(244, 244, 245, 0.4)", radius: 12 }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="border border-zinc-200 dark:border-zinc-850"
                  formatter={(value) => (
                    <span className="font-extrabold text-zinc-800 dark:text-zinc-250 font-mono">
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
              className="fill-zinc-900 dark:fill-zinc-100 transition-all duration-300"
            />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-3 border-t border-zinc-100 dark:border-zinc-850 pt-4 mt-6 gap-4 text-center">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-0.5">
            Total Volume
          </span>
          <span className="text-xs font-extrabold font-mono text-zinc-800 dark:text-zinc-200">
            {isRevenue 
              ? `${totalSum.toFixed(2)} MAD`
              : `${totalSum} Orders`}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-0.5">
            Cycle Average
          </span>
          <span className="text-xs font-extrabold font-mono text-zinc-800 dark:text-zinc-200">
            {isRevenue 
              ? `${averageValue.toFixed(2)} MAD`
              : `${averageValue.toFixed(1)} / period`}
          </span>
        </div>
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-0.5">
            Peak Performance
          </span>
          <span className="text-xs font-extrabold font-mono text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            {peakPeriod ? peakPeriod.period : "N/A"}
          </span>
        </div>
      </div>

    </div>
  );
}
