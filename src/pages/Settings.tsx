import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  User as UserIcon,
  Sun,
  Moon,
  Cloud,
  Smartphone,
  Laptop,
  RefreshCw,
  HardDrive,
  History,
  Pill,
  FileText,
  Stethoscope,
  Calendar,
  Check,
} from "lucide-react";
import { Card, CardContent, Badge, Progress } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Form";
import { Dialog } from "@/components/ui/Dialog";
import { useStore } from "@/store/useStore";

const devices = [
  { name: "iPhone 16 Pro", icon: Smartphone, lastActive: "Active now" },
  { name: "MacBook Pro", icon: Laptop, lastActive: "2 hours ago" },
];

const restoreItems = [
  { key: "medications", label: "Medications", icon: Pill },
  { key: "prescriptions", label: "Prescriptions", icon: FileText },
  { key: "doctors", label: "Doctors", icon: Stethoscope },
  { key: "appointments", label: "Appointments", icon: Calendar },
];

export function Settings() {
  const user = useStore((s) => s.user);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const lastBackupSync = useStore((s) => s.lastBackupSync);
  const setLastBackupSync = useStore((s) => s.setLastBackupSync);

  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [restoreSelection, setRestoreSelection] = useState<string[]>(restoreItems.map((r) => r.key));
  const [restoring, setRestoring] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({ medication: true, appointment: true, health: true, emergency: true });

  function syncNow() {
    setSyncing(true);
    setSyncProgress(0);
    const id = setInterval(() => {
      setSyncProgress((p) => {
        const next = p + 14;
        if (next >= 100) {
          clearInterval(id);
          setSyncing(false);
          setLastBackupSync(new Date().toISOString());
          toast.success("Cloud backup complete");
          return 100;
        }
        return next;
      });
    }, 220);
  }

  function toggleRestoreItem(key: string) {
    setRestoreSelection((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  function runRestore() {
    setRestoring(true);
    setTimeout(() => {
      setRestoring(false);
      setRestoreOpen(false);
      toast.success("Restore complete", { description: `${restoreSelection.length} categories restored.` });
    }, 2200);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Settings</h2>
        <p className="text-ink-500 dark:text-ink-400">Profile, appearance, notifications and Medifys Cloud.</p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-semibold text-white"
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.firstName[0]}
          </div>
          <div>
            <p className="font-display font-semibold text-ink-900 dark:text-ink-50">{user.name}</p>
            <p className="text-sm text-ink-400">{user.email}</p>
          </div>
          <Button variant="secondary" size="sm" className="ml-auto" onClick={() => toast("Profile editing coming soon in this demo.")}>
            <UserIcon size={14} /> Edit profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-medium text-ink-900 dark:text-ink-50">
            {theme === "light" ? <Sun size={16} /> : <Moon size={16} />} Appearance
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-400">{theme === "light" ? "Light" : "Dark"}</span>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} label="Toggle dark mode" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3">
          <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">Notification preferences</p>
          {Object.entries(notifPrefs).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm capitalize text-ink-600 dark:text-ink-300">{key} alerts</span>
              <Switch
                checked={value}
                onCheckedChange={(v) => setNotifPrefs((p) => ({ ...p, [key]: v }))}
                label={`${key} notifications`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cloud backup */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink-900 dark:text-ink-50">
              <Cloud size={16} className="text-vital-500" /> Medifys Cloud
            </p>
            <Badge tone="clover">
              <Check size={11} /> Backed up
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-ink-400">Last synchronized</p>
              <p className="font-medium text-ink-900 dark:text-ink-50">
                {formatDistanceToNow(new Date(lastBackupSync), { addSuffix: true })}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-400">Storage used</p>
              <p className="font-medium text-ink-900 dark:text-ink-50">142 MB / 5 GB</p>
            </div>
          </div>
          <Progress value={3} tone="vital" />

          {syncing && (
            <div>
              <div className="mb-1 flex justify-between text-xs text-ink-400">
                <span>Synchronizing…</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} tone="vital" />
            </div>
          )}

          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-400">
              <HardDrive size={12} /> Devices
            </p>
            {devices.map((d) => (
              <div key={d.name} className="flex items-center justify-between rounded-lg border border-ink-100 p-2.5 text-sm dark:border-ink-800">
                <span className="flex items-center gap-2 text-ink-700 dark:text-ink-200">
                  <d.icon size={14} /> {d.name}
                </span>
                <span className="text-xs text-ink-400">{d.lastActive}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={syncNow} disabled={syncing}>
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} /> Sync now
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setRestoreOpen(true)}>
              <History size={14} /> Restore data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={restoreOpen} onClose={() => setRestoreOpen(false)} title="Restore your Medifys data" description="Choose which categories to restore from your last backup.">
        <div className="space-y-2">
          {restoreItems.map((item) => (
            <label
              key={item.key}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-ink-100 p-3 text-sm dark:border-ink-800"
            >
              <span className="flex items-center gap-2 text-ink-700 dark:text-ink-200">
                <item.icon size={14} /> {item.label}
              </span>
              <input
                type="checkbox"
                checked={restoreSelection.includes(item.key)}
                onChange={() => toggleRestoreItem(item.key)}
                className="h-4 w-4 accent-vital-600"
              />
            </label>
          ))}
        </div>
        {restoring ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-ink-500">
            <RefreshCw size={14} className="animate-spin" /> Restoring {restoreSelection.length} categories…
          </div>
        ) : (
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setRestoreOpen(false)}>
              Cancel
            </Button>
            <Button onClick={runRestore} disabled={restoreSelection.length === 0}>
              Restore selected
            </Button>
          </div>
        )}
      </Dialog>
    </div>
  );
}
