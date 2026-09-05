import { useCountUp } from "@/hooks/useCountUp";

export function HealthScoreRing({ score, label }: { score: number; label: string }) {
  const animated = useCountUp(score, 1200);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
        <circle cx="72" cy="72" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-ink-100 dark:text-ink-800" />
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          stroke="url(#score-gradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
        <defs>
          <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4FD1AD" />
            <stop offset="100%" stopColor="#3F79D6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-bold text-ink-900 dark:text-ink-50">{Math.round(animated)}</span>
        <span className="text-xs font-medium text-clover-600 dark:text-clover-400">{label}</span>
      </div>
    </div>
  );
}
