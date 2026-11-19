import { DollarSign, ShoppingCart, Package, BarChart3 } from "lucide-react";
import StatCard from "../components/StatCard";
import SalesChart from "../components/SalesChart";
import RecentOrders from "../components/RecentOrders";
import { salesData, products } from "../data/mock";
import { useFakeLoading } from "../hooks/useFakeLoading";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 dark:bg-white/5 ${className}`} />;
}

export default function Dashboard() {
  const loading = useFakeLoading();

  const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back, Zain 👋</h2>
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
              change={12.5}
              icon={DollarSign}
              data={salesData.map((d) => d.revenue)}
              color="#6366f1"
            />
            <StatCard
              title="Total Orders"
              value={totalOrders.toLocaleString()}
              change={8.2}
              icon={ShoppingCart}
              data={salesData.map((d) => d.orders)}
              color="#06b6d4"
            />
            <StatCard
              title="Products"
              value={String(products.length)}
              change={2.4}
              icon={Package}
              data={[4, 5, 5, 6, 6, 7, 7, 8]}
              color="#f59e0b"
            />
            <StatCard
              title="Sales Growth"
              value="+18.3%"
              change={-1.1}
              icon={BarChart3}
              data={[12, 18, 15, 22, 19, 17, 21, 18]}
              color="#ec4899"
            />
          </div>

          <SalesChart />
          <RecentOrders />
        </>
      )}
    </div>
  );
}