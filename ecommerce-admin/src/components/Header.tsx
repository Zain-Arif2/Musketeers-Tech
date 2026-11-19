import { Menu, Bell, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export default function Header({ onMenu }: { onMenu: () => void }) {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200/70 bg-white/70 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 sm:px-6 lg:px-8">
      <button
        onClick={onMenu}
        className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-white/10 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Search anything..."
          className="w-full rounded-xl border border-slate-200 bg-slate-100/70 py-2 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:focus:bg-white/10"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggle}
          className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
        </button>
      </div>
    </header>
  );
}