import type {
  User,
  Doctor,
  Medication,
  Prescription,
  Appointment,
  HealthMetricPoint,
  EmergencyContact,
  Hospital,
  Pet,
  AppNotification,
  TimelineEvent,
} from "@/types";

export const currentUser: User = {
  id: "u1",
  name: "Ananya Rao",
  firstName: "Ananya",
  avatarColor: "#3F79D6",
  email: "ananya.rao@example.com",
  dob: "1991-04-12",
  bloodType: "O+",
  heightCm: 167,
  weightKg: 61,
};

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Kavya Menon",
    specialty: "Endocrinologist",
    hospital: "Sunrise General Hospital",
    rating: 4.9,
    reviews: 214,
    phone: "+91 98450 12345",
    avatarColor: "#2E5FB0",
    nextAppointment: "2026-09-08T10:30:00",
    bio: "Dr. Menon specializes in diabetes management and metabolic disorders, with 14 years of clinical practice focused on long-term care plans.",
  },
  {
    id: "d2",
    name: "Dr. Arjun Iyer",
    specialty: "Cardiologist",
    hospital: "Lakeside Heart Institute",
    rating: 4.8,
    reviews: 189,
    phone: "+91 98230 55678",
    avatarColor: "#1E9E7C",
    nextAppointment: "2026-09-14T15:00:00",
    bio: "Dr. Iyer focuses on preventive cardiology and interventional procedures, helping patients manage risk long before symptoms appear.",
  },
  {
    id: "d3",
    name: "Dr. Priya Nair",
    specialty: "Dermatologist",
    hospital: "Cedar Skin & Wellness Clinic",
    rating: 4.7,
    reviews: 156,
    phone: "+91 90210 98765",
    avatarColor: "#C4432F",
    bio: "Dr. Nair treats chronic and cosmetic skin conditions, and consults widely on AI-assisted screening as a triage aid, not a diagnosis.",
  },
  {
    id: "d4",
    name: "Dr. Farhan Sheikh",
    specialty: "General Physician",
    hospital: "Sunrise General Hospital",
    rating: 4.6,
    reviews: 302,
    phone: "+91 99887 34521",
    avatarColor: "#DB8F16",
    bio: "Dr. Sheikh is Ananya's primary care physician, coordinating referrals and annual wellness checks.",
  },
];

export const medications: Medication[] = [
  {
    id: "m1",
    name: "Metformin",
    dosage: "500 mg",
    frequency: "twice-daily",
    slots: ["morning", "evening"],
    instructions: "Take with food to reduce stomach upset.",
    doctorId: "d1",
    remainingQuantity: 34,
    totalQuantity: 60,
    expiryDate: "2027-02-01",
    startDate: "2026-03-01",
    color: "#3F79D6",
    history: [
      { date: "2026-09-03", slot: "morning", status: "taken" },
      { date: "2026-09-03", slot: "evening", status: "taken" },
      { date: "2026-09-02", slot: "morning", status: "taken" },
      { date: "2026-09-02", slot: "evening", status: "skipped" },
    ],
  },
  {
    id: "m2",
    name: "Atorvastatin",
    dosage: "10 mg",
    frequency: "daily",
    slots: ["night"],
    instructions: "Take at bedtime, avoid grapefruit juice.",
    doctorId: "d2",
    remainingQuantity: 12,
    totalQuantity: 30,
    expiryDate: "2026-11-15",
    startDate: "2026-05-10",
    color: "#1E9E7C",
    history: [
      { date: "2026-09-03", slot: "night", status: "pending" },
      { date: "2026-09-02", slot: "night", status: "taken" },
    ],
  },
  {
    id: "m3",
    name: "Cetirizine",
    dosage: "10 mg",
    frequency: "as-needed",
    slots: ["morning"],
    instructions: "Take when seasonal symptoms flare up.",
    doctorId: "d4",
    remainingQuantity: 6,
    totalQuantity: 10,
    expiryDate: "2026-09-20",
    startDate: "2026-08-01",
    color: "#DB8F16",
    history: [{ date: "2026-09-01", slot: "morning", status: "taken" }],
  },
  {
    id: "m4",
    name: "Vitamin D3",
    dosage: "60,000 IU",
    frequency: "weekly",
    slots: ["afternoon"],
    instructions: "Take once a week, preferably with a meal.",
    remainingQuantity: 3,
    totalQuantity: 4,
    expiryDate: "2027-06-01",
    startDate: "2026-07-01",
    color: "#E15540",
    history: [{ date: "2026-08-28", slot: "afternoon", status: "taken" }],
  },
];

export const prescriptions: Prescription[] = [
  {
    id: "p1",
    doctorId: "d1",
    patientName: "Ananya Rao",
    date: "2026-08-28",
    medications: [
      { name: "Metformin", dosage: "500 mg", frequency: "Twice daily", duration: "90 days" },
      { name: "Atorvastatin", dosage: "10 mg", frequency: "Once at night", duration: "30 days" },
    ],
    instructions: "Recheck HbA1c in 6 weeks. Maintain low glycemic-index diet.",
    status: "saved",
  },
  {
    id: "p2",
    doctorId: "d4",
    patientName: "Ananya Rao",
    date: "2026-08-01",
    medications: [{ name: "Cetirizine", dosage: "10 mg", frequency: "As needed", duration: "10 days" }],
    instructions: "Use only during active allergy symptoms.",
    status: "saved",
  },
];

export const appointments: Appointment[] = [
  {
    id: "ap1",
    doctorId: "d1",
    date: "2026-09-08",
    time: "10:30 AM",
    location: "Sunrise General Hospital, Room 4B",
    type: "in-person",
    status: "upcoming",
    reason: "Diabetes follow-up & HbA1c review",
  },
  {
    id: "ap2",
    doctorId: "d2",
    date: "2026-09-14",
    time: "3:00 PM",
    location: "Video consultation",
    type: "video",
    status: "upcoming",
    reason: "Cardiac risk assessment",
  },
  {
    id: "ap3",
    doctorId: "d4",
    date: "2026-08-20",
    time: "9:00 AM",
    location: "Sunrise General Hospital",
    type: "in-person",
    status: "completed",
    reason: "Annual wellness check",
  },
];

function seedMetrics(): HealthMetricPoint[] {
  const points: HealthMetricPoint[] = [];
  const base = new Date("2026-07-08");
  for (let i = 0; i < 60; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const wave = Math.sin(i / 5) * 900;
    points.push({
      date: d.toISOString().slice(0, 10),
      steps: Math.max(1800, Math.round(7200 + wave + (Math.random() - 0.5) * 1600)),
      heartRate: Math.round(66 + Math.sin(i / 8) * 4 + (Math.random() - 0.5) * 3),
      sleepHours: Math.round((6.4 + Math.sin(i / 6) * 1.1 + (Math.random() - 0.5) * 0.6) * 10) / 10,
      calories: Math.round(2050 + wave * 0.4 + (Math.random() - 0.5) * 220),
      weightKg: Math.round((61.4 - i * 0.01 + (Math.random() - 0.5) * 0.3) * 10) / 10,
    });
  }
  return points;
}
export const healthMetrics = seedMetrics();

export const emergencyContacts: EmergencyContact[] = [
  { id: "e1", name: "Rahul Rao", relation: "Spouse", phone: "+91 98765 43210" },
  { id: "e2", name: "Meera Rao", relation: "Mother", phone: "+91 98123 45670" },
  { id: "e3", name: "Dr. Farhan Sheikh", relation: "Primary Physician", phone: "+91 99887 34521" },
];

export const hospitals: Hospital[] = [
  { id: "h1", name: "Sunrise General Hospital", distanceKm: 1.8, emergency: true, icuBeds: 6, generalBeds: 22, ambulance: true, pharmacy: true, rating: 4.6, x: 62, y: 38 },
  { id: "h2", name: "Lakeside Heart Institute", distanceKm: 3.4, emergency: true, icuBeds: 3, generalBeds: 10, ambulance: true, pharmacy: true, rating: 4.8, x: 30, y: 60 },
  { id: "h3", name: "Cedar Skin & Wellness Clinic", distanceKm: 2.1, emergency: false, icuBeds: 0, generalBeds: 4, ambulance: false, pharmacy: true, rating: 4.5, x: 75, y: 68 },
  { id: "h4", name: "Northgate Community Hospital", distanceKm: 5.6, emergency: true, icuBeds: 8, generalBeds: 40, ambulance: true, pharmacy: true, rating: 4.3, x: 45, y: 20 },
  { id: "h5", name: "St. Anne's Multispeciality", distanceKm: 6.9, emergency: true, icuBeds: 5, generalBeds: 30, ambulance: true, pharmacy: false, rating: 4.4, x: 15, y: 30 },
];

export const pets: Pet[] = [
  {
    id: "pet1",
    name: "Max",
    species: "Dog",
    breed: "Golden Retriever",
    age: 4,
    weightKg: 28,
    vet: "Dr. Sana Kapoor, PawCare Clinic",
    avatarColor: "#DB8F16",
    vaccinations: [
      { name: "Rabies", date: "2026-03-01", due: false },
      { name: "DHPP Booster", date: "2026-10-15", due: true },
    ],
    medications: [{ name: "Heartgard Plus", dosage: "1 chew / month" }],
    timeline: [
      { date: "2026-08-20", event: "Annual wellness check — all clear" },
      { date: "2026-07-02", event: "Started monthly heartworm prevention" },
    ],
  },
  {
    id: "pet2",
    name: "Coco",
    species: "Cat",
    breed: "Domestic Shorthair",
    age: 2,
    weightKg: 4.2,
    vet: "Dr. Sana Kapoor, PawCare Clinic",
    avatarColor: "#C4432F",
    vaccinations: [{ name: "FVRCP", date: "2026-05-11", due: false }],
    medications: [],
    timeline: [{ date: "2026-05-11", event: "Vaccination completed" }],
  },
];

export const notifications: AppNotification[] = [
  { id: "n1", type: "medication", title: "Metformin due soon", body: "Next dose in 2h 18m.", time: "2026-09-04T08:12:00", read: false, severity: "info" },
  { id: "n2", type: "appointment", title: "Upcoming appointment", body: "Dr. Kavya Menon on Sep 8, 10:30 AM.", time: "2026-09-03T18:00:00", read: false, severity: "info" },
  { id: "n3", type: "prescription", title: "Prescription saved", body: "Your Aug 28 prescription was added to your records.", time: "2026-08-28T14:20:00", read: true, severity: "info" },
  { id: "n4", type: "health", title: "Activity milestone", body: "You beat your weekly step average by 14%.", time: "2026-09-02T09:00:00", read: true, severity: "info" },
  { id: "n5", type: "system", title: "Cloud backup complete", body: "All records synced across your devices.", time: "2026-09-01T22:10:00", read: true, severity: "info" },
];

export const timeline: TimelineEvent[] = [
  { id: "t1", time: "08:00", label: "Medication taken", detail: "Metformin 500mg — morning dose", icon: "pill" },
  { id: "t2", time: "09:30", label: "Activity logged", detail: "8,420 steps so far today", icon: "steps" },
  { id: "t3", time: "11:15", label: "Prescription uploaded", detail: "Scanned prescription from Dr. Menon", icon: "prescription" },
  { id: "t4", time: "13:00", label: "Doctor consultation", detail: "15 min video call with Dr. Sheikh", icon: "doctor" },
];

export const pharmacyProviders = [
  { id: "ph1", name: "CarePlus Pharmacy", price: 42, discountPct: 10, deliveryEta: "Today, 6 PM", inStock: true },
  { id: "ph2", name: "MedExpress", price: 38, discountPct: 5, deliveryEta: "Tomorrow, 10 AM", inStock: true },
  { id: "ph3", name: "Wellness Chemist", price: 45, discountPct: 0, deliveryEta: "Today, 8 PM", inStock: true },
  { id: "ph4", name: "QuickMeds", price: 36, discountPct: 15, deliveryEta: "Today, 4 PM", inStock: false },
];

export const priceHistory = [
  { month: "Apr", price: 44 },
  { month: "May", price: 41 },
  { month: "Jun", price: 43 },
  { month: "Jul", price: 39 },
  { month: "Aug", price: 38 },
  { month: "Sep", price: 36 },
];
