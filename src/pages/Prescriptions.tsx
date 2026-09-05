import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { UploadCloud, FileText, ScanLine, Check, Trash2, Plus } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Form";
import { useStore } from "@/store/useStore";
import { doctors } from "@/lib/mock-data";

type ScanStage = "idle" | "dragging" | "scanning" | "extracted";

const SAMPLE_EXTRACTIONS = [
  {
    doctor: "Dr. Kavya Menon",
    meds: [
      { name: "Metformin", dosage: "500 mg", frequency: "Twice daily", duration: "90 days" },
      { name: "Atorvastatin", dosage: "10 mg", frequency: "Once at night", duration: "30 days" },
    ],
    instructions: "Recheck HbA1c in 6 weeks.",
  },
  {
    doctor: "Dr. Farhan Sheikh",
    meds: [{ name: "Azithromycin", dosage: "250 mg", frequency: "Once daily", duration: "5 days" }],
    instructions: "Complete full course even if symptoms improve.",
  },
];

export function Prescriptions() {
  const prescriptions = useStore((s) => s.prescriptions);
  const addPrescription = useStore((s) => s.addPrescription);
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<ScanStage>("idle");
  const [draft, setDraft] = useState<null | { doctor: string; meds: typeof SAMPLE_EXTRACTIONS[0]["meds"]; instructions: string }>(null);

  function runScan() {
    setStage("scanning");
    setTimeout(() => {
      const sample = SAMPLE_EXTRACTIONS[Math.floor(Math.random() * SAMPLE_EXTRACTIONS.length)];
      setDraft(sample);
      setStage("extracted");
      toast.success("Prescription detected", { description: `${sample.meds.length} medication(s) found.` });
    }, 2000);
  }

  function saveDraft() {
    if (!draft) return;
    const doctor = doctors.find((d) => d.name === draft.doctor);
    addPrescription({
      doctorId: doctor?.id,
      patientName: "Ananya Rao",
      date: new Date().toISOString().slice(0, 10),
      medications: draft.meds,
      instructions: draft.instructions,
      status: "saved",
    });
    toast.success("Prescription saved to your records");
    setDraft(null);
    setStage("idle");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Prescriptions</h2>
        <p className="text-ink-500 dark:text-ink-400">Scan a prescription and Medifys extracts the details for you.</p>
      </div>

      <Card>
        <CardContent>
          {stage === "idle" || stage === "dragging" ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setStage("dragging");
              }}
              onDragLeave={() => setStage("idle")}
              onDrop={(e) => {
                e.preventDefault();
                runScan();
              }}
              onClick={() => inputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-14 text-center transition ${
                stage === "dragging" ? "border-vital-500 bg-vital-50 dark:bg-vital-900/20" : "border-ink-300 dark:border-ink-700"
              }`}
            >
              <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={() => runScan()} />
              <UploadCloud size={28} className="text-vital-500" />
              <p className="font-medium text-ink-900 dark:text-ink-50">Drag & drop a prescription, or click to upload</p>
              <p className="text-sm text-ink-400">Supports photos and PDFs. Nothing leaves this demo session.</p>
            </div>
          ) : stage === "scanning" ? (
            <div className="flex flex-col items-center gap-4 py-14">
              <div className="relative flex h-28 w-24 items-center justify-center rounded-lg border-2 border-ink-200 dark:border-ink-700">
                <FileText size={30} className="text-ink-300" />
                <motion.div
                  initial={{ y: -50 }}
                  animate={{ y: 50 }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut", repeatType: "reverse" }}
                  className="absolute left-0 right-0 h-0.5 bg-vital-500 shadow-glow"
                />
                <ScanLine className="absolute -bottom-2 text-vital-500" size={16} />
              </div>
              <p className="text-sm font-medium text-ink-700 dark:text-ink-200">Analyzing document…</p>
              <p className="text-xs text-ink-400">Extracting doctor, medications and instructions</p>
            </div>
          ) : null}

          {stage === "extracted" && draft && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-clover-600">
                <Check size={16} />
                <p className="text-sm font-medium">Prescription detected — review before saving</p>
              </div>
              <Field label="Doctor" htmlFor="pr-doctor">
                <Input id="pr-doctor" value={draft.doctor} onChange={(e) => setDraft({ ...draft, doctor: e.target.value })} />
              </Field>
              <div className="space-y-2">
                {draft.meds.map((m, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2">
                    <Input
                      value={m.name}
                      onChange={(e) => {
                        const meds = [...draft.meds];
                        meds[i] = { ...m, name: e.target.value };
                        setDraft({ ...draft, meds });
                      }}
                    />
                    <Input
                      value={m.dosage}
                      onChange={(e) => {
                        const meds = [...draft.meds];
                        meds[i] = { ...m, dosage: e.target.value };
                        setDraft({ ...draft, meds });
                      }}
                    />
                    <Input
                      value={m.frequency}
                      onChange={(e) => {
                        const meds = [...draft.meds];
                        meds[i] = { ...m, frequency: e.target.value };
                        setDraft({ ...draft, meds });
                      }}
                    />
                  </div>
                ))}
              </div>
              <Field label="Instructions" htmlFor="pr-instr">
                <Textarea
                  id="pr-instr"
                  rows={2}
                  value={draft.instructions}
                  onChange={(e) => setDraft({ ...draft, instructions: e.target.value })}
                />
              </Field>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setDraft(null);
                    setStage("idle");
                  }}
                >
                  Discard
                </Button>
                <Button onClick={saveDraft}>Save to records</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">Your records</p>
          <Button size="sm" variant="secondary" onClick={() => inputRef.current?.click()}>
            <Plus size={14} /> Add another
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {prescriptions.map((p, i) => {
            const doctor = doctors.find((d) => d.id === p.doctorId);
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-display font-semibold text-ink-900 dark:text-ink-50">{doctor?.name ?? "Unknown physician"}</p>
                        <p className="text-xs text-ink-400">{p.date}</p>
                      </div>
                      <Badge tone="clover">Saved</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {p.medications.map((m, mi) => (
                        <Badge key={mi} tone="vital">
                          {m.name} · {m.dosage}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-ink-500 dark:text-ink-400">{p.instructions}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
