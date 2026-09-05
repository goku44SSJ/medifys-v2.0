import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, Pill, Stethoscope, Siren, Sparkles, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const tiles = [
  { label: "Medications", icon: Pill, to: "/medications" },
  { label: "Doctors", icon: Stethoscope, to: "/doctors" },
  { label: "Emergency", icon: Siren, to: "/emergency" },
  { label: "AI Assistant", icon: Sparkles, to: "/ai" },
];

export function HandsFreeMode() {
  const navigate = useNavigate();
  const [simulating, setSimulating] = useState(false);
  const [gaze, setGaze] = useState({ x: 50, y: 50 });
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Simulated gaze path drifting toward each tile in sequence
  useEffect(() => {
    if (!simulating) return;
    let i = 0;
    const path = [
      { x: 25, y: 30 },
      { x: 75, y: 30 },
      { x: 25, y: 75 },
      { x: 75, y: 75 },
    ];
    const interval = setInterval(() => {
      setGaze(path[i % path.length]);
      i++;
    }, 2600);
    setGaze(path[0]);
    return () => clearInterval(interval);
  }, [simulating]);

  // Determine which tile the gaze point is nearest / hovering
  useEffect(() => {
    if (!simulating || !containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const px = container.left + (gaze.x / 100) * container.width;
    const py = container.top + (gaze.y / 100) * container.height;

    let closest: number | null = null;
    let closestDist = Infinity;
    tileRefs.current.forEach((el, idx) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.hypot(px - cx, py - cy);
      if (dist < closestDist) {
        closestDist = dist;
        closest = idx;
      }
    });
    setFocusedIndex(closestDist < 140 ? closest : null);
  }, [gaze, simulating]);

  // Hold-to-select progress
  useEffect(() => {
    if (focusedIndex === null || !simulating) {
      setHoldProgress(0);
      return;
    }
    setHoldProgress(0);
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / 2200) * 100);
      setHoldProgress(pct);
      if (pct >= 100) {
        clearInterval(id);
        const tile = tiles[focusedIndex];
        toast.success(`Selected: ${tile.label}`, { description: "Gaze-hold selection confirmed." });
        setTimeout(() => navigate(tile.to), 500);
      }
    }, 60);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedIndex, simulating]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/accessibility")} aria-label="Back">
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Hands-Free Mode</h2>
          <p className="text-ink-500 dark:text-ink-400">Experimental gaze-navigation concept — a demo, not real eye-tracking hardware.</p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
            <Eye size={16} className="text-vital-500" />
            {simulating ? "Look at an option to focus. Hold your gaze to select." : "Start the simulation to see gaze-based navigation."}
          </p>
          <Button onClick={() => setSimulating((s) => !s)} variant={simulating ? "danger" : "primary"}>
            {simulating ? "Stop simulation" : "Simulate gaze control"}
          </Button>
        </CardContent>
      </Card>

      <div ref={containerRef} className="relative overflow-hidden rounded-2xl border border-ink-200 bg-ink-50 p-8 dark:border-ink-700 dark:bg-ink-900" style={{ minHeight: 360 }}>
        <div className="grid grid-cols-2 gap-6">
          {tiles.map((tile, i) => (
            <div
              key={tile.label}
              ref={(el) => (tileRefs.current[i] = el)}
              className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 bg-white p-8 text-center transition-colors dark:bg-ink-850 ${
                focusedIndex === i ? "border-vital-500" : "border-transparent"
              }`}
            >
              {focusedIndex === i && (
                <svg className="absolute inset-0 h-full w-full -rotate-90">
                  <rect
                    x="2"
                    y="2"
                    width="calc(100% - 4px)"
                    height="calc(100% - 4px)"
                    rx="14"
                    fill="none"
                    stroke="#3F79D6"
                    strokeWidth="3"
                    strokeDasharray="100 900"
                    style={{ strokeDashoffset: 0 }}
                  />
                </svg>
              )}
              <tile.icon size={28} className="text-vital-600" />
              <p className="font-medium text-ink-900 dark:text-ink-50">{tile.label}</p>
              {focusedIndex === i && (
                <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                  <div className="h-full bg-vital-500 transition-all" style={{ width: `${holdProgress}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {simulating && (
          <motion.div
            className="pointer-events-none absolute h-6 w-6 rounded-full border-2 border-vital-500 bg-vital-400/30"
            animate={{ left: `${gaze.x}%`, top: `${gaze.y}%` }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ transform: "translate(-50%, -50%)" }}
          />
        )}
      </div>
    </div>
  );
}
