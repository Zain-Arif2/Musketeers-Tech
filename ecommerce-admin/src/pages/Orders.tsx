import RecentOrders from "../components/RecentOrders";

export default function Orders() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Orders</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track and filter all orders.</p>
      </div>
      <RecentOrders title="All Orders" />
    </div>
  );
}