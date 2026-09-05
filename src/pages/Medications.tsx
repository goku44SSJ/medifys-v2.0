import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Plus, Check, SkipForward, Clock3, Pencil, Trash2, Sunrise, Sun, Sunset, MoonStar, Camera, Upload, type LucideIcon } from "lucide-react";
import { Card, CardContent, Badge, Progress } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/Form";
import { useStore } from "@/store/useStore";
import { doctors } from "@/lib/mock-data";
import { slotLabel, todayStatus } from "@/lib/medication-utils";
import type { MedFrequency, MedSlot } from "@/types";
import { differenceInDays, parseISO } from "date-fns";

const slotIcon: Record<MedSlot, LucideIcon> = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Sunset,
  night: MoonStar,
};

export function Medications() {
  const medications = useStore((s) => s.medications);
  const updateStatus = useStore((s) => s.updateMedicationStatus);
  const addMedication = useStore((s) => s.addMedication);
  const deleteMedication = useStore((s) => s.deleteMedication);
  const [addOpen, setAddOpen] = useState(false);

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState<MedFrequency>("daily");
  const [slots, setSlots] = useState<MedSlot[]>(["morning"]);
  const [instructions, setInstructions] = useState("");
  const [quantity, setQuantity] = useState(30);
  const [expiry, setExpiry] = useState("2027-01-01");
  const [scanState, setScanState] = useState<"idle" | "scanning" | "done">("idle");

  function toggleSlot(s: MedSlot) {
    setSlots((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function simulateScan() {
    setScanState("scanning");
    setTimeout(() => {
      setScanState("done");
      setName("Azithromycin");
      setDosage("250 mg");
      setFrequency("daily");
      setSlots(["morning"]);
      setInstructions("Take once daily for 5 days, with or without food.");
      toast.success("Prescription detected", { description: "Fields auto-filled — review before saving." });
    }, 1800);
  }

  function submit() {
    if (!name || !dosage) {
      toast.error("Add a name and dosage to continue.");
      return;
    }
    addMedication({
      name,
      dosage,
      frequency,
      slots,
      instructions,
      remainingQuantity: quantity,
      totalQuantity: quantity,
      expiryDate: expiry,
      startDate: new Date().toISOString().slice(0, 10),
      color: "#3F79D6",
    });
    toast.success(`${name} added to your medications`);
    setAddOpen(false);
    setName("");
    setDosage("");
    setInstructions("");
    setScanState("idle");
  }

  const slotBuckets = useMemo(() => {
    const buckets: Record<MedSlot, typeof medications> = { morning: [], afternoon: [], evening: [], night: [] };
    for (const med of medications) {
      for (const slot of med.slots) buckets[slot].push(med);
    }
    return buckets;
  }, [medications]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Medications</h2>
          <p className="text-ink-500 dark:text-ink-400">Manage every prescription, dose and refill in one place.</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus size={16} /> Add medication
        </Button>
      </div>

      {/* Daily timeline */}
      <Card>
        <CardContent>
          <p className="mb-4 text-sm font-semibold text-ink-900 dark:text-ink-50">Today's schedule</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(["morning", "afternoon", "evening", "night"] as MedSlot[]).map((slot) => {
              const Icon = slotIcon[slot];
              return (
                <div key={slot} className="rounded-xl border border-ink-100 p-3 dark:border-ink-800">
                  <div className="mb-2 flex items-center gap-2 text-ink-400">
                    <Icon size={15} />
                    <span className="text-xs font-medium">{slotLabel[slot]}</span>
                  </div>
                  <div className="space-y-1.5">
                    {slotBuckets[slot].length === 0 && <p className="text-xs text-ink-300">Nothing scheduled</p>}
                    {slotBuckets[slot].map((med) => {
                      const status = todayStatus(med, slot);
                      return (
                        <motion.button
                          key={med.id}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => updateStatus(med.id, slot, status === "taken" ? "taken" : "taken")}
                          className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition ${
                            status === "taken"
                              ? "bg-clover-100 text-clover-700 dark:bg-clover-600/20 dark:text-clover-300"
                              : status === "skipped"
                              ? "bg-coral-100 text-coral-600 dark:bg-coral-600/20"
                              : "bg-ink-50 text-ink-600 hover:bg-vital-50 dark:bg-ink-900 dark:text-ink-300"
                          }`}
                        >
                          <span
                            className="h-2 w-2 flex-shrink-0 rounded-full"
                            style={{ backgroundColor: med.color }}
                          />
                          <span className="flex-1 truncate">{med.name}</span>
                          {status === "taken" && <Check size={12} />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Medication list */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {medications.map((med, i) => {
          const doctor = doctors.find((d) => d.id === med.doctorId);
          const daysToExpiry = differenceInDays(parseISO(med.expiryDate), new Date());
          const stockPct = (med.remainingQuantity / med.totalQuantity) * 100;
          return (
            <motion.div key={med.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card>
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                        style={{ backgroundColor: med.color }}
                      >
                        <Clock3 size={16} />
                      </div>
                      <div>
                        <p className="font-display font-semibold text-ink-900 dark:text-ink-50">{med.name}</p>
                        <p className="text-xs text-ink-400">
                          {med.dosage} · {med.slots.map((s) => slotLabel[s]).join(", ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800" aria-label="Edit">
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => {
                          deleteMedication(med.id);
                          toast(`${med.name} removed`);
                        }}
                        className="rounded-lg p-1.5 text-ink-400 hover:bg-coral-100 hover:text-coral-600 dark:hover:bg-coral-600/20"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-ink-500 dark:text-ink-400">{med.instructions}</p>

                  <div className="flex flex-wrap gap-2">
                    {doctor && <Badge tone="vital">Prescribed by {doctor.name}</Badge>}
                    <Badge tone={daysToExpiry < 14 ? "coral" : "neutral"}>
                      {daysToExpiry < 0 ? "Expired" : `Expires in ${daysToExpiry}d`}
                    </Badge>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs text-ink-400">
                      <span>Remaining stock</span>
                      <span>
                        {med.remainingQuantity} / {med.totalQuantity}
                      </span>
                    </div>
                    <Progress value={stockPct} tone={stockPct < 25 ? "coral" : "vital"} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {med.slots.map((slot) => {
                      const status = todayStatus(med, slot);
                      return (
                        <div key={slot} className="flex gap-1">
                          <Button
                            size="sm"
                            variant={status === "taken" ? "primary" : "secondary"}
                            onClick={() => updateStatus(med.id, slot, "taken")}
                          >
                            <Check size={13} /> {slotLabel[slot]}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(med.id, slot, "skipped")}>
                            <SkipForward size={13} />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} title="Add medication" description="Enter details manually or scan a prescription.">
        <div className="mb-4 rounded-xl border border-dashed border-ink-300 p-4 text-center dark:border-ink-700">
          {scanState === "idle" && (
            <div className="flex flex-col items-center gap-2">
              <Upload className="text-ink-400" size={22} />
              <p className="text-sm text-ink-500">Upload or capture a prescription to auto-fill this form</p>
              <Button size="sm" variant="secondary" onClick={simulateScan}>
                <Camera size={14} /> Scan prescription
              </Button>
            </div>
          )}
          {scanState === "scanning" && (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="h-1.5 w-40 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                <div className="h-full w-1/2 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-vital-500 to-transparent bg-[length:200%_100%]" />
              </div>
              <p className="text-sm text-ink-500">Reading prescription…</p>
            </div>
          )}
          {scanState === "done" && <p className="text-sm text-clover-600">Prescription detected — fields filled below.</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Medication name" htmlFor="med-name">
            <Input id="med-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Amoxicillin" />
          </Field>
          <Field label="Dosage" htmlFor="med-dosage">
            <Input id="med-dosage" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g. 500 mg" />
          </Field>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label="Frequency" htmlFor="med-freq">
            <Select id="med-freq" value={frequency} onChange={(e) => setFrequency(e.target.value as MedFrequency)}>
              <option value="once">Once</option>
              <option value="daily">Once daily</option>
              <option value="twice-daily">Twice daily</option>
              <option value="three-daily">Three times daily</option>
              <option value="weekly">Weekly</option>
              <option value="as-needed">As needed</option>
            </Select>
          </Field>
          <Field label="Quantity" htmlFor="med-qty">
            <Input id="med-qty" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          </Field>
        </div>
        <div className="mt-3">
          <Field label="Time of day" htmlFor="med-slots">
            <div className="flex flex-wrap gap-2">
              {(["morning", "afternoon", "evening", "night"] as MedSlot[]).map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => toggleSlot(slot)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    slots.includes(slot)
                      ? "border-vital-500 bg-vital-50 text-vital-700 dark:bg-vital-900/40 dark:text-vital-300"
                      : "border-ink-200 text-ink-500 dark:border-ink-700"
                  }`}
                >
                  {slotLabel[slot]}
                </button>
              ))}
            </div>
          </Field>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label="Expiry date" htmlFor="med-expiry">
            <Input id="med-expiry" type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
          </Field>
        </div>
        <div className="mt-3">
          <Field label="Instructions" htmlFor="med-instructions">
            <Textarea id="med-instructions" rows={2} value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="e.g. Take with food" />
          </Field>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setAddOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Save medication</Button>
        </div>
      </Dialog>
    </div>
  );
}
