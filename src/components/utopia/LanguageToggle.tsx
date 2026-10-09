"use client";

import { Globe } from "lucide-react";
import { actions, usePlayer, type Lang } from "@/lib/store";
import { LANG_LABEL, tr } from "@/lib/i18n";
import { setLanguageName } from "@/game/bridge";

const ORDER: Lang[] = ["en", "am"];

/** Globe + current language. Click to switch between English and Amharic. */
export function LanguageToggle() {
  const { language } = usePlayer();
  const next = ORDER[(ORDER.indexOf(language) + 1) % ORDER.length];
  const label = `${tr("switchLang", language)} (${LANG_LABEL[next]})`;

  const change = () => {
    actions.setLanguage(next);
    // The voice guide reads this value and answers in the chosen language.
    setLanguageName(next === "am" ? "Amharic" : "English");
  };

  return (
    <button
      onClick={change}
      aria-label={label}
      title={label}
      className="flex h-9 items-center gap-1.5 rounded-sm px-2 text-sm text-muted-foreground transition-colors hover:bg-gold/10 hover:text-gold"
    >
      <Globe className="h-5 w-5" />
      <span className="font-medium">{LANG_LABEL[language]}</span>
    </button>
  );
}
