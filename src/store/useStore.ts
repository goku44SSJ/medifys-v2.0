import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "@/lib/nanoid";
import {
  currentUser,
  doctors as seedDoctors,
  medications as seedMedications,
  prescriptions as seedPrescriptions,
  appointments as seedAppointments,
  emergencyContacts as seedContacts,
  pets as seedPets,
  notifications as seedNotifications,
  timeline as seedTimeline,
} from "@/lib/mock-data";
import type {
  Doctor,
  Medication,
  MedSlot,
  Prescription,
  Appointment,
  EmergencyContact,
  Pet,
  AppNotification,
  TimelineEvent,
  User,
} from "@/types";

export type ColorBlindMode = "none" | "protanopia" | "deuteranopia" | "tritanopia";

interface AccessibilitySettings {
  fontScale: number; // 0.9 - 1.4
  highContrast: boolean;
  reducedMotion: boolean;
  colorBlindMode: ColorBlindMode;
  screenReaderOptimized: boolean;
  keyboardNav: boolean;
  focusIndicators: boolean;
  largeControls: boolean;
}

interface CartItem {
  id: string;
  medicineName: string;
  providerName: string;
  price: number;
}

interface AppState {
  user: User;
  theme: "light" | "dark";
  toggleTheme: () => void;

  doctors: Doctor[];
  addDoctor: (d: Omit<Doctor, "id">) => void;

  medications: Medication[];
  addMedication: (m: Omit<Medication, "id" | "history">) => void;
  updateMedicationStatus: (id: string, slot: MedSlot, status: "taken" | "skipped" | "snoozed") => void;
  deleteMedication: (id: string) => void;

  prescriptions: Prescription[];
  addPrescription: (p: Omit<Prescription, "id">) => void;

  appointments: Appointment[];

  emergencyContacts: EmergencyContact[];
  emergencyActive: boolean;
  emergencyLog: string[];
  activateEmergency: () => void;
  resetEmergency: () => void;

  pets: Pet[];
  addPet: (p: Omit<Pet, "id" | "vaccinations" | "medications" | "timeline">) => void;

  notifications: AppNotification[];
  addNotification: (n: Omit<AppNotification, "id" | "read" | "time">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  timeline: TimelineEvent[];
  addTimelineEvent: (t: Omit<TimelineEvent, "id">) => void;

  a11y: AccessibilitySettings;
  setA11y: (patch: Partial<AccessibilitySettings>) => void;

  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;

  lastBackupSync: string;
  setLastBackupSync: (iso: string) => void;

  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: currentUser,
      theme: "light",
      toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

      doctors: seedDoctors,
      addDoctor: (d) =>
        set((s) => ({ doctors: [...s.doctors, { ...d, id: nanoid() }] })),

      medications: seedMedications,
      addMedication: (m) =>
        set((s) => ({
          medications: [...s.medications, { ...m, id: nanoid(), history: [] }],
        })),
      updateMedicationStatus: (id, slot, status) =>
        set((s) => {
          const today = new Date().toISOString().slice(0, 10);
          const meds = s.medications.map((med) => {
            if (med.id !== id) return med;
            const existingIdx = med.history.findIndex((h) => h.date === today && h.slot === slot);
            const nextHistory = [...med.history];
            if (existingIdx >= 0) nextHistory[existingIdx] = { date: today, slot, status };
            else nextHistory.unshift({ date: today, slot, status });
            const remaining =
              status === "taken" ? Math.max(0, med.remainingQuantity - 1) : med.remainingQuantity;
            return { ...med, history: nextHistory, remainingQuantity: remaining };
          });
          return { medications: meds };
        }),
      deleteMedication: (id) => set((s) => ({ medications: s.medications.filter((m) => m.id !== id) })),

      prescriptions: seedPrescriptions,
      addPrescription: (p) =>
        set((s) => ({ prescriptions: [{ ...p, id: nanoid() }, ...s.prescriptions] })),

      appointments: seedAppointments,

      emergencyContacts: seedContacts,
      emergencyActive: false,
      emergencyLog: [],
      activateEmergency: () =>
        set(() => ({
          emergencyActive: true,
          emergencyLog: ["Emergency alert activated"],
        })),
      resetEmergency: () => set({ emergencyActive: false, emergencyLog: [] }),

      pets: seedPets,
      addPet: (p) =>
        set((s) => ({
          pets: [...s.pets, { ...p, id: nanoid(), vaccinations: [], medications: [], timeline: [] }],
        })),

      notifications: seedNotifications,
      addNotification: (n) =>
        set((s) => ({
          notifications: [
            { ...n, id: nanoid(), read: false, time: new Date().toISOString() },
            ...s.notifications,
          ],
        })),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllNotificationsRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      deleteNotification: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

      timeline: seedTimeline,
      addTimelineEvent: (t) =>
        set((s) => ({ timeline: [{ ...t, id: nanoid() }, ...s.timeline] })),

      a11y: {
        fontScale: 1,
        highContrast: false,
        reducedMotion: false,
        colorBlindMode: "none",
        screenReaderOptimized: false,
        keyboardNav: true,
        focusIndicators: true,
        largeControls: false,
      },
      setA11y: (patch) => set((s) => ({ a11y: { ...s.a11y, ...patch } })),

      cart: [],
      addToCart: (item) => set((s) => ({ cart: [...s.cart, { ...item, id: nanoid() }] })),

      lastBackupSync: "2026-09-01T22:10:00",
      setLastBackupSync: (iso) => set({ lastBackupSync: iso }),

      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    }),
    { name: "medifys-store" }
  )
);

export const selectAdherence = (state: AppState) => {
  const all = state.medications.flatMap((m) => m.history);
  if (all.length === 0) return 100;
  const taken = all.filter((h) => h.status === "taken").length;
  return Math.round((taken / all.length) * 100);
};
