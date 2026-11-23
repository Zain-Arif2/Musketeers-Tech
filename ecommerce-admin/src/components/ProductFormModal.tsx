import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { Product, ProductInput } from "../types";
import { productsApi } from "../api/products";
import { ApiError } from "../api/client";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (product: Product, isUpdate: boolean) => void;
  productToEdit?: Product | null;
  existingCategories?: string[];
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSuccess,
  productToEdit,
  existingCategories = [],
}: ProductFormModalProps) {
  const isEditing = Boolean(productToEdit);

  const [formData, setFormData] = useState<ProductInput>({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    imageUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Initialize form when opening or editing
  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setFormData({
          name: productToEdit.name,
          description: productToEdit.description || "",
          price: productToEdit.price,
          category: productToEdit.category,
          stock: productToEdit.stock,
          imageUrl: productToEdit.imageUrl || productToEdit.image || "",
        });
      } else {
        setFormData({
          name: "",
          description: "",
          price: 0,
          category: existingCategories.find((c) => c !== "All") || "Electronics",
          stock: 0,
          imageUrl: "",
        });
      }
      setErrors({});
      setGeneralError(null);
    }
  }, [isOpen, productToEdit, existingCategories]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.trim().length > 120) {
      newErrors.name = "Name must be 120 characters or less";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    } else if (formData.category.trim().length > 60) {
      newErrors.category = "Category must be 60 characters or less";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    } else if (formData.price > 1_000_000) {
      newErrors.price = "Price must be 1,000,000 or less";
    }

    if (!Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = "Stock must be a non-negative whole number";
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else {
      try {
        new URL(formData.imageUrl.trim());
      } catch {
        newErrors.imageUrl = "Please enter a valid URL (e.g. https://...)";
      }
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload: ProductInput = {
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        price: Number(formData.price),
        category: formData.category.trim(),
        stock: Number(formData.stock),
        imageUrl: formData.imageUrl.trim(),
      };

      let result: Product;
      if (isEditing && productToEdit) {
        result = await productsApi.update(productToEdit.id, payload);
      } else {
        result = await productsApi.create(payload);
      }

      onSuccess(result, isEditing);
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors = err.getFieldErrors();
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
        } else {
          setGeneralError(err.message);
        }
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={submitting ? undefined : onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-white/10 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEditing ? "Update product details in your store inventory" : "Add a new product to your inventory"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/5 dark:hover:text-slate-200"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Global Error Banner */}
        {generalError && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-500/10 dark:text-rose-400">
            {generalError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              className={`mt-1 w-full rounded-xl border px-3.5 py-2 text-sm outline-none transition dark:bg-white/5 ${
                errors.name
                  ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700"
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Category <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                list="category-suggestions"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Electronics, Fashion..."
                className={`mt-1 w-full rounded-xl border px-3.5 py-2 text-sm outline-none transition dark:bg-white/5 ${
                  errors.category
                    ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700"
                }`}
              />
              <datalist id="category-suggestions">
                {existingCategories
                  .filter((c) => c !== "All")
                  .map((c) => (
                    <option key={c} value={c} />
                  ))}
              </datalist>
              {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="1000000"
                value={formData.price === 0 && !isEditing ? "" : formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="29.99"
                className={`mt-1 w-full rounded-xl border px-3.5 py-2 text-sm outline-none transition dark:bg-white/5 ${
                  errors.price
                    ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700"
                }`}
              />
              {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price}</p>}
            </div>
          </div>

          {/* Stock & Image URL */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Stock Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                placeholder="10"
                className={`mt-1 w-full rounded-xl border px-3.5 py-2 text-sm outline-none transition dark:bg-white/5 ${
                  errors.stock
                    ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700"
                }`}
              />
              {errors.stock && <p className="mt-1 text-xs text-rose-500">{errors.stock}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Image URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className={`mt-1 w-full rounded-xl border px-3.5 py-2 text-sm outline-none transition dark:bg-white/5 ${
                  errors.imageUrl
                    ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700"
                }`}
              />
              {errors.imageUrl && <p className="mt-1 text-xs text-rose-500">{errors.imageUrl}</p>}
            </div>
          </div>

          {/* Image Preview if URL provided */}
          {formData.imageUrl && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-2 dark:border-white/5 dark:bg-white/5">
              <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-200 dark:bg-white/10 shrink-0">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'/%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">Image Preview</p>
                <p className="truncate text-[11px] text-slate-400">{formData.imageUrl}</p>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief details about the product..."
              className={`mt-1 w-full rounded-xl border px-3.5 py-2 text-sm outline-none transition dark:bg-white/5 ${
                errors.description
                  ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700"
              }`}
            />
            {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {isEditing ? (submitting ? "Saving..." : "Save Changes") : submitting ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
