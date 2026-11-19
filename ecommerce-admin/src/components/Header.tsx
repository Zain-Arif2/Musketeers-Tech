import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import GlobalSearch from "./GlobalSearch";
import Notifications from "./Notifications";

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

      <GlobalSearch />

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggle}
          className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <Notifications />
      </div>
    </header>
  );
}