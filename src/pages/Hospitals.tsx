import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Building2, Star, BedDouble, Ambulance, ShieldPlus, Navigation, MapPin, Search } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Field, Select } from "@/components/ui/Form";
import { hospitals } from "@/lib/mock-data";

type FilterKey = "emergency" | "icu" | "beds" | "pharmacy" | "ambulance";

const filters: { key: FilterKey; label: string }[] = [
  { key: "emergency", label: "Emergency" },
  { key: "icu", label: "ICU" },
  { key: "beds", label: "General beds" },
  { key: "pharmacy", label: "Pharmacy" },
  { key: "ambulance", label: "Ambulance" },
];

type BookingStage = "form" | "searching" | "found";

export function Hospitals() {
  const [active, setActive] = useState<FilterKey[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [stage, setStage] = useState<BookingStage>("form");
  const [pickup, setPickup] = useState("Home — 12 Lakeview Residency");
  const [hospitalChoice, setHospitalChoice] = useState(hospitals[0].id);
  const [emergencyType, setEmergencyType] = useState("General");

  function toggleFilter(k: FilterKey) {
    setActive((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  }

  const filtered = useMemo(() => {
    return hospitals.filter((h) => {
      if (active.includes("emergency") && !h.emergency) return false;
      if (active.includes("icu") && h.icuBeds === 0) return false;
      if (active.includes("beds") && h.generalBeds === 0) return false;
      if (active.includes("pharmacy") && !h.pharmacy) return false;
      if (active.includes("ambulance") && !h.ambulance) return false;
      return true;
    });
  }, [active]);

  function bookAmbulance() {
    setStage("searching");
    setTimeout(() => setStage("found"), 2200);
  }

  const chosen = hospitals.find((h) => h.id === hospitalChoice);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Hospitals</h2>
          <p className="text-ink-500 dark:text-ink-400">Find nearby care and book an ambulance if needed.</p>
        </div>
        <Button
          onClick={() => {
            setBookingOpen(true);
            setStage("form");
          }}
        >
          <Ambulance size={16} /> Book ambulance
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => toggleFilter(f.key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              active.includes(f.key)
                ? "border-vital-500 bg-vital-50 text-vital-700 dark:bg-vital-900/40 dark:text-vital-300"
                : "border-ink-200 text-ink-500 dark:border-ink-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stylized map */}
      <Card className="overflow-hidden">
        <CardContent className="relative h-64 bg-gradient-to-br from-vital-50 to-ink-50 p-0 dark:from-ink-900 dark:to-ink-950">
          <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink-300 dark:text-ink-700" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-vital-600 text-white shadow-glow">
            <Navigation size={14} />
          </div>
          {filtered.map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHospital(h.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition hover:scale-110"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              title={h.name}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-lift ${
                  h.emergency ? "bg-coral-500" : "bg-ink-500"
                } text-white`}
              >
                <Building2 size={14} />
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((h, i) => (
          <motion.div key={h.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className={selectedHospital === h.id ? "ring-2 ring-vital-500" : ""}>
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display font-semibold text-ink-900 dark:text-ink-50">{h.name}</p>
                    <p className="flex items-center gap-1 text-xs text-ink-400">
                      <MapPin size={12} /> {h.distanceKm} km away
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <Star size={12} fill="currentColor" /> {h.rating}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {h.emergency && <Badge tone="coral">Emergency</Badge>}
                  {h.icuBeds > 0 && <Badge tone="vital">{h.icuBeds} ICU beds</Badge>}
                  {h.generalBeds > 0 && <Badge tone="neutral"><BedDouble size={11} /> {h.generalBeds} beds</Badge>}
                  {h.pharmacy && <Badge tone="clover">Pharmacy</Badge>}
                  {h.ambulance && <Badge tone="amber"><ShieldPlus size={11} /> Ambulance</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => toast(`Directions to ${h.name}`)}>
                    Directions
                  </Button>
                  {h.ambulance && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setHospitalChoice(h.id);
                        setBookingOpen(true);
                        setStage("form");
                      }}
                    >
                      Book ambulance
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title={stage === "found" ? "Ambulance found" : "Book an ambulance"}
      >
        {stage === "form" && (
          <div className="space-y-3">
            <Field label="Pickup location" htmlFor="pickup">
              <input
                id="pickup"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm outline-none focus:border-vital-500 dark:border-ink-700 dark:bg-ink-900"
              />
            </Field>
            <Field label="Destination hospital" htmlFor="hosp-choice">
              <Select id="hosp-choice" value={hospitalChoice} onChange={(e) => setHospitalChoice(e.target.value)}>
                {hospitals.filter((h) => h.ambulance).map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Emergency type" htmlFor="etype">
              <Select id="etype" value={emergencyType} onChange={(e) => setEmergencyType(e.target.value)}>
                <option>General</option>
                <option>Cardiac</option>
                <option>Trauma / Accident</option>
                <option>Respiratory</option>
              </Select>
            </Field>
            <Button className="mt-2 w-full" onClick={bookAmbulance}>
              <Search size={14} /> Find ambulance
            </Button>
          </div>
        )}

        {stage === "searching" && (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                  className="h-2 w-2 rounded-full bg-vital-500"
                />
              ))}
            </div>
            <p className="text-sm text-ink-500">Searching for the nearest available ambulance…</p>
          </div>
        )}

        {stage === "found" && chosen && (
          <div className="space-y-3">
            <div className="rounded-xl bg-clover-50 p-3 text-sm text-clover-700 dark:bg-clover-600/10 dark:text-clover-300">
              Ambulance located and dispatched to {pickup}.
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-ink-400">ETA</p>
                <p className="font-semibold text-ink-900 dark:text-ink-50">7 minutes</p>
              </div>
              <div>
                <p className="text-xs text-ink-400">Driver</p>
                <p className="font-semibold text-ink-900 dark:text-ink-50">Suresh K.</p>
              </div>
              <div>
                <p className="text-xs text-ink-400">Vehicle</p>
                <p className="font-semibold text-ink-900 dark:text-ink-50">MH-04 AB 2291</p>
              </div>
              <div>
                <p className="text-xs text-ink-400">Destination</p>
                <p className="font-semibold text-ink-900 dark:text-ink-50">{chosen.name}</p>
              </div>
            </div>
            <div className="relative h-32 overflow-hidden rounded-xl bg-ink-50 dark:bg-ink-900">
              <svg className="absolute inset-0 h-full w-full opacity-30">
                <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink-300 dark:text-ink-700" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid2)" />
              </svg>
              <motion.div
                className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-coral-500 text-white"
                animate={{ left: ["10%", "80%"], top: ["70%", "20%"] }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              >
                <Ambulance size={12} />
              </motion.div>
            </div>
            <Button className="w-full" variant="secondary" onClick={() => setBookingOpen(false)}>
              Close
            </Button>
          </div>
        )}
      </Dialog>
    </div>
  );
}
