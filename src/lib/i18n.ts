// Navigation labels in English and Amharic.
// Only the navigation bar is translated so far. Please have a native speaker review the Amharic.
import type { Lang } from "./store";

const T = {
  explore: { en: "Explore", am: "አስስ" },
  journey: { en: "Journey", am: "ጉዞ" },
  portal: { en: "Time Portal", am: "የጊዜ በር" },
  game: { en: "Game", am: "ጨዋታ" },
  challenge: { en: "Challenge", am: "ፈተና" },
  minigames: { en: "Mini-Games", am: "ትናንሽ ጨዋታዎች" },
  mezgeb: { en: "መዝገብ", am: "መዝገብ" },
  search: { en: "Search", am: "ፈልግ" },
  signin: { en: "Sign in", am: "ግባ" },
  register: { en: "Create account", am: "ተመዝገብ" },
  signout: { en: "Sign out", am: "ውጣ" },
  profile: { en: "Profile", am: "መገለጫ" },
  settings: { en: "Settings", am: "ቅንብሮች" },
  switchLang: { en: "Change language", am: "ቋንቋ ቀይር" },
  toLight: { en: "Switch to light theme", am: "ወደ ብሩህ ገጽታ ቀይር" },
  toDark: { en: "Switch to dark theme", am: "ወደ ጨለማ ገጽታ ቀይር" },
} as const;

export type TKey = keyof typeof T;
export const tr = (key: TKey, lang: Lang): string => T[key][lang];
export const LANG_LABEL: Record<Lang, string> = { en: "EN", am: "አማ" };
