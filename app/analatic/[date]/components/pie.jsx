"use client";

import useSWR from "swr";
import { Pie, PieChart, Label, Sector } from "recharts";
import { getCountFromServer, query, where } from "firebase/firestore";
import { productsRef } from "@/lib/firebase";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/data/categories"; // Assuming this is your array of strings
import { useEffect, useState, useMemo } from "react";
const chartConfig = {
  PC: { label: "PC", color: "#3b82f6" },

  LAPTOP: { label: "Laptop", color: "#10b981" },

  WEBCAMS: { label: "Webcams", color: "#f59e0b" },

  HARD_DRIVES: { label: "Hard Drives", color: "#ef4444" },

  HEADSETS: { label: "Headsets", color: "#8b5cf6" },

  KEYBOARDS: { label: "Keyboards", color: "#ec4899" },

  SPEAKERS: { label: "Speakers", color: "#06b6d4" },

  PRINTERS: { label: "Printers", color: "#f97316" },

  MICROPHONES: { label: "Microphones", color: "#14b8a6" },

  MONITORS: { label: "Monitors", color: "#6366f1" },

  TABLETS: { label: "Tablets", color: "#d946ef" },

  PROJECTORS: { label: "Projectors", color: "#84cc16" },

  SCANNERS: { label: "Scanners", color: "#475569" },

  SSD: { label: "SSD", color: "#0f172a" },

  MOUSES: { label: "Mouses", color: "#7c3aed" },

  DESKTOP: { label: "Desktop", color: "#2563eb" },
};

// 1. The Fetcher Function
const fetchCategoryStock = async () => {
  const results = await Promise.all(
    categories.slice(0, 16).map(async (category) => {
      const q = query(productsRef, where("p_cat", "==", category));
      const snap = await getCountFromServer(q);
      return {
        category,
        quantity: snap.data().count,
        fill: `var(--color-${category})`,
      };
    }),
  );
  return results;
};

export default function ChartPieInteractive() {
  const id = "pie-interactive";

  // 2. SWR Hook
  const { data, isLoading, error } = useSWR(
    "inventory-distribution",
    fetchCategoryStock,
    {
      revalidateOnFocus: false, // Don't refetch every time user switches tabs
      refreshInterval: 60000, // Auto-refresh every 1 minute
    },
  );

  const [activeCategory, setActiveCategory] = useState("");

  // Update active category once data is loaded
  useEffect(() => {
    if (data && data.length > 0 && !activeCategory) {
      setActiveCategory(data[0].category);
    }
  }, [data, activeCategory]);

  const activeIndex = useMemo(
    () => data?.findIndex((item) => item.category === activeCategory) ?? 0,
    [activeCategory, data],
  );

  // 3. Loading State (Skeleton)
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] w-full gap-4">
        <div className="h-40 w-40 rounded-full border-8 border-slate-100 dark:border-slate-800 border-t-blue-500 animate-spin" />
        <p className="text-[10px] font-black uppercase text-slate-400 animate-pulse">
          Scanning Inventory...
        </p>
      </div>
    );
  }

  if (error || !data)
    return (
      <div className="text-red-500 text-xs">Failed to load stock data</div>
    );

  return (
    <Card
      data-chart={id}
      className="flex flex-col rounded-xl border-none shadow-none w-full bg-transparent"
    >
      <ChartStyle id={id} config={chartConfig} />

      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">
          Inventory Distribution
        </CardTitle>
        <CardDescription className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
          Live stock levels per category
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 items-center justify-center p-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="aspect-square h-[220px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="quantity"
              nameKey="category"
              innerRadius={75}
              strokeWidth={8}
              stroke="transparent"
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 8} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 15}
                    innerRadius={outerRadius + 10}
                    opacity={0.3}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-slate-900 dark:fill-white text-3xl font-black"
                        >
                          {data[activeIndex]?.quantity.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 22}
                          className="fill-slate-400 dark:fill-slate-500 text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                          Units
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <div className="pt-6">
        <Select value={activeCategory} onValueChange={setActiveCategory}>
          <SelectTrigger className="h-11 w-full text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-sm focus:ring-4 focus:ring-blue-500/10">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
            {data.map((item) => {
              const config = chartConfig[item.category];
              return (
                <SelectItem
                  key={item.category}
                  value={item.category}
                  className="text-xs font-bold py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 rounded-md"
                      style={{ backgroundColor: config?.color }}
                    />
                    <span>{config?.label || item.category}</span>
                    <span className="ml-auto text-[10px] opacity-50 font-mono">
                      ({item.quantity})
                    </span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
