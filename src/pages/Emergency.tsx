import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Siren,
  Phone,
  Ambulance,
  Building2,
  Users,
  MapPin,
  Check,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { useStore } from "@/store/useStore";
import { hospitals } from "@/lib/mock-data";

type EmergencyStep = "idle" | "confirm" | "activating" | "active";
type FallState = "monitoring" | "detected" | "counting" | "resolved" | "alerted";

export function Emergency() {
  const contacts = useStore((s) => s.emergencyContacts);
  const activateEmergency = useStore((s) => s.activateEmergency);
  const resetEmergency = useStore((s) => s.resetEmergency);
  const addNotification = useStore((s) => s.addNotification);

  const [step, setStep] = useState<EmergencyStep>("idle");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [log, setLog] = useState<{ label: string; done: boolean }[]>([]);

  const [fallState, setFallState] = useState<FallState>("monitoring");
  const [countdown, setCountdown] = useState(10);
  const countdownRef = useRef<number>();

  const stages = [
    "Emergency alert activated",
    "Detecting your location…",
    "Nearest hospital identified",
    "Ambulance requested",
    "Your emergency contacts have been notified",
  ];

  function triggerEmergency() {
    setConfirmOpen(false);
    setStep("activating");
    setLog([]);
    activateEmergency();
    stages.forEach((label, i) => {
      setTimeout(() => {
        setLog((l) => [...l, { label, done: true }]);
        if (i === stages.length - 1) {
          setStep("active");
          addNotification({
            type: "emergency",
            title: "Emergency alert activated",
            body: "Your emergency contacts have been notified.",
            severity: "critical",
          });
        }
      }, (i + 1) * 850);
    });
  }

  function cancelEmergency() {
    setStep("idle");
    setLog([]);
    resetEmergency();
    toast("Emergency alert cancelled");
  }

  // Fall detection simulation
  useEffect(() => {
    if (fallState === "counting") {
      setCountdown(10);
      countdownRef.current = window.setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            window.clearInterval(countdownRef.current);
            setFallState("alerted");
            addNotification({
              type: "emergency",
              title: "Fall alert sent",
              body: "No response received — emergency contacts notified automatically.",
              severity: "critical",
            });
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => window.clearInterval(countdownRef.current);
  }, [fallState, addNotification]);

  function simulateFall() {
    setFallState("detected");
    setTimeout(() => setFallState("counting"), 1200);
  }
  function imOkay() {
    window.clearInterval(countdownRef.current);
    setFallState("resolved");
    toast.success("Glad you're okay — monitoring resumed.");
    setTimeout(() => setFallState("monitoring"), 2000);
  }
  function sendFallAlert() {
    window.clearInterval(countdownRef.current);
    setFallState("alerted");
    addNotification({ type: "emergency", title: "Fall alert sent", body: "Emergency contacts notified.", severity: "critical" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Emergency Center</h2>
        <p className="text-ink-500 dark:text-ink-400">One tap away from help — for you, and the people who care about you.</p>
      </div>

      <Card className="overflow-hidden border-coral-200 dark:border-coral-800">
        <CardContent className="flex flex-col items-center gap-5 py-10 text-center">
          <div className="relative flex h-28 w-28 items-center justify-center">
            {step === "idle" && (
              <span className="absolute inset-0 rounded-full bg-coral-400/30 animate-pulse-ring" />
            )}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => (step === "idle" ? setConfirmOpen(true) : null)}
              disabled={step !== "idle"}
              className="relative flex h-24 w-24 items-center justify-center rounded-full bg-coral-500 text-white shadow-lift disabled:opacity-70"
            >
              <Siren size={32} />
            </motion.button>
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
              {step === "idle" ? "Emergency" : step === "active" ? "Alert active" : "Activating…"}
            </p>
            <p className="text-sm text-ink-500 dark:text-ink-400">
              {step === "idle" ? "Tap to alert your contacts and nearby responders" : "Help is on the way"}
            </p>
          </div>

          {(step === "activating" || step === "active") && (
            <div className="mx-auto w-full max-w-sm space-y-2 text-left">
              {stages.map((s, i) => {
                const done = log.some((l) => l.label === s);
                return (
                  <div key={s} className="flex items-center gap-2 text-sm">
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? "bg-clover-500 text-white" : "bg-ink-100 text-ink-300 dark:bg-ink-800"}`}>
                      {done && <Check size={11} />}
                    </div>
                    <span className={done ? "text-ink-800 dark:text-ink-100" : "text-ink-400"}>{s}</span>
                  </div>
                );
              })}
              {step === "active" && (
                <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={cancelEmergency}>
                  I'm safe — cancel alert
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Call emergency", icon: Phone },
          { label: "Nearest hospital", icon: Building2 },
          { label: "Request ambulance", icon: Ambulance },
          { label: "Alert family", icon: Users },
        ].map((a) => (
          <button
            key={a.label}
            onClick={() => toast(`${a.label} — simulated action triggered`)}
            className="flex flex-col items-center gap-2 rounded-xl border border-ink-200 bg-white p-4 text-center text-xs font-medium text-ink-600 hover:border-coral-300 hover:bg-coral-50 dark:border-ink-700 dark:bg-ink-850 dark:text-ink-300"
          >
            <a.icon size={20} className="text-coral-500" />
            {a.label}
          </button>
        ))}
      </div>

      <Card>
        <CardContent>
          <p className="mb-3 text-sm font-semibold text-ink-900 dark:text-ink-50">Emergency contacts</p>
          <div className="space-y-2">
            {contacts.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-ink-100 p-3 dark:border-ink-800">
                <div>
                  <p className="text-sm font-medium text-ink-900 dark:text-ink-50">{c.name}</p>
                  <p className="text-xs text-ink-400">
                    {c.relation} · {c.phone}
                  </p>
                </div>
                {step === "active" || step === "activating" ? (
                  <Badge tone="clover">Notified</Badge>
                ) : (
                  <button onClick={() => toast(`Calling ${c.name}…`)} className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800">
                    <Phone size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fall detection */}
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-vital-500" />
              <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">Fall Detection</p>
            </div>
            <Badge tone={fallState === "monitoring" ? "clover" : "coral"}>
              {fallState === "monitoring" ? "Monitoring" : fallState === "alerted" ? "Alert sent" : "Active event"}
            </Badge>
          </div>

          <div className="flex items-center justify-center py-6">
            <div className="relative flex h-24 w-24 items-center justify-center">
              {fallState === "monitoring" && (
                <>
                  <span className="absolute h-full w-full rounded-full bg-vital-400/20 animate-pulse-ring" />
                  <span className="absolute h-full w-full rounded-full bg-vital-400/20 animate-pulse-ring" style={{ animationDelay: "0.7s" }} />
                </>
              )}
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${
                  fallState === "monitoring" ? "bg-vital-100 text-vital-600 dark:bg-vital-900" : "bg-coral-100 text-coral-600 dark:bg-coral-900/40"
                }`}
              >
                <Activity size={26} />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {fallState === "monitoring" && (
              <motion.div key="mon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <p className="mb-3 text-sm text-ink-500 dark:text-ink-400">Sensors active. We'll detect unusual motion automatically.</p>
                <Button variant="secondary" size="sm" onClick={simulateFall}>
                  Simulate Fall
                </Button>
              </motion.div>
            )}
            {fallState === "detected" && (
              <motion.p key="det" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm font-semibold text-coral-600">
                Possible fall detected…
              </motion.p>
            )}
            {fallState === "counting" && (
              <motion.div key="count" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <p className="mb-2 text-sm font-medium text-ink-700 dark:text-ink-200">
                  Sending an alert in
                </p>
                <p className="mb-4 font-display text-4xl font-bold text-coral-600">{countdown}</p>
                <div className="flex justify-center gap-2">
                  <Button size="sm" onClick={imOkay}>
                    I'm okay
                  </Button>
                  <Button size="sm" variant="danger" onClick={sendFallAlert}>
                    Send emergency alert now
                  </Button>
                </div>
              </motion.div>
            )}
            {fallState === "resolved" && (
              <motion.p key="res" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm font-medium text-clover-600">
                Marked as okay. Resuming monitoring…
              </motion.p>
            )}
            {fallState === "alerted" && (
              <motion.div key="alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <div className="mb-3 flex items-center justify-center gap-1.5 text-coral-600">
                  <ShieldAlert size={16} />
                  <p className="text-sm font-semibold">Emergency contacts notified</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => setFallState("monitoring")}>
                  Resume monitoring
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Activate emergency alert?" description="This will notify your emergency contacts and share your location.">
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={triggerEmergency}>
            <Siren size={14} /> Activate
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
