import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Phone, MessageSquare, Video, Star, Plus } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sheet, Dialog } from "@/components/ui/Dialog";
import { Tabs } from "@/components/ui/Tabs";
import { Field, Input, Select } from "@/components/ui/Form";
import { useStore } from "@/store/useStore";
import type { Doctor } from "@/types";

export function Doctors() {
  const doctors = useStore((s) => s.doctors);
  const addDoctor = useStore((s) => s.addDoctor);
  const prescriptions = useStore((s) => s.prescriptions);
  const appointments = useStore((s) => s.appointments);
  const medications = useStore((s) => s.medications);
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [tab, setTab] = useState("info");
  const [addOpen, setAddOpen] = useState(false);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("General Physician");
  const [hospital, setHospital] = useState("");
  const [phone, setPhone] = useState("");

  function submitDoctor() {
    if (!name) {
      toast.error("Add a name to continue.");
      return;
    }
    addDoctor({
      name,
      specialty,
      hospital,
      rating: 4.5,
      reviews: 0,
      phone,
      avatarColor: "#3F79D6",
      bio: "Recently added to your care team.",
    });
    toast.success(`${name} added to your doctors`);
    setAddOpen(false);
    setName("");
    setHospital("");
    setPhone("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Doctors</h2>
          <p className="text-ink-500 dark:text-ink-400">Your care team, contact details and consultation history.</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus size={16} /> Add doctor
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doc, i) => (
          <motion.div key={doc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="flex h-full flex-col">
              <CardContent className="flex flex-1 flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold text-white"
                    style={{ backgroundColor: doc.avatarColor }}
                  >
                    {doc.name.split(" ")[1]?.[0] ?? doc.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display font-semibold text-ink-900 dark:text-ink-50">{doc.name}</p>
                    <p className="truncate text-xs text-ink-400">{doc.specialty}</p>
                  </div>
                </div>
                <p className="truncate text-xs text-ink-500 dark:text-ink-400">{doc.hospital}</p>
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <Star size={13} fill="currentColor" />
                  {doc.rating} <span className="text-ink-400">({doc.reviews})</span>
                </div>
                {doc.nextAppointment && (
                  <Badge tone="vital" className="w-fit">
                    Next: {new Date(doc.nextAppointment).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </Badge>
                )}
                <div className="mt-auto grid grid-cols-3 gap-1.5 pt-2">
                  <Button size="sm" variant="secondary" onClick={() => toast(`Calling ${doc.name}…`)}>
                    <Phone size={13} />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => toast(`Message sent to ${doc.name}`)}>
                    <MessageSquare size={13} />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => navigate("/consultations")}>
                    <Video size={13} />
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelected(doc);
                    setTab("info");
                  }}
                >
                  View profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Sheet open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold text-white"
                style={{ backgroundColor: selected.avatarColor }}
              >
                {selected.name.split(" ")[1]?.[0]}
              </div>
              <div>
                <p className="font-display font-semibold text-ink-900 dark:text-ink-50">{selected.name}</p>
                <p className="text-sm text-ink-400">
                  {selected.specialty} · {selected.hospital}
                </p>
              </div>
            </div>

            <Tabs
              tabs={[
                { value: "info", label: "Info" },
                { value: "history", label: "History" },
                { value: "prescriptions", label: "Prescriptions" },
              ]}
              defaultValue={tab}
              onChange={setTab}
            />

            {tab === "info" && (
              <div className="space-y-3 text-sm">
                <p className="text-ink-600 dark:text-ink-300">{selected.bio}</p>
                <p className="text-ink-500 dark:text-ink-400">Phone: {selected.phone}</p>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={() => toast(`Calling ${selected.name}…`)}>
                    <Phone size={14} /> Call
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => navigate("/consultations")}>
                    <Video size={14} /> Consult
                  </Button>
                </div>
              </div>
            )}

            {tab === "history" && (
              <div className="space-y-2">
                {appointments.filter((a) => a.doctorId === selected.id).length === 0 && (
                  <p className="text-sm text-ink-400">No appointment history yet.</p>
                )}
                {appointments
                  .filter((a) => a.doctorId === selected.id)
                  .map((a) => (
                    <div key={a.id} className="rounded-lg border border-ink-100 p-3 text-sm dark:border-ink-800">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-ink-900 dark:text-ink-50">{a.reason}</p>
                        <Badge tone={a.status === "upcoming" ? "vital" : "neutral"}>{a.status}</Badge>
                      </div>
                      <p className="text-xs text-ink-400">
                        {a.date} · {a.time}
                      </p>
                    </div>
                  ))}
              </div>
            )}

            {tab === "prescriptions" && (
              <div className="space-y-2">
                {prescriptions.filter((p) => p.doctorId === selected.id).length === 0 && (
                  <p className="text-sm text-ink-400">No prescriptions on file.</p>
                )}
                {prescriptions
                  .filter((p) => p.doctorId === selected.id)
                  .map((p) => (
                    <div key={p.id} className="rounded-lg border border-ink-100 p-3 text-sm dark:border-ink-800">
                      <p className="font-medium text-ink-900 dark:text-ink-50">{p.date}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {p.medications.map((m, i) => (
                          <Badge key={i} tone="vital">
                            {m.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                {medications.filter((m) => m.doctorId === selected.id).length > 0 && (
                  <p className="pt-2 text-xs text-ink-400">
                    Currently prescribing: {medications.filter((m) => m.doctorId === selected.id).map((m) => m.name).join(", ")}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Sheet>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} title="Add a doctor">
        <div className="space-y-3">
          <Field label="Full name" htmlFor="doc-name">
            <Input id="doc-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Jane Doe" />
          </Field>
          <Field label="Specialty" htmlFor="doc-spec">
            <Select id="doc-spec" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
              {["General Physician", "Cardiologist", "Endocrinologist", "Dermatologist", "Pediatrician", "Orthopedic"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Hospital / Clinic" htmlFor="doc-hospital">
            <Input id="doc-hospital" value={hospital} onChange={(e) => setHospital(e.target.value)} />
          </Field>
          <Field label="Phone" htmlFor="doc-phone">
            <Input id="doc-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setAddOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submitDoctor}>Save doctor</Button>
        </div>
      </Dialog>
    </div>
  );
}
