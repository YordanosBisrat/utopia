"use client";

import { Moon, Sun } from "lucide-react";
import { toggleTheme, useTheme } from "@/lib/theme";
import { tr } from "@/lib/i18n";
import { usePlayer } from "@/lib/store";

/** Dark / light switch. Shows a sun while dark (click for light) and a moon while light. */
export function ThemeToggle() {
  const theme = useTheme();
  const { language } = usePlayer();
  const label = tr(theme === "dark" ? "toLight" : "toDark", language);
  return (
    <button
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-gold/10 hover:text-gold"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
