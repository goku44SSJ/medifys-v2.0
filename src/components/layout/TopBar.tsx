import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { useStore } from "@/store/useStore";
import { NotificationPanel } from "./NotificationPanel";

export function TopBar({ title }: { title: string }) {
  const setCommandOpen = useStore((s) => s.setCommandPaletteOpen);
  const notifications = useStore((s) => s.notifications);
  const unread = notifications.filter((n) => !n.read).length;
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-ink-200 bg-white/80 px-4 py-3 backdrop-blur-xl sm:px-6 dark:border-ink-700 dark:bg-ink-900/70">
      <h1 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">{title}</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCommandOpen(true)}
          className="hidden items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-400 hover:border-ink-300 sm:flex dark:border-ink-700 dark:bg-ink-850 dark:hover:border-ink-600"
        >
          <Search size={15} />
          Search
          <kbd className="ml-4 rounded border border-ink-200 px-1.5 py-0.5 text-[10px] dark:border-ink-700">⌘K</kbd>
        </button>
        <button
          onClick={() => setCommandOpen(true)}
          aria-label="Search"
          className="rounded-xl border border-ink-200 p-2.5 text-ink-500 sm:hidden dark:border-ink-700"
        >
          <Search size={17} />
        </button>
        <button
          onClick={() => setPanelOpen(true)}
          aria-label="Notifications"
          className="relative rounded-xl border border-ink-200 p-2.5 text-ink-500 hover:border-ink-300 dark:border-ink-700"
        >
          <Bell size={17} />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral-500 px-1 text-[10px] font-semibold text-white">
              {unread}
            </span>
          )}
        </button>
      </div>
      <NotificationPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </header>
  );
}
