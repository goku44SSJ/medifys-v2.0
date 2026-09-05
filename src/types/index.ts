export type ID = string;

export interface User {
  id: ID;
  name: string;
  firstName: string;
  avatarColor: string;
  email: string;
  dob: string;
  bloodType: string;
  heightCm: number;
  weightKg: number;
}

export interface Doctor {
  id: ID;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviews: number;
  phone: string;
  avatarColor: string;
  nextAppointment?: string;
  bio: string;
}

export type MedFrequency = "once" | "daily" | "twice-daily" | "three-daily" | "weekly" | "as-needed";
export type MedSlot = "morning" | "afternoon" | "evening" | "night";

export interface Medication {
  id: ID;
  name: string;
  dosage: string;
  frequency: MedFrequency;
  slots: MedSlot[];
  instructions: string;
  doctorId?: ID;
  remainingQuantity: number;
  totalQuantity: number;
  expiryDate: string;
  startDate: string;
  endDate?: string;
  color: string;
  history: { date: string; slot: MedSlot; status: "taken" | "skipped" | "snoozed" | "pending" }[];
}

export interface Prescription {
  id: ID;
  doctorId?: ID;
  patientName: string;
  date: string;
  medications: { name: string; dosage: string; frequency: string; duration: string }[];
  instructions: string;
  imageDataUrl?: string;
  status: "processing" | "reviewed" | "saved";
}

export interface Appointment {
  id: ID;
  doctorId: ID;
  date: string;
  time: string;
  location: string;
  type: "in-person" | "video";
  status: "upcoming" | "completed" | "cancelled";
  reason: string;
}

export interface HealthMetricPoint {
  date: string;
  steps: number;
  heartRate: number;
  sleepHours: number;
  calories: number;
  weightKg: number;
}

export interface EmergencyContact {
  id: ID;
  name: string;
  relation: string;
  phone: string;
  notified?: boolean;
}

export interface Hospital {
  id: ID;
  name: string;
  distanceKm: number;
  emergency: boolean;
  icuBeds: number;
  generalBeds: number;
  ambulance: boolean;
  pharmacy: boolean;
  rating: number;
  x: number;
  y: number;
}

export interface Pharmacy {
  id: ID;
  name: string;
  price: number;
  discountPct: number;
  deliveryEta: string;
  inStock: boolean;
}

export interface Pet {
  id: ID;
  name: string;
  species: string;
  breed: string;
  age: number;
  weightKg: number;
  vet: string;
  avatarColor: string;
  vaccinations: { name: string; date: string; due: boolean }[];
  medications: { name: string; dosage: string }[];
  timeline: { date: string; event: string }[];
}

export type NotificationType = "medication" | "appointment" | "health" | "emergency" | "prescription" | "system";

export interface AppNotification {
  id: ID;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  severity: "info" | "warning" | "critical";
}

export interface AIMessage {
  id: ID;
  role: "user" | "assistant";
  content: string;
  citations?: { label: string; detail: string }[];
  streaming?: boolean;
}

export interface TimelineEvent {
  id: ID;
  time: string;
  label: string;
  detail: string;
  icon: "pill" | "steps" | "prescription" | "doctor" | "heart" | "sleep";
}
