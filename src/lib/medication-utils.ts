import type { Medication, MedSlot } from "@/types";

export const slotHour: Record<MedSlot, number> = {
  morning: 8,
  afternoon: 14,
  evening: 18,
  night: 21,
};

export const slotLabel: Record<MedSlot, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

export function todayStatus(med: Medication, slot: MedSlot): "taken" | "skipped" | "snoozed" | "pending" {
  const today = new Date().toISOString().slice(0, 10);
  const entry = med.history.find((h) => h.date === today && h.slot === slot);
  return entry?.status ?? "pending";
}

export function nextDose(medications: Medication[]) {
  const now = new Date();
  let best: { med: Medication; slot: MedSlot; at: Date } | null = null;

  for (const med of medications) {
    for (const slot of med.slots) {
      const status = todayStatus(med, slot);
      if (status === "taken" || status === "skipped") continue;
      const at = new Date(now);
      at.setHours(slotHour[slot], 0, 0, 0);
      if (at < now) at.setDate(at.getDate() + 1);
      if (!best || at < best.at) best = { med, slot, at };
    }
  }
  return best;
}

export function remainingToday(medications: Medication[]) {
  let count = 0;
  for (const med of medications) {
    for (const slot of med.slots) {
      const status = todayStatus(med, slot);
      if (status !== "taken") count++;
    }
  }
  return count;
}
