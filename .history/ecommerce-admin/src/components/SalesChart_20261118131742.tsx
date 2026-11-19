import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { salesData } from "../data/mock";

const ranges = { "6M": 6, "12M": 12 } as const;

interface TipProps {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string | number;
}

// Custom tooltip so it follows light/dark theme through Tailwind classes
function ChartTooltip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-white/10 dark:bg-slate-800">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-sm font-bold">${Number(payload[0].value).toLocaleString()}</p>
    </div>
  );
}

export default function SalesChart() {
  const [range, setRange] = useState<keyof typeof ranges>("12M");
  const data = salesData.slice(-ranges[range]);

  return (
    <div className="animate-fade-up rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Sales Analytics</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Revenue over time</p>
        </div>
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs dark:bg-white/5">
          {(Object.keys(ranges) as (keyof typeof ranges)[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-lg px-3.5 py-1.5 font-semibold transition ${
                range === r
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-500 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -10, right: 4 }}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#6366f1", strokeOpacity: 0.3 }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#rev)"
              activeDot={{ r: 6, strokeWidth: 3, stroke: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}