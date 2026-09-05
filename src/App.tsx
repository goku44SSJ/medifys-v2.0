import { Routes, Route, Navigate } from "react-router-dom";
import { useApplyA11y } from "@/hooks/useApplyA11y";
import { AppShell } from "@/components/layout/AppShell";
import { Landing } from "@/pages/Landing";
import { Dashboard } from "@/pages/Dashboard";
import { MyHealth } from "@/pages/MyHealth";
import { Medications } from "@/pages/Medications";
import { Prescriptions } from "@/pages/Prescriptions";
import { Doctors } from "@/pages/Doctors";
import { Consultations } from "@/pages/Consultations";
import { AIAssistant } from "@/pages/AIAssistant";
import { Analytics } from "@/pages/Analytics";
import { Emergency } from "@/pages/Emergency";
import { Hospitals } from "@/pages/Hospitals";
import { Pharmacy } from "@/pages/Pharmacy";
import { Pets } from "@/pages/Pets";
import { AccessibilityCenter } from "@/pages/AccessibilityCenter";
import { HandsFreeMode } from "@/pages/HandsFreeMode";
import { Settings } from "@/pages/Settings";

export default function App() {
  useApplyA11y();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/health" element={<MyHealth />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/consultations" element={<Consultations />} />
        <Route path="/ai" element={<AIAssistant />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/accessibility" element={<AccessibilityCenter />} />
        <Route path="/accessibility/hands-free" element={<HandsFreeMode />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
