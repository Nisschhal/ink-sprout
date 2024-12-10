"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TotalOrders } from "@/lib/infer-type";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { weeklyChart } from "./weekly-chart";
import {
  Bar,
  BarChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { monthlyChart } from "./monthly-chart";
export default function Earnings({
  totalOrders,
}: {
  totalOrders: TotalOrders[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "week";

  // Get the list of date and revenue object from totalOrders
  const chartItems = totalOrders.map((order) => ({
    date: order.orders.created!,
    revenue: order.orders.total,
  }));

  // chart Date : Weekly || Monthly
  const activeCharts = useMemo(() => {
    // Extract data and revenue object that is within this week from chartItems
    const weekly = weeklyChart(chartItems);
    // Extract data and revenue object that is within this month from chartItems
    const monthly = monthlyChart(chartItems);
    // return list of data within this week
    if (filter === "week") {
      return weekly;
    }
    // return list of data within this month
    if (filter === "month") {
      return monthly;
    }
  }, [filter]);

  // totalPrice: Weekly || Monthly
  const activeTotal = useMemo(() => {
    // if montly active then reduce total price from this monthChart data
    if (filter === "month") {
      return monthlyChart(chartItems).reduce(
        (acc, item) => acc + item.revenue,
        0
      );
    }

    // else reduct total price from this weekly data
    return weeklyChart(chartItems).reduce((acc, item) => acc + item.revenue, 0);
  }, [filter]);

  return (
    <Card className="flex-1 shrink-0 h-full">
      <CardHeader>
        <CardTitle>Your Revenue: ${activeTotal}</CardTitle>
        <CardDescription>Here are your recent earnings</CardDescription>
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "cursor-pointer",
              filter == "week" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() =>
              router.push("/dashboard/analytics/?filter=week", {
                scroll: false,
              })
            }
          >
            This Week
          </Badge>
          <Badge
            className={cn(
              "cursor-pointer",
              filter == "month" ? "bg-primary" : "bg-primary/25"
            )}
            onClick={() =>
              router.push("/dashboard/analytics/?filter=month", {
                scroll: false,
              })
            }
          >
            This Month
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="h-96">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <BarChart data={activeCharts}>
            <Bar
              dataKey="revenue"
              className="fill-primary"
              activeBar={<Rectangle />}
            />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
