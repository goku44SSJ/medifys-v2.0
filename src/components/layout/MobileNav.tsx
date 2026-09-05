import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutGrid, Pill, Sparkles, Siren, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet } from "@/components/ui/Dialog";
import { navItems } from "./Sidebar";

const primary = [
  { to: "/dashboard", label: "Overview", icon: LayoutGrid },
  { to: "/medications", label: "Meds", icon: Pill },
  { to: "/ai", label: "AI", icon: Sparkles },
  { to: "/emergency", label: "SOS", icon: Siren },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-ink-200 bg-white/90 px-2 py-2 backdrop-blur-xl lg:hidden dark:border-ink-700 dark:bg-ink-900/90">
        {primary.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium",
                isActive ? "text-vital-600" : "text-ink-400"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              {item.label}
            </NavLink>
          );
        })}
        <button
          onClick={() => setOpen(true)}
          className="flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium text-ink-400"
        >
          <Menu size={20} />
          More
        </button>
      </nav>

      <Sheet open={open} onClose={() => setOpen(false)} title="Menu" side="bottom">
        <div className="grid grid-cols-3 gap-3 pb-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex flex-col items-center gap-2 rounded-xl border border-ink-100 p-3 text-center text-xs font-medium text-ink-600 hover:border-vital-300 hover:bg-vital-50 dark:border-ink-700 dark:text-ink-300 dark:hover:bg-ink-800"
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </Sheet>
    </>
  );
}
