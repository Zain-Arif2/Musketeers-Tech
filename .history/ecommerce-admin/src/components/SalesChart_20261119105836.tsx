import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { salesData } from "../data/mock";
import type { SalesPoint } from "../types";

const ranges = { "6M": 6, "12M": 12 } as const;
type Metric = "revenue" | "orders";

const money = (n: number) => `$${n.toLocaleString()}`;

interface TipProps {
  active?: boolean;
  payload?: { payload: SalesPoint }[];
  label?: string | number;
}

// Tooltip shows both revenue and orders for the hovered month
function ChartTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-white/10 dark:bg-slate-800">
      <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-sm font-semibold">{money(p.revenue)} revenue</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{p.orders} orders</p>
    </div>
  );
}

function Kpi({ label, value, sub, subColor }: { label: string; value: string; sub?: string; subColor?: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-0.5 truncate text-base font-semibold tabular-nums sm:text-lg">{value}</p>
      {sub && <p className={`truncate text-xs font-medium ${subColor ?? "text-slate-500 dark:text-slate-400"}`}>{sub}</p>}
    </div>
  );
}

export default function SalesChart() {
  const [range, setRange] = useState<keyof typeof ranges>("12M");
  const [metric, setMetric] = useState<Metric>("revenue");

  const data = salesData.slice(-ranges[range]);

  // All summary numbers are calculated from the visible data
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = data.reduce((s, d) => s + d.orders, 0);
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
  const best = data.reduce((a, b) => (b[metric] > a[metric] ? b : a), data[0]);

  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const change = prev ? ((last[metric] - prev[metric]) / prev[metric]) * 100 : 0;
  const up = change >= 0;

  // Each toggle button grows equally on mobile so the group fills the width
  const btn = (active: boolean) =>
    `flex-1 rounded-lg px-3 py-1.5 font-semibold capitalize transition sm:flex-none ${
      active
        ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-500 dark:text-white"
        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
    }`;

  return (
    <div className="animate-fade-up min-w-0 overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-6">
      {/* Title and controls: stacked on mobile, side by side from sm */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">Sales Analytics</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monthly {metric} · last {range === "6M" ? "6" : "12"} months
          </p>
        </div>
        <div className="flex w-full gap-2 text-xs lg:w-auto">
          <div className="flex flex-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5 lg:flex-none">
            {(["revenue", "orders"] as Metric[]).map((m) => (
              <button key={m} onClick={() => setMetric(m)} className={btn(metric === m)}>
                {m}
              </button>
            ))}
          </div>
          <div className="flex flex-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5 lg:flex-none">
            {(Object.keys(ranges) as (keyof typeof ranges)[]).map((r) => (
              <button key={r} onClick={() => setRange(r)} className={btn(range === r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary numbers: 2 columns on mobile, 4 from sm */}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-slate-100 py-4 dark:border-white/5 sm:grid-cols-4">
        <Kpi label="Total revenue" value={money(totalRevenue)} />
        <Kpi label="Total orders" value={totalOrders.toLocaleString()} />
        <Kpi label="Avg. order value" value={`$${avgOrderValue.toFixed(2)}`} />
        <Kpi
          label="Best month"
          value={best.month}
          sub={`${up ? "+" : ""}${change.toFixed(1)}% last month`}
          subColor={up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}
        />
      </div>

      {/* Chart: best month is highlighted */}
      <div className="mt-4 h-56 w-full min-w-0 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -20, right: 0, top: 4 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(v) => (metric === "revenue" ? `$${v / 1000}k` : String(v))}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "#94a3b8", fillOpacity: 0.12 }} />
            <Bar dataKey={metric} radius={[4, 4, 0, 0]} maxBarSize={32}>
              {data.map((d) => (
                <Cell key={d.month} fill={d.month === best.month ? "#4f46e5" : "#a5b4fc"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}