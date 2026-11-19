import { useState } from "react";
import { Search } from "lucide-react";
import { orders } from "../data/mock";
import type { OrderStatus } from "../types";

const statusStyles: Record<OrderStatus, { badge: string; dot: string }> = {
  Delivered: { badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400", dot: "bg-emerald-500" },
  Processing: { badge: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400", dot: "bg-amber-500" },
  Shipped: { badge: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400", dot: "bg-blue-500" },
  Cancelled: { badge: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400", dot: "bg-rose-500" },
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

// Reusable status badge used by both the card and table layouts
function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status].badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusStyles[status].dot}`} />
      {status}
    </span>
  );
}

export default function RecentOrders({ title = "Recent Orders" }: { title?: string }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | OrderStatus>("All");

  // Derived from state on every render
  const filtered = orders.filter(
    (o) =>
      (status === "All" || o.status === status) &&
      (o.customer.toLowerCase().includes(query.toLowerCase()) || o.id.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="animate-fade-up min-w-0 rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
      {/* Header: stacked on mobile, side by side on larger screens */}
      <div className="flex flex-col gap-3 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative sm:w-56">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search orders..."
              className="w-full rounded-xl border border-slate-200 bg-transparent py-2 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "All" | OrderStatus)}
            className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-slate-900 sm:w-auto"
          >
            {["All", "Delivered", "Processing", "Shipped", "Cancelled"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile: card list (hidden from md and up) */}
      <ul className="divide-y divide-slate-100 border-t border-slate-100 dark:divide-white/5 dark:border-white/5 md:hidden">
        {filtered.map((o) => (
          <li key={o.id} className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                  {initials(o.customer)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{o.customer}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{o.id}</p>
                </div>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">{o.date}</span>
              <span className="font-semibold">${o.total.toFixed(2)}</span>
            </div>
          </li>
        ))}
        {filtered.length === 0 && <li className="p-8 text-center text-sm text-slate-500">No orders found.</li>}
      </ul>

      {/* Desktop: table (hidden below md) */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-y border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-500 dark:border-white/5 dark:bg-white/[0.03]">
            <tr>
              <th className="px-6 py-3 font-semibold">Order</th>
              <th className="px-6 py-3 font-semibold">Customer</th>
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold">Total</th>
              <th className="px-6 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr
                key={o.id}
                className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/[0.03]"
              >
                <td className="px-6 py-4 font-semibold">{o.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                      {initials(o.customer)}
                    </div>
                    {o.customer}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{o.date}</td>
                <td className="px-6 py-4 font-medium">${o.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={o.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}