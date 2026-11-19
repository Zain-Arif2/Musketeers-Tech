import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface Props {
  title: string;
  value: string;
  change: number; // percentage vs last month
  icon: LucideIcon;
  data: number[]; // values for the mini chart
  color?: string;
}

export default function StatCard({ title, value, change, icon: Icon, data, color = "#6366f1" }: Props) {
  const positive = change >= 0;
  const id = `spark-${title.replace(/\s/g, "")}`;
  const points = data.map((v, i) => ({ i, v }));

  return (
    <div className="animate-fade-up group rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900 dark:hover:shadow-none">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}bb)`,
            boxShadow: `0 8px 20px -6px ${color}80`,
          }}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            positive
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
          }`}
        >
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}%
        </span>

        {/* Sparkline */}
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
      </div>
    </div>
  );
}