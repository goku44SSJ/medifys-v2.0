import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  MessageCircle,
  FileText,
  Send,
  Calendar,
} from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/useStore";

type CallState = "idle" | "connecting" | "live" | "ended";

export function Consultations() {
  const appointments = useStore((s) => s.appointments);
  const doctors = useStore((s) => s.doctors);
  const [callState, setCallState] = useState<CallState>("idle");
  const [activeDoctorId, setActiveDoctorId] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: "you" | "doctor"; text: string }[]>([]);
  const [draft, setDraft] = useState("");
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<number>();

  const doctor = doctors.find((d) => d.id === activeDoctorId);

  useEffect(() => {
    if (callState === "live") {
      timerRef.current = window.setInterval(() => setDuration((d) => d + 1), 1000);
      const t = setTimeout(() => {
        setMessages((m) => [...m, { from: "doctor", text: "Hi Ananya, I can see you. How have you been feeling since our last visit?" }]);
      }, 2500);
      return () => {
        clearTimeout(t);
        window.clearInterval(timerRef.current);
      };
    }
  }, [callState]);

  function startCall(docId: string) {
    setActiveDoctorId(docId);
    setCallState("connecting");
    setDuration(0);
    setMessages([]);
    setTimeout(() => setCallState("live"), 1800);
  }

  function endCall() {
    setCallState("ended");
    window.clearInterval(timerRef.current);
    setTimeout(() => {
      setCallState("idle");
      setActiveDoctorId(null);
    }, 1600);
  }

  function sendMessage() {
    if (!draft.trim()) return;
    setMessages((m) => [...m, { from: "you", text: draft }]);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [...m, { from: "doctor", text: "Noted — let's discuss that in more detail." }]);
    }, 1200);
  }

  const mm = String(Math.floor(duration / 60)).padStart(2, "0");
  const ss = String(duration % 60).padStart(2, "0");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Consultations</h2>
        <p className="text-ink-500 dark:text-ink-400">Video visits, scheduling, and consultation notes.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {appointments.map((a) => {
          const d = doctors.find((doc) => doc.id === a.doctorId);
          if (!d) return null;
          return (
            <Card key={a.id}>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: d.avatarColor }}
                  >
                    {d.name.split(" ")[1]?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-900 dark:text-ink-50">{d.name}</p>
                    <p className="text-xs text-ink-400">{d.specialty}</p>
                  </div>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400">
                  <Calendar size={13} /> {a.date} · {a.time}
                </p>
                <Badge tone={a.status === "upcoming" ? "vital" : a.status === "completed" ? "neutral" : "coral"}>{a.status}</Badge>
                {a.type === "video" && a.status === "upcoming" && (
                  <Button size="sm" className="w-full" onClick={() => startCall(d.id)}>
                    <Video size={14} /> Start consultation
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AnimatePresence>
        {callState !== "idle" && doctor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/90 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-ink-900 shadow-lift"
            >
              <div className="relative flex-1">
                {callState === "connecting" && (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-ink-200">
                    <div
                      className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-semibold text-white"
                      style={{ backgroundColor: doctor.avatarColor }}
                    >
                      {doctor.name.split(" ")[1]?.[0]}
                    </div>
                    <p className="font-medium">Connecting to {doctor.name}…</p>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                          className="h-1.5 w-1.5 rounded-full bg-vital-400"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {callState === "live" && (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-ink-800 to-ink-950">
                    <div
                      className="flex h-28 w-28 items-center justify-center rounded-full text-3xl font-semibold text-white"
                      style={{ backgroundColor: doctor.avatarColor }}
                    >
                      {doctor.name.split(" ")[1]?.[0]}
                    </div>
                    <div className="absolute right-4 top-4 rounded-lg bg-black/40 px-2.5 py-1 text-xs text-white">
                      {mm}:{ss}
                    </div>
                    <div className="absolute bottom-24 right-4 flex h-24 w-16 items-center justify-center rounded-xl border border-ink-700 bg-ink-800 text-xs text-ink-400">
                      {camOn ? "You" : <VideoOff size={16} />}
                    </div>
                  </div>
                )}

                {callState === "ended" && (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-ink-200">
                    <p className="font-medium">Call ended</p>
                    <p className="text-sm text-ink-400">
                      Duration {mm}:{ss}
                    </p>
                  </div>
                )}

                {chatOpen && callState === "live" && (
                  <motion.div
                    initial={{ x: 280 }}
                    animate={{ x: 0 }}
                    exit={{ x: 280 }}
                    className="absolute right-0 top-0 flex h-full w-72 flex-col border-l border-ink-700 bg-ink-900/95"
                  >
                    <div className="flex items-center justify-between border-b border-ink-800 p-3">
                      <p className="text-sm font-medium text-ink-100">Chat</p>
                      <FileText size={14} className="text-ink-400" />
                    </div>
                    <div className="flex-1 space-y-2 overflow-y-auto p-3">
                      {messages.map((m, i) => (
                        <div key={i} className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-xs ${m.from === "you" ? "ml-auto bg-vital-600 text-white" : "bg-ink-800 text-ink-100"}`}>
                          {m.text}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1.5 border-t border-ink-800 p-2">
                      <input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Message…"
                        className="flex-1 rounded-lg bg-ink-800 px-2.5 py-1.5 text-xs text-ink-100 outline-none placeholder:text-ink-500"
                      />
                      <button onClick={sendMessage} className="rounded-lg bg-vital-600 p-1.5 text-white">
                        <Send size={13} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {callState === "live" && (
                <div className="flex items-center justify-center gap-3 border-t border-ink-800 bg-ink-900 p-4">
                  <button
                    onClick={() => setMicOn(!micOn)}
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${micOn ? "bg-ink-800 text-white" : "bg-coral-600 text-white"}`}
                  >
                    {micOn ? <Mic size={17} /> : <MicOff size={17} />}
                  </button>
                  <button
                    onClick={() => setCamOn(!camOn)}
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${camOn ? "bg-ink-800 text-white" : "bg-coral-600 text-white"}`}
                  >
                    {camOn ? <Video size={17} /> : <VideoOff size={17} />}
                  </button>
                  <button
                    onClick={() => setChatOpen(!chatOpen)}
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${chatOpen ? "bg-vital-600 text-white" : "bg-ink-800 text-white"}`}
                  >
                    <MessageCircle size={17} />
                  </button>
                  <button onClick={endCall} className="flex h-11 w-11 items-center justify-center rounded-full bg-coral-600 text-white">
                    <PhoneOff size={17} />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
