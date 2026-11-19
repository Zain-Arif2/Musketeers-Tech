import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, AlertTriangle, ShoppingCart } from "lucide-react";
import { orders, products } from "../data/mock";
import { useClickOutside } from "../hooks/useClickOutside";

interface Notice {
  id: string;
  title: string;
  detail: string;
  to: string;
  kind: "stock" | "order";
}

// Notifications are built from the mock data only
const allNotices: Notice[] = [
  ...products
    .filter((p) => p.stock <= 10)
    .map<Notice>((p) => ({
      id: `p-${p.id}`,
      title: p.stock === 0 ? `${p.name} is out of stock` : `${p.name} is low on stock`,
      detail: p.stock === 0 ? "Restock needed" : `${p.stock} units left`,
      to: "/products",
      kind: "stock",
    })),
  ...orders
    .filter((o) => o.status === "Processing")
    .map<Notice>((o) => ({
      id: `o-${o.id}`,
      title: `Order ${o.id} is processing`,
      detail: `${o.customer} · $${o.total.toFixed(2)}`,
      to: "/orders",
      kind: "order",
    })),
];

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const navigate = useNavigate();
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  // Unread count is derived, not stored
  const unread = allNotices.filter((n) => !readIds.includes(n.id)).length;

  const markAllRead = () => setReadIds(allNotices.map((n) => n.id));

  const openNotice = (n: Notice) => {
    setReadIds((prev) => (prev.includes(n.id) ? prev : [...prev, n.id]));
    setOpen(false);
    navigate(n.to);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
        aria-label={`Notifications, ${unread} unread`}
        aria-expanded={open}
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed left-4 right-4 top-16 z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-slate-900 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:w-96">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-white/5">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <button
              onClick={markAllRead}
              disabled={unread === 0}
              className="text-xs font-medium text-indigo-600 disabled:text-slate-400 dark:text-indigo-400"
            >
              Mark all as read
            </button>
          </div>

          <ul className="max-h-96 divide-y divide-slate-100 overflow-y-auto dark:divide-white/5">
            {allNotices.map((n) => {
              const isRead = readIds.includes(n.id);
              const Icon = n.kind === "stock" ? AlertTriangle : ShoppingCart;
              return (
                <li key={n.id}>
                  <button
                    onClick={() => openNotice(n)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        n.kind === "stock"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10"
                          : "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10"
                      }`}
                    >
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm ${isRead ? "text-slate-500" : "font-semibold"}`}>{n.title}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{n.detail}</p>
                    </div>
                    {!isRead && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />}
                  </button>
                </li>
              );
            })}
            {allNotices.length === 0 && <li className="px-4 py-8 text-center text-sm text-slate-500">All caught up.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}