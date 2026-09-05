import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Footprints, Flame, HeartPulse, Moon, Calendar, Pill, Clock, MapPin, FileText, Stethoscope } from "lucide-react";
import { Card, CardContent, Badge, Progress } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HealthScoreRing } from "@/components/dashboard/HealthScoreRing";
import { useStore, selectAdherence } from "@/store/useStore";
import { healthMetrics } from "@/lib/mock-data";
import { nextDose, remainingToday, slotLabel } from "@/lib/medication-utils";
import { useCountUp } from "@/hooks/useCountUp";
import { formatDuration } from "@/lib/utils";

const iconMap = { pill: Pill, steps: Footprints, prescription: FileText, doctor: Stethoscope, heart: HeartPulse, sleep: Moon };

function useCountdown(target: Date | null) {
  const [remaining, setRemaining] = useState(target ? target.getTime() - Date.now() : 0);
  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setRemaining(target.getTime() - Date.now()), 1000 * 30);
    return () => clearInterval(id);
  }, [target]);
  return Math.max(0, Math.round(remaining / 60000));
}

export function Dashboard() {
  const user = useStore((s) => s.user);
  const medications = useStore((s) => s.medications);
  const updateStatus = useStore((s) => s.updateMedicationStatus);
  const doctors = useStore((s) => s.doctors);
  const appointments = useStore((s) => s.appointments);
  const timeline = useStore((s) => s.timeline);
  const adherence = useStore(selectAdherence);

  const today = healthMetrics[healthMetrics.length - 1];
  const yesterday = healthMetrics[healthMetrics.length - 2];
  const stepsDelta = Math.round(((today.steps - yesterday.steps) / yesterday.steps) * 100);

  const upcoming = appointments.find((a) => a.status === "upcoming");
  const upcomingDoctor = doctors.find((d) => d.id === upcoming?.doctorId);

  const next = useMemo(() => nextDose(medications), [medications]);
  const minsLeft = useCountdown(next?.at ?? null);
  const remaining = remainingToday(medications);

  const steps = useCountUp(today.steps, 1100);
  const heart = useCountUp(today.heartRate, 900);

  function markTaken() {
    if (!next) return;
    updateStatus(next.med.id, next.slot, "taken");
    toast.success(`${next.med.name} marked as taken`, { description: `${slotLabel[next.slot]} dose logged.` });
  }
  function snooze() {
    if (!next) return;
    updateStatus(next.med.id, next.slot, "snoozed");
    toast(`${next.med.name} snoozed`, { description: "We'll remind you again in 15 minutes." });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50 sm:text-3xl"
        >
          Good morning, {user.firstName}
        </motion.h2>
        <p className="text-ink-500 dark:text-ink-400">Here's your health at a glance today.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Medication */}
        <Card className="lg:col-span-2">
          <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge tone="vital">{remaining} medications remaining today</Badge>
              {next ? (
                <>
                  <p className="mt-3 font-display text-xl font-semibold text-ink-900 dark:text-ink-50">
                    {next.med.name} — {next.med.dosage}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400">
                    <Clock size={14} /> Next dose in {formatDuration(minsLeft)}
                  </p>
                </>
              ) : (
                <p className="mt-3 text-sm text-ink-500">All doses complete for today. Nicely done.</p>
              )}
            </div>
            {next && (
              <div className="flex flex-shrink-0 gap-2">
                <Button onClick={markTaken}>Mark as taken</Button>
                <Button variant="secondary" onClick={snooze}>
                  Snooze
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health score */}
        <Card>
          <CardContent className="flex items-center justify-center gap-5">
            <HealthScoreRing score={87} label="Excellent" />
            <div className="space-y-2 text-sm">
              <p className="text-ink-500 dark:text-ink-400">Adherence</p>
              <p className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">{adherence}%</p>
              <Progress value={adherence} tone="clover" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-ink-400">
              <Footprints size={16} />
              <span className="text-xs font-medium uppercase tracking-wide">Steps</span>
            </div>
            <p className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">{Math.round(steps).toLocaleString()}</p>
            <p className={`text-xs font-medium ${stepsDelta >= 0 ? "text-clover-600" : "text-coral-600"}`}>
              {stepsDelta >= 0 ? "+" : ""}
              {stepsDelta}% vs yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-ink-400">
              <Flame size={16} />
              <span className="text-xs font-medium uppercase tracking-wide">Calories</span>
            </div>
            <p className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">{today.calories.toLocaleString()}</p>
            <p className="text-xs text-ink-400">kcal burned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-ink-400">
              <HeartPulse size={16} />
              <span className="text-xs font-medium uppercase tracking-wide">Resting HR</span>
            </div>
            <p className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">{Math.round(heart)}</p>
            <p className="text-xs text-ink-400">bpm</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-ink-400">
              <Moon size={16} />
              <span className="text-xs font-medium uppercase tracking-wide">Sleep</span>
            </div>
            <p className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">{formatDuration(Math.round(today.sleepHours * 60))}</p>
            <p className="text-xs text-ink-400">last night</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent>
            <p className="mb-3 text-sm font-semibold text-ink-900 dark:text-ink-50">Upcoming appointment</p>
            {upcoming && upcomingDoctor ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: upcomingDoctor.avatarColor }}
                  >
                    {upcomingDoctor.name.split(" ")[1]?.[0] ?? "D"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-900 dark:text-ink-50">{upcomingDoctor.name}</p>
                    <p className="text-xs text-ink-400">{upcomingDoctor.specialty}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm text-ink-500 dark:text-ink-400">
                  <p className="flex items-center gap-1.5">
                    <Calendar size={14} /> {upcoming.date} · {upcoming.time}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin size={14} /> {upcoming.location}
                  </p>
                </div>
                <Link to="/doctors">
                  <Button variant="secondary" size="sm" className="w-full">
                    View details
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-ink-400">No upcoming appointments.</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent>
            <p className="mb-4 text-sm font-semibold text-ink-900 dark:text-ink-50">Today's timeline</p>
            <div className="space-y-4">
              {timeline.slice(0, 6).map((t, i) => {
                const Icon = iconMap[t.icon];
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3"
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vital-100 text-vital-600 dark:bg-vital-900 dark:text-vital-300">
                        <Icon size={14} />
                      </div>
                      {i < 5 && <div className="mt-1 h-full w-px flex-1 bg-ink-100 dark:bg-ink-800" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-xs text-ink-400">{t.time}</p>
                      <p className="text-sm font-medium text-ink-900 dark:text-ink-50">{t.label}</p>
                      <p className="text-xs text-ink-500 dark:text-ink-400">{t.detail}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
