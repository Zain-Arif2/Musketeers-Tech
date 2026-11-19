import { DollarSign, ShoppingCart, Package, AlertTriangle } from "lucide-react";
import StatCard from "../components/StatCard";
import SalesChart from "../components/SalesChart";
import RecentOrders from "../components/RecentOrders";
import { salesData, products, orders, monthlyChange } from "../data/mock";
import { useFakeLoading } from "../hooks/useFakeLoading";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 dark:bg-white/5 ${className}`} />;
}

export default function Dashboard() {
  const loading = useFakeLoading();

  // Everything below is calculated from the mock data only
  const revenueSeries = salesData.map((d) => d.revenue);
  const orderSeries = salesData.map((d) => d.orders);
  const totalRevenue = revenueSeries.reduce((a, b) => a + b, 0);
  const totalOrders = orderSeries.reduce((a, b) => a + b, 0);
  const lowStockCount = products.filter((p) => p.stock <= 10).length;
  const pendingOrders = orders.filter((o) => o.status === "Processing").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back, Zain</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Here's what's happening in your store today.</p>
      </div>

      {loading ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              change={monthlyChange(revenueSeries)}
              icon={DollarSign}
              data={revenueSeries}
              color="#6366f1"
            />
            <StatCard
              title="Total Orders"
              value={totalOrders.toLocaleString()}
              change={monthlyChange(orderSeries)}
              icon={ShoppingCart}
              data={orderSeries}
              color="#06b6d4"
            />
            <StatCard
              title="Products"
              value={String(products.length)}
              icon={Package}
              color="#f59e0b"
              note={`${products.filter((p) => p.stock > 0).length} in stock`}
            />
            <StatCard
              title="Low / Out of Stock"
              value={String(lowStockCount)}
              icon={AlertTriangle}
              color="#ec4899"
              note={`${pendingOrders} orders processing`}
            />
          </div>

          <SalesChart />
          <RecentOrders />
        </>
      )}
    </div>
  );
}