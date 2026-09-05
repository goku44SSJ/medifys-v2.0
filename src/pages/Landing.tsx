import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartPulse, Pill, Stethoscope, Sparkles, Siren, ShoppingBag, Users, PawPrint, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const nodes = [
  { label: "Medication", icon: Pill, angle: -100, color: "#3F79D6" },
  { label: "Doctors", icon: Stethoscope, angle: -40, color: "#1E9E7C" },
  { label: "AI", icon: Sparkles, angle: 20, color: "#DB8F16" },
  { label: "Emergency", icon: Siren, angle: 80, color: "#E15540" },
  { label: "Pharmacy", icon: ShoppingBag, angle: 140, color: "#3F79D6" },
  { label: "Family", icon: Users, angle: 200, color: "#1E9E7C" },
  { label: "Pets", icon: PawPrint, angle: 260, color: "#DB8F16" },
];

function polar(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: 200 + radius * Math.cos(rad), y: 200 + radius * Math.sin(rad) };
}

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-ink-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-vital-800/40 blur-3xl animate-drift-slow" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-clover-600/20 blur-3xl animate-drift-slow" style={{ animationDelay: "3s" }} />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vital-600">
            <HeartPulse size={17} strokeWidth={2.4} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">medifys</span>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate("/dashboard")}>
          Enter Medifys
        </Button>
      </header>

      <section className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-24 pt-8 sm:px-10 lg:grid-cols-2 lg:pt-16">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900/60 px-3 py-1 text-xs text-ink-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-clover-400" />
            Your personal health operating system
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            Your health, intelligently connected.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 max-w-md text-balance text-lg text-ink-300"
          >
            Medications, doctors, prescriptions, emergencies and everyday wellbeing — Medifys
            brings your entire healthcare journey into one calm, connected place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button size="lg" onClick={() => navigate("/dashboard")}>
              Enter Medifys
              <ArrowRight size={16} />
            </Button>
            <Button size="lg" variant="outline" className="border-ink-700 text-ink-100 hover:bg-ink-900" onClick={() => navigate("/health")}>
              Explore the platform
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex items-center gap-6 text-sm text-ink-400"
          >
            <div>
              <p className="font-display text-2xl font-semibold text-ink-50">14</p>
              <p>connected modules</p>
            </div>
            <div className="h-8 w-px bg-ink-800" />
            <div>
              <p className="font-display text-2xl font-semibold text-ink-50">24/7</p>
              <p>emergency-ready</p>
            </div>
            <div className="h-8 w-px bg-ink-800" />
            <div>
              <p className="font-display text-2xl font-semibold text-ink-50">100%</p>
              <p>cross-device sync</p>
            </div>
          </motion.div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md">
          <svg viewBox="0 0 400 400" className="h-full w-full">
            {nodes.map((n, i) => {
              const p = polar(n.angle, 148);
              return (
                <motion.line
                  key={`line-${i}`}
                  x1="200"
                  y1="200"
                  x2={p.x}
                  y2={p.y}
                  stroke="#2E5FB0"
                  strokeWidth="1"
                  strokeOpacity="0.35"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.07 }}
                />
              );
            })}
            <motion.circle
              cx="200"
              cy="200"
              r="150"
              fill="none"
              stroke="#1B3A70"
              strokeDasharray="2 6"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              transition={{ opacity: { duration: 1 }, rotate: { duration: 60, repeat: Infinity, ease: "linear" } }}
              style={{ transformOrigin: "200px 200px" }}
            />
          </svg>

          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-vital-500 to-vital-800 shadow-glow"
          >
            <HeartPulse size={32} strokeWidth={2} />
          </motion.div>

          {nodes.map((n, i) => {
            const p = polar(n.angle, 148);
            return (
              <motion.div
                key={n.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.07, type: "spring" }}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
                style={{ left: `${(p.x / 400) * 100}%`, top: `${(p.y / 400) * 100}%` }}
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-700 bg-ink-900/90 shadow-soft"
                  style={{ color: n.color }}
                >
                  <n.icon size={18} />
                </div>
                <span className="text-[11px] text-ink-400">{n.label}</span>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
