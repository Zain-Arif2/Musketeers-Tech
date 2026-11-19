import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package, ShoppingCart } from "lucide-react";
import { orders, products } from "../data/mock";
import { useClickOutside } from "../hooks/useClickOutside";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const q = query.trim().toLowerCase();

  // Derived from the query, no separate results state
  const results = useMemo(() => {
    if (!q) return { orders: [], products: [] };
    return {
      orders: orders
        .filter((o) => o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q))
        .slice(0, 4),
      products: products
        .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
        .slice(0, 4),
    };
  }, [q]);

  const hasResults = results.orders.length > 0 || results.products.length > 0;

  // Sends the clicked item's name as a query param so the target page shows only that item
  const go = (path: string, term: string) => {
    navigate(`${path}?q=${encodeURIComponent(term)}`);
    setOpen(false);
    setQuery(""); // header box is cleared, the page's own search box shows the term
  };

  return (
    <div ref={ref} className="relative hidden max-w-md flex-1 sm:block">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        placeholder="Search orders and products..."
        className="w-full rounded-xl border border-slate-200 bg-slate-100/70 py-2 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:focus:bg-white/10"
      />

      {open && q && (
        <div className="absolute left-0 right-0 top-full mt-2 max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-slate-900">
          {!hasResults && <p className="px-3 py-6 text-center text-sm text-slate-500">No results for "{query}"</p>}

          {results.products.length > 0 && (
            <div>
              <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Products</p>
              {results.products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => go("/products", p.name)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  <Package size={16} className="shrink-0 text-slate-400" />
                  <span className="min-w-0 flex-1 truncate">{p.name}</span>
                  <span className="text-xs text-slate-500">${p.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          )}

          {results.orders.length > 0 && (
            <div>
              <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Orders</p>
              {results.orders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => go("/orders", o.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  <ShoppingCart size={16} className="shrink-0 text-slate-400" />
                  <span className="min-w-0 flex-1 truncate">
                    {o.id} · {o.customer}
                  </span>
                  <span className="text-xs text-slate-500">{o.status}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}