"use client";

import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import ComingSoonPage from "@/components/ui/custom/common/Comming-Soon";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"; // shadcn charts are built on Recharts [web:53]
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

type SellsType =
  | "TODAY"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "THIS_YEAR"
  | "CUSTOM";

type DashboardCards = {
  totalOrders: number;
  pendingOrders: number;
  pendingAmount: number;

  grossRevenueAll: number;
  totalDiscountAll: number;
  netRevenueAll: number;
  avgOrderValueAll: number;

  grossRevenueFulfilled: number;
};

type SalesSeriesPoint = {
  date: string; // "YYYY-MM-DD" or "YYYY-MM"
  orders: number;

  grossRevenueAll: number;
  totalDiscountAll: number;
  netRevenueAll: number;

  grossRevenueFulfilled: number;
};

type StatusBreakdownPoint = {
  status: string;
  orders: number;
  grossRevenue: number; // uses effectiveOrderTotal on backend
};

type DashboardResponse = {
  cards: DashboardCards;
  charts: {
    salesSeries: SalesSeriesPoint[];
    statusBreakdown: StatusBreakdownPoint[];
  };
  range: { from: string; to: string };
  meta?: { bucket?: "day" | "month" };
};

const TYPES: Array<{ label: string; value: Exclude<SellsType, "CUSTOM"> }> = [
  { label: "Today", value: "TODAY" },
  { label: "7 days", value: "LAST_7_DAYS" },
  { label: "30 days", value: "LAST_30_DAYS" },
  { label: "Year", value: "THIS_YEAR" },
];

function formatBDT(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatYYYYMMDD(d: Date) {
  return format(d, "yyyy-MM-dd");
}

function useIsSmUp() {
  const [isSmUp, setIsSmUp] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = () => setIsSmUp(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isSmUp;
}

function StatCard({
  title,
  value,
  details,
  info,
}: {
  title: string;
  value: string;
  details?: string[];
  info?: React.ReactNode;
}) {
  return (
    <Card className="shadow-none border-[color:var(--palette-accent-1)]/10 bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[color:var(--palette-accent-1)]">
          {info ? <TitleWithInfo title={title} info={info} /> : title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Real/main number first */}
        <div className="text-2xl font-semibold text-[color:var(--palette-text)]">
          {value}
        </div>

        {/* Extra breakdown after */}
        {details?.length ? (
          <div className="mt-1 space-y-0.5">
            {details.map((line, idx) => (
              <p
                key={idx}
                className="text-xs text-[color:var(--palette-accent-1)]/70"
              >
                {line}
              </p>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function TitleWithInfo({
  title,
  info,
}: {
  title: string;
  info: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-[color:var(--palette-accent-1)]">
        {title}
      </span>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[color:var(--palette-accent-1)]/15 bg-white text-[color:var(--palette-accent-1)]/80 hover:bg-black/5"
              aria-label={`${title} info`}
            >
              <Info size={14} />
            </button>
          </TooltipTrigger>

          <TooltipContent className="max-w-[260px] text-xs leading-5">
            {info}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default function MyDashBoard() {
  const isSmUp = useIsSmUp();

  const [type, setType] = useState<SellsType>("TODAY");
  const [customOpen, setCustomOpen] = useState(false);

  const [tempRange, setTempRange] = useState<DateRange | undefined>(undefined);
  const [appliedRange, setAppliedRange] = useState<DateRange | undefined>(
    undefined
  );

  const queryString = useMemo(() => {
    const q = new URLSearchParams();
    q.set("type", type);

    if (type === "CUSTOM" && appliedRange?.from && appliedRange?.to) {
      q.set("fromDate", formatYYYYMMDD(appliedRange.from));
      q.set("toDate", formatYYYYMMDD(appliedRange.to));
    }

    return q.toString();
  }, [type, appliedRange]);

  const queryKey = useMemo(() => {
    return [
      "get-my-dashboard-sells",
      type,
      appliedRange?.from ? appliedRange.from.toISOString() : "",
      appliedRange?.to ? appliedRange.to.toISOString() : "",
    ];
  }, [type, appliedRange]);

  const { data, isPending } = useQueryWrapper<DashboardResponse>(
    queryKey,
    `/sell-product-item/get-my-dashboard-sells?${queryString}`
  );

  const cards = data?.cards;
  const salesSeries = data?.charts?.salesSeries ?? [];
  const statusBreakdown = data?.charts?.statusBreakdown ?? [];

  // Must match data keys exactly. [web:53][web:173]
  const chartConfig = useMemo((): ChartConfig => {
    return {
      netRevenueAll: { label: "Net (all)", color: "var(--palette-btn)" },
      grossRevenueFulfilled: {
        label: "Fulfilled",
        color: "var(--palette-accent-2)",
      },
      orders: { label: "Orders", color: "var(--palette-accent-1)" },
    };
  }, []);

  const activeButtonClass =
    "bg-[color:var(--palette-btn)] text-white border-[color:var(--palette-btn)]";
  const inactiveButtonClass =
    "bg-white text-[color:var(--palette-text)] hover:bg-black/5 border-[color:var(--palette-accent-1)]/15";

  if (isPending) {
    return (
      <main className="min-h-[calc(100vh-80px)] w-full bg-[color:var(--palette-bg)]">
        <div className="w-full px-3 py-4 sm:px-4 sm:py-6">
          <div className="h-8 w-48 animate-pulse rounded bg-black/10" />
          <div className="mt-5 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
            <div className="h-28 animate-pulse rounded-lg bg-black/10" />
            <div className="h-28 animate-pulse rounded-lg bg-black/10" />
            <div className="h-28 animate-pulse rounded-lg bg-black/10" />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
            <div className="h-[320px] animate-pulse rounded-lg bg-black/10" />
            <div className="h-[320px] animate-pulse rounded-lg bg-black/10" />
          </div>
        </div>
      </main>
    );
  }

  if (!data) return <ComingSoonPage />;

  const customLabel =
    type === "CUSTOM" && appliedRange?.from && appliedRange?.to
      ? `${format(appliedRange.from, "dd MMM")} - ${format(
          appliedRange.to,
          "dd MMM"
        )}`
      : "Custom";

  return (
    <main className="min-h-[calc(100vh-80px)] w-full bg-[color:var(--palette-bg)]">
      <div className="w-full px-3 py-4 sm:px-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[color:var(--palette-text)]">
              Sales dashboard
            </h1>
            <p className="mt-1 text-sm text-[color:var(--palette-accent-1)]/70">
              Range: {new Date(data.range.from).toLocaleDateString()} →{" "}
              {new Date(data.range.to).toLocaleDateString()}
            </p>
          </div>

          {/* Filters */}
          <div className="flex w-full flex-wrap gap-2 md:w-auto">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={cn(
                  "rounded-md border px-3 py-2 text-sm transition shadow-none",
                  type === t.value ? activeButtonClass : inactiveButtonClass
                )}
              >
                {t.label}
              </button>
            ))}

            {/* Custom range picker (Popover + Calendar range) [web:93][web:94] */}
            <Popover
              open={customOpen}
              onOpenChange={(open) => {
                setCustomOpen(open);
                if (open) setTempRange(appliedRange);
              }}
            >
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm transition shadow-none",
                    type === "CUSTOM" ? activeButtonClass : inactiveButtonClass
                  )}
                >
                  {customLabel}
                </button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-auto p-3 shadow-none border border-[color:var(--palette-accent-1)]/10 bg-white"
              >
                <div className="mb-2 text-sm font-medium text-[color:var(--palette-text)]">
                  Select date range
                </div>

                <Calendar
                  mode="range"
                  numberOfMonths={isSmUp ? 2 : 1}
                  selected={tempRange}
                  onSelect={setTempRange}
                  className="rounded-md border border-[color:var(--palette-accent-1)]/10"
                />

                <div className="mt-3 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    className="shadow-none"
                    onClick={() => {
                      setTempRange(appliedRange);
                      setCustomOpen(false);
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="shadow-none bg-[color:var(--palette-btn)] text-white hover:bg-[color:var(--palette-accent-3)]"
                    disabled={!tempRange?.from || !tempRange?.to}
                    onClick={() => {
                      if (!tempRange?.from || !tempRange?.to) return;
                      setAppliedRange(tempRange);
                      setType("CUSTOM");
                      setCustomOpen(false);
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Cards (3 main cards) */}
        <section className="mt-5 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
          <StatCard
            title="Total orders"
            value={String(cards?.totalOrders ?? 0)}
            details={[`Pending: ${cards?.pendingOrders ?? 0}`]}
            info={
              <>
                Counts all orders in this range (except cancelled). Pending =
                not shipped yet.
              </>
            }
          />

          <StatCard
            title="Net sales (All placed orders)"
            value={formatBDT(cards?.netRevenueAll ?? 0)}
            details={
              cards
                ? [
                    `Gross sales: ${formatBDT(cards.grossRevenueAll)}`,
                    `Discounts: ${formatBDT(cards.totalDiscountAll)}`,
                  ]
                : undefined
            }
            info={
              <>
                Net sales = gross sales − discounts for all non-cancelled orders
                (includes Pending, Shipped, Delivered).
              </>
            }
          />

          <StatCard
            title="Fulfilled sales (Shipped + Delivered)"
            value={formatBDT(cards?.grossRevenueFulfilled ?? 0)}
            details={
              cards?.avgOrderValueAll
                ? [
                    `Avg order value (all): ${formatBDT(
                      cards.avgOrderValueAll
                    )}`,
                  ]
                : undefined
            }
            info={
              <>
                Only orders marked Shipped or Delivered are counted here.
                “Fulfilled” typically means shipped.
              </>
            }
          />
        </section>

        {/* Charts */}
        <section className="mt-5 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          {/* Trend: show netAll + fulfilled (two series) */}
          <Card className="shadow-none border-[color:var(--palette-accent-1)]/10 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[color:var(--palette-text)]">
                Trend (net vs fulfilled)
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="min-h-[280px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesSeries} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      minTickGap={24}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={56}
                      tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelKey="date"
                          formatter={(value, name) => {
                            if (
                              name === "netRevenueAll" ||
                              name === "grossRevenueFulfilled" ||
                              name === "grossRevenueAll"
                            ) {
                              return formatBDT(Number(value));
                            }
                            return String(value);
                          }}
                        />
                      }
                    />

                    <Area
                      type="monotone"
                      dataKey="netRevenueAll"
                      stroke="var(--palette-btn)"
                      fill="var(--palette-btn)"
                      fillOpacity={0.18}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="grossRevenueFulfilled"
                      stroke="var(--palette-accent-2)"
                      fill="var(--palette-accent-2)"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>

              {salesSeries.length === 0 ? (
                <p className="mt-2 text-sm text-[color:var(--palette-accent-1)]/70">
                  No sales found for this range.
                </p>
              ) : null}
            </CardContent>
          </Card>

          {/* Orders by status */}
          <Card className="shadow-none border-[color:var(--palette-accent-1)]/10 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[color:var(--palette-text)]">
                Orders by status
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="min-h-[280px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statusBreakdown}
                    margin={{ left: 8, right: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="status" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} width={40} />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelKey="status"
                          formatter={(value, name) => {
                            if (name === "grossRevenue")
                              return formatBDT(Number(value));
                            return String(value);
                          }}
                        />
                      }
                    />
                    <Bar
                      dataKey="orders"
                      fill="var(--palette-accent-1)"
                      opacity={0.85}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>

              {statusBreakdown.length === 0 ? (
                <p className="mt-2 text-sm text-[color:var(--palette-accent-1)]/70">
                  No status data for this range.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </section>

        {/* Optional: small row for pending amount (still minimal UI) */}
        <div className="mt-4 text-sm text-[color:var(--palette-accent-1)]/70">
          Pending order value (Not shipped yet):{" "}
          <span className="font-medium text-[color:var(--palette-text)]">
            {formatBDT(cards?.pendingAmount ?? 0)}
          </span>
        </div>
      </div>
    </main>
  );
}
