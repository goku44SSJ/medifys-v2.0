import { formatDistanceToNow } from "date-fns";
import { Pill, Calendar, HeartPulse, Siren, FileText, Settings2, Check, Trash2, type LucideIcon } from "lucide-react";
import { Sheet } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/useStore";
import type { NotificationType } from "@/types";

const iconFor: Record<NotificationType, LucideIcon> = {
  medication: Pill,
  appointment: Calendar,
  health: HeartPulse,
  emergency: Siren,
  prescription: FileText,
  system: Settings2,
};

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const notifications = useStore((s) => s.notifications);
  const markRead = useStore((s) => s.markNotificationRead);
  const markAllRead = useStore((s) => s.markAllNotificationsRead);
  const remove = useStore((s) => s.deleteNotification);

  return (
    <Sheet open={open} onClose={onClose} title="Notifications">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-500">{notifications.filter((n) => !n.read).length} unread</p>
        <Button variant="ghost" size="sm" onClick={markAllRead}>
          Mark all read
        </Button>
      </div>
      <div className="space-y-2">
        {notifications.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-400">You're all caught up.</p>
        )}
        {notifications.map((n) => {
          const Icon = iconFor[n.type];
          return (
            <div
              key={n.id}
              className={`group flex gap-3 rounded-xl border p-3 transition ${
                n.read
                  ? "border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900"
                  : "border-vital-200 bg-vital-50 dark:border-vital-800 dark:bg-vital-900/30"
              }`}
            >
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                  n.severity === "critical"
                    ? "bg-coral-100 text-coral-600"
                    : "bg-vital-100 text-vital-600 dark:bg-vital-900 dark:text-vital-300"
                }`}
              >
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink-900 dark:text-ink-50">{n.title}</p>
                <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">{n.body}</p>
                <p className="mt-1 text-[11px] text-ink-400">
                  {formatDistanceToNow(new Date(n.time), { addSuffix: true })}
                </p>
              </div>
              <div className="flex flex-shrink-0 flex-col gap-1 opacity-0 transition group-hover:opacity-100">
                {!n.read && (
                  <button
                    aria-label="Mark as read"
                    onClick={() => markRead(n.id)}
                    className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-vital-600 dark:hover:bg-ink-800"
                  >
                    <Check size={14} />
                  </button>
                )}
                <button
                  aria-label="Delete notification"
                  onClick={() => remove(n.id)}
                  className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-coral-600 dark:hover:bg-ink-800"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}
