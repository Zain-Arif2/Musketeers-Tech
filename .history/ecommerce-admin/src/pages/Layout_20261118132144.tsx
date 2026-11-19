import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Soft decorative glows behind the content */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="relative lg:pl-72">
        <Header onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {/* The active page renders here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}