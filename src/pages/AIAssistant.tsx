import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, FileText, Pill, Stethoscope, MapPin, ShieldAlert, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import type { AIMessage } from "@/types";
import { nanoid } from "@/lib/nanoid";

const quickActions = [
  { label: "Explain my prescription", icon: FileText },
  { label: "Explain my medicines", icon: Pill },
  { label: "Analyze symptoms", icon: Stethoscope },
  { label: "Find nearby care", icon: MapPin },
  { label: "Check interactions", icon: ShieldAlert },
];

const responses: Record<string, { content: string; citations: { label: string; detail: string }[] }> = {
  default: {
    content:
      "Metformin is commonly used to help manage blood sugar in type 2 diabetes. It works by reducing glucose production in the liver and improving how your body responds to insulin. It's usually taken with meals to reduce stomach upset. This is general information, not a diagnosis — always follow your prescribing doctor's specific instructions.",
    citations: [
      { label: "Medication overview", detail: "Mechanism of action & common usage" },
      { label: "Dosing guidance", detail: "Typical adult dosing patterns" },
    ],
  },
  "Explain my prescription": {
    content:
      "Your most recent prescription from Dr. Kavya Menon includes Metformin 500mg twice daily and Atorvastatin 10mg at night. Metformin supports blood sugar control, while Atorvastatin helps manage cholesterol. Your doctor asked for an HbA1c recheck in 6 weeks — worth adding to your calendar.",
    citations: [{ label: "Your prescription", detail: "Saved Aug 28, 2026" }],
  },
  "Explain my medicines": {
    content:
      "You currently have 4 active medications: Metformin (diabetes), Atorvastatin (cholesterol), Cetirizine (allergy, as needed), and Vitamin D3 (weekly supplement). Your adherence this month is strong — keep taking Atorvastatin at night for the best effect on cholesterol synthesis.",
    citations: [{ label: "Medication list", detail: "4 active medications" }],
  },
  "Analyze symptoms": {
    content:
      "I can help you think through symptoms, but I can't provide a diagnosis. Could you describe what you're experiencing — onset, severity, and anything that makes it better or worse? For anything severe or sudden (chest pain, difficulty breathing, fainting), please use the Emergency Center right away rather than waiting on a chat response.",
    citations: [],
  },
  "Find nearby care": {
    content:
      "Based on your saved location, Sunrise General Hospital (1.8 km) and Lakeside Heart Institute (3.4 km) are your closest facilities with emergency care available. I've opened the Hospitals section where you can filter by ICU availability, ambulance access, and pharmacy on-site.",
    citations: [{ label: "Hospitals near you", detail: "5 facilities within 7 km" }],
  },
  "Check interactions": {
    content:
      "Checking your active medications: Metformin, Atorvastatin, Cetirizine, and Vitamin D3 — no significant interactions detected between these. As always, mention all medications and supplements to any new prescriber, and avoid grapefruit juice while on Atorvastatin.",
    citations: [{ label: "Interaction check", detail: "4 medications reviewed" }],
  },
};

export function AIAssistant() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi Ananya — I'm Medifys AI. Ask me about your medications, prescriptions, or general health questions. I'm here to inform, not diagnose.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  function respond(promptLabel: string, displayText: string) {
    const userMsg: AIMessage = { id: nanoid(), role: "user", content: displayText };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      setThinking(false);
      const data = responses[promptLabel] ?? responses.default;
      const id = nanoid();
      setMessages((m) => [...m, { id, role: "assistant", content: "", citations: data.citations, streaming: true }]);

      let i = 0;
      const interval = setInterval(() => {
        i += 3;
        setMessages((m) =>
          m.map((msg) => (msg.id === id ? { ...msg, content: data.content.slice(0, i), streaming: i < data.content.length } : msg))
        );
        if (i >= data.content.length) clearInterval(interval);
      }, 16);
    }, 1100);
  }

  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col gap-4 lg:h-[calc(100vh-6rem)]">
      <div>
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-ink-900 dark:text-ink-50">
          <Sparkles className="text-vital-500" size={22} /> Medifys AI
        </h2>
        <p className="text-ink-500 dark:text-ink-400">Your healthcare-aware assistant — informational, not diagnostic.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {quickActions.map((qa) => (
          <button
            key={qa.label}
            onClick={() => respond(qa.label, qa.label)}
            className="flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-600 hover:border-vital-300 hover:text-vital-700 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
          >
            <qa.icon size={13} /> {qa.label}
          </button>
        ))}
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-5">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  m.role === "user"
                    ? "bg-vital-600 text-white"
                    : "border border-ink-100 bg-ink-50 text-ink-800 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-100"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">
                  {m.content}
                  {m.streaming && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-vital-500 align-middle" />}
                </p>
                {!m.streaming && m.citations && m.citations.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.citations.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-2 py-1 text-[11px] text-ink-500 dark:border-ink-700 dark:bg-ink-850">
                        <BookOpen size={11} /> {c.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {thinking && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl border border-ink-100 bg-ink-50 px-4 py-3 dark:border-ink-800 dark:bg-ink-900">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                      className="h-1.5 w-1.5 rounded-full bg-vital-500"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <CardContent className="border-t border-ink-100 dark:border-ink-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) respond("default", input);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a medicine, symptom, or your records…"
              className="flex-1 rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-vital-500 focus:ring-2 focus:ring-vital-200 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
            />
            <button type="submit" className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-vital-600 text-white hover:bg-vital-700">
              <Send size={16} />
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
