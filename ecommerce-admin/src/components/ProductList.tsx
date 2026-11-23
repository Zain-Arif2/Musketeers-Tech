import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Trash2, Pencil, Plus, X, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import type { Product } from "../types";
import { productsApi } from "../api/products";
import { ApiError } from "../api/client";
import ProductFormModal from "./ProductFormModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

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

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900 animate-pulse">
      <div className="h-44 w-full bg-slate-200/80 dark:bg-white/5" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded bg-slate-200/80 dark:bg-white/5" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-6 w-16 rounded bg-slate-200/80 dark:bg-white/5" />
          <div className="h-5 w-20 rounded-full bg-slate-200/80 dark:bg-white/5" />
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-200/80 dark:bg-white/5 mt-2" />
      </div>
    </div>
  );
}

export default function ProductList() {
  const [params, setSearchParams] = useSearchParams();

  // Products state
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [category, setCategory] = useState("All");

  // Dynamic list of categories discovered from items
  const [allCategories, setAllCategories] = useState<string[]>([
    "All",
    "Electronics",
    "Fashion",
    "Home",
  ]);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast / Feedback message state
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Show a temporary toast message
  const showToast = useCallback((text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => {
      setToast((curr) => (curr?.text === text ? null : curr));
    }, 4000);
  }, []);

  // Sync query when URL parameter changes
  useEffect(() => {
    const urlQuery = params.get("q") ?? "";
    setQuery(urlQuery);
    setDebouncedQuery(urlQuery);
  }, [params]);

  // Debounce search input to avoid spamming the backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch products from backend API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.getAll({
        category: category === "All" ? undefined : category,
        search: debouncedQuery.trim() ? debouncedQuery.trim() : undefined,
      });
      setItems(data);

      // Collect unique categories to keep category filter tabs up to date
      setAllCategories((prev) => {
        const discovered = data.map((p) => p.category).filter(Boolean);
        const merged = Array.from(new Set(["All", ...prev.filter((c) => c !== "All"), ...discovered]));
        return merged;
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load products. Please check if the API server is running.");
      }
    } finally {
      setLoading(false);
    }
  }, [category, debouncedQuery]);

  // Trigger fetch when category or debounced search changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const clearSearch = () => {
    setQuery("");
    setDebouncedQuery("");
    setSearchParams({});
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (product: Product) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };

  // Handle Create or Update success callback
  const handleFormSuccess = (savedProduct: Product, isUpdate: boolean) => {
    if (isUpdate) {
      setItems((prev) => prev.map((p) => (p.id === savedProduct.id ? savedProduct : p)));
      showToast(`"${savedProduct.name}" updated successfully.`);
    } else {
      setItems((prev) => [savedProduct, ...prev]);
      showToast(`"${savedProduct.name}" created successfully.`);
    }
    // Re-sync with backend to ensure proper order and category sync
    fetchProducts();
  };

  // Delete product action
  const confirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await productsApi.delete(productToDelete.id);
      setItems((prev) => prev.filter((p) => p.id !== productToDelete.id));
      showToast(`"${productToDelete.name}" deleted successfully.`);
      setProductToDelete(null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to delete product.";
      showToast(msg, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl transition-all animate-fade-up ${
            toast.type === "success"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-rose-600 text-white"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{toast.text}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 rounded p-1 opacity-70 hover:opacity-100"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900"
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

          {/* Add Product Button */}
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Mobile: Category Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 sm:hidden"
          aria-label="Filter by category"
        >
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All categories" : c}
            </option>
          ))}
        </select>

        {/* Desktop: Category Pills */}
        <div className="hidden gap-2 sm:flex">
          {allCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
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

      {/* Result Count and Status Header */}
      <div className="mb-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <p>
          {loading ? "Loading products..." : `Showing ${items.length} ${items.length === 1 ? "product" : "products"}`}
        </p>
        {loading && <RefreshCw size={14} className="animate-spin text-slate-400" />}
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900/50 dark:bg-rose-500/10">
          <AlertCircle size={32} className="mx-auto text-rose-600 dark:text-rose-400" />
          <h3 className="mt-2 text-base font-bold text-rose-900 dark:text-rose-300">Unable to load products</h3>
          <p className="mt-1 text-sm text-rose-700 dark:text-rose-400">{error}</p>
          <button
            onClick={() => fetchProducts()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      )}

      {/* Loading Skeleton Grid */}
      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <ProductSkeleton key={n} />
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((p) => {
            const s = stockInfo(p.stock);
            const imageSrc = p.imageUrl || p.image || "";

            return (
              <div
                key={p.id}
                className="animate-fade-up group overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 dark:border-white/10 dark:bg-slate-900 dark:hover:shadow-none"
              >
                {/* Image and Badges */}
                <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={imageSrc}
                    alt={p.name}
                    className={`h-44 w-full object-cover transition duration-500 group-hover:scale-105 ${
                      p.stock === 0 ? "grayscale" : ""
                    }`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  {/* Category Pill */}
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 backdrop-blur dark:bg-slate-900/80 dark:text-slate-200 shadow-sm">
                    {p.category}
                  </span>

                  {/* Action buttons (Edit & Delete) */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5 transition lg:opacity-0 lg:group-hover:opacity-100">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="rounded-full bg-white/90 p-2 text-indigo-600 shadow-sm backdrop-blur transition hover:bg-indigo-50 dark:bg-slate-900/90 dark:text-indigo-400 dark:hover:bg-slate-800"
                      aria-label={`Edit ${p.name}`}
                      title="Edit product"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setProductToDelete(p)}
                      className="rounded-full bg-white/90 p-2 text-rose-600 shadow-sm backdrop-blur transition hover:bg-rose-50 dark:bg-slate-900/90 dark:text-rose-400 dark:hover:bg-slate-800"
                      aria-label={`Delete ${p.name}`}
                      title="Delete product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate" title={p.name}>
                    {p.name}
                  </h3>
                  {p.description && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1" title={p.description}>
                      {p.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      ${p.price.toFixed(2)}
                    </span>
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
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center dark:border-slate-800">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-white/5">
            <Search size={22} />
          </div>
          <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">No products found</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {query || category !== "All"
              ? "Try adjusting your search or category filters."
              : "Your inventory is currently empty. Add your first product to get started."}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {(query || category !== "All") && (
              <button
                onClick={() => {
                  clearSearch();
                  setCategory("All");
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-white/5"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        productToEdit={productToEdit}
        existingCategories={allCategories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(productToDelete)}
        productName={productToDelete?.name ?? ""}
        isLoading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setProductToDelete(null)}
      />
    </div>
  );
}
