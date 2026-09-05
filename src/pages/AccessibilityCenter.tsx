import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Type, Contrast, Zap, Eye, Volume2, Keyboard, Focus, MousePointerClick, Hand, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Form";
import { useStore, type ColorBlindMode } from "@/store/useStore";

const cbModes: { key: ColorBlindMode; label: string }[] = [
  { key: "none", label: "None" },
  { key: "protanopia", label: "Protanopia" },
  { key: "deuteranopia", label: "Deuteranopia" },
  { key: "tritanopia", label: "Tritanopia" },
];

export function AccessibilityCenter() {
  const a11y = useStore((s) => s.a11y);
  const setA11y = useStore((s) => s.setA11y);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Accessibility Center</h2>
        <p className="text-ink-500 dark:text-ink-400">Every setting here actually changes the app — try one out.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-medium text-ink-900 dark:text-ink-50">
                  <Type size={16} /> Font size
                </p>
                <span className="text-xs text-ink-400">{Math.round(a11y.fontScale * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.9}
                max={1.4}
                step={0.05}
                value={a11y.fontScale}
                onChange={(e) => setA11y({ fontScale: Number(e.target.value) })}
                className="w-full accent-vital-600"
              />
            </div>

            <Row icon={Contrast} label="High contrast" checked={a11y.highContrast} onChange={(v) => setA11y({ highContrast: v })} />
            <Row icon={Zap} label="Reduced motion" checked={a11y.reducedMotion} onChange={(v) => setA11y({ reducedMotion: v })} />
            <Row icon={MousePointerClick} label="Larger controls" checked={a11y.largeControls} onChange={(v) => setA11y({ largeControls: v })} />
            <Row icon={Volume2} label="Screen reader optimized" checked={a11y.screenReaderOptimized} onChange={(v) => setA11y({ screenReaderOptimized: v })} />
            <Row icon={Keyboard} label="Keyboard navigation" checked={a11y.keyboardNav} onChange={(v) => setA11y({ keyboardNav: v })} />
            <Row icon={Focus} label="Visible focus indicators" checked={a11y.focusIndicators} onChange={(v) => setA11y({ focusIndicators: v })} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5">
            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-ink-900 dark:text-ink-50">
                <Eye size={16} /> Color-blind mode
              </p>
              <div className="flex flex-wrap gap-2">
                {cbModes.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setA11y({ colorBlindMode: m.key })}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      a11y.colorBlindMode === m.key
                        ? "border-vital-500 bg-vital-50 text-vital-700 dark:bg-vital-900/40 dark:text-vital-300"
                        : "border-ink-200 text-ink-500 dark:border-ink-700"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">Live preview</p>
              <div className="grid grid-cols-4 gap-2 rounded-xl border border-ink-100 p-3 dark:border-ink-800">
                {[
                  { c: "#3F79D6", l: "Vital" },
                  { c: "#1E9E7C", l: "Clover" },
                  { c: "#DB8F16", l: "Amber" },
                  { c: "#E15540", l: "Coral" },
                ].map((sw) => (
                  <div key={sw.l} className="flex flex-col items-center gap-1">
                    <div className="h-10 w-10 rounded-lg" style={{ backgroundColor: sw.c }} />
                    <span className="text-[10px] text-ink-400">{sw.l}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="secondary" className="w-full" onClick={() => navigate("/accessibility/hands-free")}>
              <Hand size={15} /> Open Hands-Free Mode
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setA11y({
                  fontScale: 1,
                  highContrast: false,
                  reducedMotion: false,
                  colorBlindMode: "none",
                  screenReaderOptimized: false,
                  keyboardNav: true,
                  focusIndicators: true,
                  largeControls: false,
                });
                toast("Accessibility settings reset to defaults");
              }}
            >
              Reset to defaults
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <p className="mb-3 text-sm font-semibold text-ink-900 dark:text-ink-50">Try it live</p>
          <motion.div layout className="rounded-xl border border-ink-100 bg-ink-50 p-5 dark:border-ink-800 dark:bg-ink-900">
            <p className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">This card reflects your settings</p>
            <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">
              Font size, contrast, motion and color adjustments apply across the entire application immediately — not
              just this preview.
            </p>
            <Button size="sm" className="mt-3">
              Example button
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="flex items-center gap-2 text-sm text-ink-700 dark:text-ink-200">
        <Icon size={16} /> {label}
      </p>
      <Switch checked={checked} onCheckedChange={onChange} label={label} />
    </div>
  );
}
