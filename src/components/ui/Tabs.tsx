import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
  defaultValue,
  onChange,
  className,
}: {
  tabs: { value: string; label: string }[];
  defaultValue?: string;
  onChange?: (v: string) => void;
  className?: string;
}) {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value);

  function select(v: string) {
    setActive(v);
    onChange?.(v);
  }

  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-ink-200 bg-ink-50 p-1 dark:border-ink-700 dark:bg-ink-900",
        className
      )}
    >
      {tabs.map((t) => (
        <button
          key={t.value}
          role="tab"
          aria-selected={active === t.value}
          onClick={() => select(t.value)}
          className={cn(
            "relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
            active === t.value ? "text-ink-900 dark:text-ink-50" : "text-ink-500 hover:text-ink-800 dark:text-ink-400"
          )}
        >
          {active === t.value && (
            <motion.span
              layoutId="tab-highlight"
              className="absolute inset-0 rounded-lg bg-white shadow-soft dark:bg-ink-800"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          <span className="relative">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

export function useTabs(tabs: { value: string; label: string }[], initial?: string) {
  const [value, setValue] = useState(initial ?? tabs[0]?.value);
  return { value, setValue };
}
