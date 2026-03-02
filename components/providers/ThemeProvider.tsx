"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((s) => s.mode);
  const preset = useThemeStore((s) => s.preset);

  useEffect(() => {
    const root = document.documentElement;

    // Remove all mode classes then apply current
    root.classList.remove("light", "dark", "black");
    root.classList.add(mode);

    // Preset de color
    root.setAttribute("data-preset", preset);
  }, [mode, preset]);

  return <>{children}</>;
}
