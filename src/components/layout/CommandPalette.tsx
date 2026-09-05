import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Pill, Stethoscope, FileText, Calendar, Building2, type LucideIcon } from "lucide-react";
import { useStore } from "@/store/useStore";

interface Result {
  id: string;
  label: string;
  sub: string;
  icon: LucideIcon;
  to: string;
}

export function CommandPalette() {
  const open = useStore((s) => s.commandPaletteOpen);
  const setOpen = useStore((s) => s.setCommandPaletteOpen);
  const medications = useStore((s) => s.medications);
  const doctors = useStore((s) => s.doctors);
  const prescriptions = useStore((s) => s.prescriptions);
  const appointments = useStore((s) => s.appointments);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    const all: Result[] = [
      ...medications.map((m) => ({
        id: m.id,
        label: m.name,
        sub: `Medication · ${m.dosage}`,
        icon: Pill,
        to: "/medications",
      })),
      ...doctors.map((d) => ({
        id: d.id,
        label: d.name,
        sub: `Doctor · ${d.specialty}`,
        icon: Stethoscope,
        to: "/doctors",
      })),
      ...prescriptions.map((p) => ({
        id: p.id,
        label: `Prescription — ${p.date}`,
        sub: `${p.medications.length} medication(s)`,
        icon: FileText,
        to: "/prescriptions",
      })),
      ...appointments.map((a) => ({
        id: a.id,
        label: a.reason,
        sub: `Appointment · ${a.date} at ${a.time}`,
        icon: Calendar,
        to: "/doctors",
      })),
      { id: "hosp", label: "Find hospitals nearby", sub: "Navigate", icon: Building2, to: "/hospitals" },
    ];
    if (!q) return all.slice(0, 7);
    return all.filter((r) => r.label.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q)).slice(0, 8);
  }, [query, medications, doctors, prescriptions, appointments]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-lift dark:border-ink-700 dark:bg-ink-850"
          >
            <div className="flex items-center gap-3 border-b border-ink-100 px-4 py-3 dark:border-ink-800">
              <Search size={18} className="text-ink-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search medications, doctors, prescriptions, appointments…"
                className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400 dark:text-ink-100"
              />
              <kbd className="rounded border border-ink-200 px-1.5 py-0.5 text-[10px] text-ink-400 dark:border-ink-700">
                ESC
              </kbd>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin p-2">
              {results.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-ink-400">No results for "{query}"</p>
              )}
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    navigate(r.to);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-ink-100 dark:hover:bg-ink-800"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vital-100 text-vital-600 dark:bg-vital-900 dark:text-vital-300">
                    <r.icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-900 dark:text-ink-50">{r.label}</p>
                    <p className="truncate text-xs text-ink-400">{r.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
