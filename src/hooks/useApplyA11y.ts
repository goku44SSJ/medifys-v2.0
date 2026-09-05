import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export function useApplyA11y() {
  const theme = useStore((s) => s.theme);
  const a11y = useStore((s) => s.a11y);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const html = document.documentElement;
    html.style.setProperty("--a11y-scale", String(a11y.fontScale));
    html.classList.toggle("a11y-high-contrast", a11y.highContrast);
    html.classList.toggle("a11y-reduced-motion", a11y.reducedMotion);
    html.classList.toggle("a11y-large-controls", a11y.largeControls);

    html.classList.remove("cb-protanopia", "cb-deuteranopia", "cb-tritanopia");
    if (a11y.colorBlindMode !== "none") {
      html.classList.add(`cb-${a11y.colorBlindMode}`);
    }
  }, [a11y]);
}
