export type MezgebEntry = {
  id: string;
  category: { am: string; en: string };
  title: { am: string; en: string };
  summary: string;
  sources: { name: string; url?: string }[];
};

// Curated entries. Summaries are original wording; sources must be checked (VERIFY).
export const ENTRIES: MezgebEntry[] = [
  {
    id: "stelae",
    category: { am: "ቅርሶች", en: "Heritage" },
    title: { am: "የአክሱም ሐውልቶች", en: "The Stelae of Aksum" },
    // VERIFY against the source below
    summary:
      "Tall stones raised in the ancient kingdom of Aksum. Many are carved to look like tall buildings, with windows and doors that do not open, and many stand near burial places.",
    sources: [
      {
        name: "UNESCO World Heritage Centre: Aksum",
        url: "https://whc.unesco.org/en/list/15",
      },
    ],
  },
];

// --- Tiny saved-progress store (localStorage, with in-memory fallback) ---
const KEY = "utopia:mezgeb";
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
  } catch {
    cache = [];
  }
  return cache;
}

export function getUnlockedSnapshot(): string {
  return JSON.stringify(read());
}

export function subscribeUnlocked(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function unlockEntry(id: string): void {
  const cur = read();
  if (cur.includes(id)) return;
  cache = [...cur, id];
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* storage unavailable: keep in memory */
  }
  listeners.forEach((l) => l());
}

export function resetUnlocked(): void {
  cache = [];
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}