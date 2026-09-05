import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Plus, Syringe, Pill, Stethoscope, AlertTriangle } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sheet, Dialog } from "@/components/ui/Dialog";
import { Field, Input, Select } from "@/components/ui/Form";
import { useStore } from "@/store/useStore";
import type { Pet } from "@/types";

export function Pets() {
  const pets = useStore((s) => s.pets);
  const addPet = useStore((s) => s.addPet);
  const [selected, setSelected] = useState<Pet | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("Dog");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState(1);

  function submit() {
    if (!name) {
      toast.error("Give your pet a name to continue.");
      return;
    }
    addPet({ name, species, breed, age, weightKg: 10, vet: "Not set", avatarColor: "#DB8F16" });
    toast.success(`${name}'s profile created`);
    setAddOpen(false);
    setName("");
    setBreed("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Pet Health</h2>
          <p className="text-ink-500 dark:text-ink-400">Vaccinations, medications and vet visits for your companions.</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus size={16} /> Add pet
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet, i) => {
          const dueVaccine = pet.vaccinations.find((v) => v.due);
          return (
            <motion.div key={pet.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-white"
                      style={{ backgroundColor: pet.avatarColor }}
                    >
                      {pet.name[0]}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-ink-900 dark:text-ink-50">{pet.name}</p>
                      <p className="text-xs text-ink-400">
                        {pet.breed} · {pet.age}y · {pet.weightKg}kg
                      </p>
                    </div>
                  </div>
                  {dueVaccine && (
                    <Badge tone="amber">
                      <AlertTriangle size={11} /> {dueVaccine.name} due
                    </Badge>
                  )}
                  {pet.medications.length > 0 && (
                    <p className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400">
                      <Pill size={12} /> {pet.medications.map((m) => m.name).join(", ")}
                    </p>
                  )}
                  <Button size="sm" variant="secondary" className="w-full" onClick={() => setSelected(pet)}>
                    View profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Sheet open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-semibold text-white"
                style={{ backgroundColor: selected.avatarColor }}
              >
                {selected.name[0]}
              </div>
              <div>
                <p className="font-display font-semibold text-ink-900 dark:text-ink-50">{selected.name}</p>
                <p className="text-sm text-ink-400">
                  {selected.species} · {selected.breed}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-ink-100 p-3 dark:border-ink-800">
                <p className="text-xs text-ink-400">Age</p>
                <p className="font-semibold text-ink-900 dark:text-ink-50">{selected.age} years</p>
              </div>
              <div className="rounded-lg border border-ink-100 p-3 dark:border-ink-800">
                <p className="text-xs text-ink-400">Weight</p>
                <p className="font-semibold text-ink-900 dark:text-ink-50">{selected.weightKg} kg</p>
              </div>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink-900 dark:text-ink-50">
                <Stethoscope size={14} /> Vet
              </p>
              <p className="text-sm text-ink-500 dark:text-ink-400">{selected.vet}</p>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink-900 dark:text-ink-50">
                <Syringe size={14} /> Vaccinations
              </p>
              <div className="space-y-1.5">
                {selected.vaccinations.length === 0 && <p className="text-sm text-ink-400">No records yet.</p>}
                {selected.vaccinations.map((v, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-ink-100 p-2.5 text-sm dark:border-ink-800">
                    <span className="text-ink-700 dark:text-ink-200">{v.name}</span>
                    <Badge tone={v.due ? "amber" : "clover"}>{v.due ? `Due ${v.date}` : v.date}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-ink-900 dark:text-ink-50">Health timeline</p>
              <div className="space-y-2">
                {selected.timeline.map((t, i) => (
                  <div key={i} className="text-sm">
                    <p className="text-xs text-ink-400">{t.date}</p>
                    <p className="text-ink-700 dark:text-ink-200">{t.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Sheet>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} title="Add a pet">
        <div className="space-y-3">
          <Field label="Name" htmlFor="pet-name">
            <Input id="pet-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Bella" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Species" htmlFor="pet-species">
              <Select id="pet-species" value={species} onChange={(e) => setSpecies(e.target.value)}>
                <option>Dog</option>
                <option>Cat</option>
                <option>Bird</option>
                <option>Rabbit</option>
                <option>Other</option>
              </Select>
            </Field>
            <Field label="Age" htmlFor="pet-age">
              <Input id="pet-age" type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
            </Field>
          </div>
          <Field label="Breed" htmlFor="pet-breed">
            <Input id="pet-breed" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Golden Retriever" />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setAddOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Save pet</Button>
        </div>
      </Dialog>
    </div>
  );
}
