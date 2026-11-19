import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Trash2, X } from "lucide-react";
import { products as initialProducts } from "../data/mock";

function stockInfo(stock: number) {
  if (stock === 0)
    return {
      label: "Out of stock",
      badge: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
      bar: "bg-rose-500",
    };
  if (stock <= 10)
    return {
      label: `Low stock · ${stock}`,
      badge: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
      bar: "bg-amber-500",
    };
  return {
    label: `In stock · ${stock}`,
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    bar: "bg-emerald-500",
  };
}

export default function ProductList() {
  const [params, setSearchParams] = useSearchParams();
  const [items, setItems] = useState(initialProducts);
  // Start with the search text from the URL (for example /products?q=mug)
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState("All");

  // Keep the search box in sync when the URL changes (for example from the header search)
  useEffect(() => {
    setQuery(params.get("q") ?? "");
  }, [params]);

  const categories = ["All", ...Array.from(new Set(initialProducts.map((p) => p.category)))];

  const filtered = items.filter(
    (p) => (category === "All" || p.category === category) && p.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = (id: number) => setItems((prev) => prev.filter((p) => p.id !== id));

  const clearSearch = () => {
    setQuery("");
    setSearchParams({}); // also remove ?q= from the URL
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Mobile: dropdown (hidden from sm and up) */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 sm:hidden"
          aria-label="Filter by category"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All categories" : c}
            </option>
          ))}
        </select>

        {/* Desktop: pills (hidden below sm) */}
        <div className="hidden gap-2 sm:flex">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                category === c
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Showing {filtered.length} of {items.length} products
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {filtered.map((p) => {
          const s = stockInfo(p.stock);
          return (
            <div
              key={p.id}
              className="animate-fade-up group overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900 dark:hover:shadow-none"
            >
              <div className="relative overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className={`h-44 w-full object-cover transition duration-500 group-hover:scale-105 ${
                    p.stock === 0 ? "grayscale" : ""
                  }`}
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 backdrop-blur dark:bg-slate-900/80 dark:text-slate-200">
                  {p.category}
                </span>
                {/* Hidden until hover on desktop, always visible on mobile */}
                <button
                  onClick={() => handleDelete(p.id)}
                  className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-rose-600 shadow transition hover:bg-rose-50 dark:bg-slate-900/80 lg:opacity-0 lg:group-hover:opacity-100"
                  aria-label={`Delete ${p.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold">{p.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xl font-bold">${p.price.toFixed(2)}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.badge}`}>{s.label}</span>
                </div>

                {/* Stock level bar (capped at 100 units for display) */}
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${Math.min(p.stock, 100)}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && <p className="py-16 text-center text-slate-500">No products found.</p>}
    </div>
  );
}