import ProductList from "../components/ProductList";

export default function Products() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Products</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your store inventory.</p>
      </div>
      <ProductList />
    </div>
  );
}