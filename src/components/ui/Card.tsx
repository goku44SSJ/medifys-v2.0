import React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink-200 bg-white shadow-soft dark:border-ink-700 dark:bg-ink-850",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pb-0", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-display font-semibold text-ink-900 dark:text-ink-50", className)} {...props} />;
}

type BadgeTone = "neutral" | "vital" | "clover" | "amber" | "coral";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  const tones: Record<BadgeTone, string> = {
    neutral: "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200",
    vital: "bg-vital-100 text-vital-700 dark:bg-vital-900 dark:text-vital-200",
    clover: "bg-clover-100 text-clover-600 dark:bg-clover-600/20 dark:text-clover-300",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-600/20 dark:text-amber-300",
    coral: "bg-coral-100 text-coral-600 dark:bg-coral-600/20 dark:text-coral-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

export function Progress({ value, tone = "vital" }: { value: number; tone?: BadgeTone }) {
  const tones: Record<BadgeTone, string> = {
    neutral: "bg-ink-400",
    vital: "bg-vital-500",
    clover: "bg-clover-500",
    amber: "bg-amber-500",
    coral: "bg-coral-500",
  };
  return (
    <div className="h-2 w-full rounded-full bg-ink-100 dark:bg-ink-700 overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all duration-700 ease-out", tones[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
