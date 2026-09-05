import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  HeartPulse,
  Pill,
  FileText,
  Stethoscope,
  Video,
  Sparkles,
  BarChart3,
  Siren,
  Building2,
  ShoppingBag,
  PawPrint,
  Accessibility,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutGrid },
  { to: "/health", label: "My Health", icon: HeartPulse },
  { to: "/medications", label: "Medications", icon: Pill },
  { to: "/prescriptions", label: "Prescriptions", icon: FileText },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/consultations", label: "Consultations", icon: Video },
  { to: "/ai", label: "AI Assistant", icon: Sparkles },
  { to: "/analytics", label: "Health Analytics", icon: BarChart3 },
  { to: "/emergency", label: "Emergency", icon: Siren },
  { to: "/hospitals", label: "Hospitals", icon: Building2 },
  { to: "/pharmacy", label: "Pharmacy", icon: ShoppingBag },
  { to: "/pets", label: "Pets", icon: PawPrint },
  { to: "/accessibility", label: "Accessibility", icon: Accessibility },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const user = useStore((s) => s.user);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-ink-200 lg:bg-white/70 dark:lg:border-ink-700 dark:lg:bg-ink-900/60 lg:backdrop-blur-xl">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vital-600">
          <HeartPulse size={17} className="text-white" strokeWidth={2.4} />
        </div>
        <span className="font-display text-lg font-bold tracking-tight text-ink-900 dark:text-ink-50">
          medifys
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto scrollbar-thin px-3">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-vital-600 text-white shadow-soft"
                  : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
              )
            }
          >
            <item.icon size={18} strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink-100 p-3 dark:border-ink-800">
        <button
          onClick={toggleTheme}
          className="mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
        <NavLink
          to="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-ink-100 dark:hover:bg-ink-800"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.firstName[0]}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink-900 dark:text-ink-50">{user.name}</p>
            <p className="truncate text-xs text-ink-400">{user.email}</p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}

export const navItems = nav;
