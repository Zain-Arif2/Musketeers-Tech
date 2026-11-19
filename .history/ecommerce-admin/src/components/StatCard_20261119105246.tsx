import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface Props {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: number; // percentage vs last month (only when real data exists)
  data?: number[]; // values for the mini chart (only when real data exists)
  note?: string; // plain text shown instead of a trend
  color?: string;
}

export default function StatCard({ title, value, icon: Icon, change, data, note, color = "#6366f1" }: Props) {
  const id = `spark-${title.replace(/[^a-zA-Z]/g, "")}`;
  const points = data?.map((v, i) => ({ i, v }));
  const positive = (change ?? 0) >= 0;

  return (
    <div className="animate-fade-up rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
          style={{ background: color }}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        {change !== undefined ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
              positive
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
            }`}
          >
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}% vs last month
          </span>
        ) : (
          <span className="text-xs text-slate-500 dark:text-slate-400">{note}</span>
        )}

        {points && (
          <div className="h-10 w-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={points}>
                <defs>
                  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${id})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}