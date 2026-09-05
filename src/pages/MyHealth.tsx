import { motion } from "framer-motion";
import { RefreshCw, Footprints, HeartPulse, Moon, Flame, CheckCircle2, Scale } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { healthMetrics, currentUser } from "@/lib/mock-data";
import { useCountUp } from "@/hooks/useCountUp";

const services = [
  { name: "Google Fit", metric: "Steps, distance, activity", connected: true },
  { name: "Apple Health", metric: "Heart rate, sleep, workouts", connected: true },
  { name: "Manual entries", metric: "Weight, symptoms, notes", connected: true },
];

export function MyHealth() {
  const today = healthMetrics[healthMetrics.length - 1];
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("2 minutes ago");
  const steps = useCountUp(today.steps, 1000);

  function syncNow() {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync("Just now");
      toast.success("Health data synchronized");
    }, 1800);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">My Health</h2>
        <p className="text-ink-500 dark:text-ink-400">
          {currentUser.bloodType} · {currentUser.heightCm}cm · {currentUser.weightKg}kg
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-clover-100 text-clover-600 dark:bg-clover-600/20">
              <RefreshCw size={18} className={syncing ? "animate-spin" : ""} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink-900 dark:text-ink-50">Connected services</p>
              <p className="text-xs text-ink-400">Last synchronized {lastSync}</p>
            </div>
          </div>
          <Button size="sm" variant="secondary" onClick={syncNow} disabled={syncing}>
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} /> {syncing ? "Syncing…" : "Sync now"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {services.map((s, i) => (
          <motion.div key={s.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink-900 dark:text-ink-50">{s.name}</p>
                  {s.connected && (
                    <Badge tone="clover">
                      <CheckCircle2 size={11} /> Connected
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-ink-400">{s.metric}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="space-y-1">
            <Footprints size={16} className="text-vital-500" />
            <p className="font-display text-xl font-bold text-ink-900 dark:text-ink-50">{Math.round(steps).toLocaleString()}</p>
            <p className="text-xs text-ink-400">steps today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <HeartPulse size={16} className="text-coral-500" />
            <p className="font-display text-xl font-bold text-ink-900 dark:text-ink-50">{today.heartRate}</p>
            <p className="text-xs text-ink-400">resting bpm</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <Moon size={16} className="text-vital-500" />
            <p className="font-display text-xl font-bold text-ink-900 dark:text-ink-50">{today.sleepHours}h</p>
            <p className="text-xs text-ink-400">sleep last night</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <Flame size={16} className="text-amber-500" />
            <p className="font-display text-xl font-bold text-ink-900 dark:text-ink-50">{today.calories}</p>
            <p className="text-xs text-ink-400">calories burned</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex items-center gap-3">
          <Scale size={18} className="text-clover-600" />
          <p className="text-sm text-ink-600 dark:text-ink-300">
            Current weight <span className="font-semibold text-ink-900 dark:text-ink-50">{today.weightKg} kg</span> — trending
            gently downward over the last 60 days. See full trends in Health Analytics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
