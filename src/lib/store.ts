"use client";

// Prototype player state, persisted to localStorage.
// Swap `load`/`persist` for API calls when the backend arrives.
import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import { achievements, explorationById, journeyPath, type AchievementId } from "./data";

export type Lang = "en" | "am";

export interface PlayerState {
  name: string;
  xp: number;
  discoveries: string[];
  favorites: string[];
  completedChallenges: string[]; // "YYYY-MM-DD:challengeId"
  streak: number;
  lastChallengeDay: string | null;
  achievements: AchievementId[];
  minigames: Record<string, number>; // best score
  episodes: string[];
  voiceUses: number;
  mapsOpened: number;
  language: Lang;
  reduceMotion: boolean;
  onboarded: boolean;
  interests: string[];
  level: "new" | "some" | "expert" | null;
}

const KEY = "utopia.player.v1";
const initial: PlayerState = {
  name: "Explorer",
  xp: 0,
  discoveries: [],
  favorites: [],
  completedChallenges: [],
  streak: 0,
  lastChallengeDay: null,
  achievements: [],
  minigames: {},
  episodes: [],
  voiceUses: 0,
  mapsOpened: 0,
  language: "en",
  reduceMotion: false,
  onboarded: false,
  interests: [],
  level: null,
};

let state: PlayerState = initial;
let hydrated = false;
const listeners = new Set<() => void>();

function load() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function set(updater: (s: PlayerState) => PlayerState) {
  load();
  const prev = state;
  state = checkAchievements(updater(state));
  if (state.xp > prev.xp) {
    const before = levelOf(prev.xp).level;
    const after = levelOf(state.xp).level;
    if (after > before) toast.success(`Level ${after} reached!`, { description: "The road ahead grows brighter." });
  }
  persist();
  listeners.forEach((l) => l());
}

function checkAchievements(s: PlayerState): PlayerState {
  const has = new Set(s.achievements);
  const unlock: AchievementId[] = [];
  const places = journeyPath.filter((n) => s.discoveries.includes(n.id)).length;
  const rules: [AchievementId, boolean][] = [
    ["first-discovery", s.discoveries.length >= 1],
    ["story-keeper", s.discoveries.length >= 10],
    ["time-traveler", s.episodes.length >= 1],
    ["map-reader", s.mapsOpened >= 1],
    ["curious-mind", s.completedChallenges.length >= 1],
    ["voice-explorer", s.voiceUses >= 1],
    ["roots-routes", places >= 5],
    ["game-master", Object.keys(s.minigames).length >= 3],
  ];
  for (const [id, ok] of rules) if (ok && !has.has(id)) unlock.push(id);
  if (!unlock.length) return s;
  unlock.forEach((id) => {
    const a = achievements.find((x) => x.id === id)!;
    setTimeout(() => toast(`Achievement unlocked · ${a.title}`, { description: a.desc }), 0);
  });
  return { ...s, achievements: [...s.achievements, ...unlock], xp: s.xp + unlock.length * 30 };
}

export const levelOf = (xp: number) => {
  const per = 250;
  const level = Math.floor(xp / per) + 1;
  return { level, into: xp % per, per };
};

export const today = () => new Date().toISOString().slice(0, 10);

export const actions = {
  discover(id: string) {
    if (state.discoveries.includes(id)) return false;
    const e = explorationById(id);
    set((s) => ({ ...s, discoveries: [...s.discoveries, id], xp: s.xp + 25 }));
    toast.success(`Added to መዝገብ · ${e?.title ?? id}`, { description: "+25 XP" });
    return true;
  },
  toggleFavorite(id: string) {
    set((s) => ({
      ...s,
      favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
    }));
  },
  answerChallenge(id: string, correct: boolean, xp: number) {
    const d = today();
    set((s) => {
      if (s.completedChallenges.some((c) => c.startsWith(d))) return s;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const streak = correct ? (s.lastChallengeDay === yesterday ? s.streak + 1 : 1) : 0;
      return {
        ...s,
        completedChallenges: correct ? [...s.completedChallenges, `${d}:${id}`] : s.completedChallenges,
        lastChallengeDay: correct ? d : s.lastChallengeDay,
        streak,
        xp: s.xp + (correct ? xp : 5),
      };
    });
  },
  finishMiniGame(id: string, score: number, xp: number) {
    set((s) => ({
      ...s,
      minigames: { ...s.minigames, [id]: Math.max(score, s.minigames[id] ?? 0) },
      xp: s.xp + xp,
    }));
  },
  completeEpisode(id: string) {
    set((s) => ({ ...s, episodes: s.episodes.includes(id) ? s.episodes : [...s.episodes, id], xp: s.xp + 150 }));
  },
  addXp(n: number) {
    set((s) => ({ ...s, xp: s.xp + n }));
  },
  usedVoice() {
    set((s) => ({ ...s, voiceUses: s.voiceUses + 1 }));
  },
  openedMap() {
    set((s) => ({ ...s, mapsOpened: s.mapsOpened + 1 }));
  },
  setName(name: string) {
    set((s) => ({ ...s, name: name || "Explorer" }));
  },
  setLanguage(language: Lang) {
    set((s) => ({ ...s, language }));
  },
  setReduceMotion(reduceMotion: boolean) {
    set((s) => ({ ...s, reduceMotion }));
  },
  completeOnboarding(o: { name: string; language: Lang; interests: string[]; level: "new" | "some" | "expert" }) {
    set((s) => ({
      ...s,
      name: o.name.trim() || "Explorer",
      language: o.language,
      interests: o.interests,
      level: o.level,
      onboarded: true,
    }));
  },
  reset() {
    set(() => initial);
  },
};

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  // notify once after hydration so client reflects stored data
  queueMicrotask(l);
  return () => listeners.delete(l);
}

export function usePlayer(): PlayerState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => initial,
  );
}

/* Current exploration context for Ask UTOPIA (not persisted) */
let ctx: string | null = null;
const ctxListeners = new Set<() => void>();
export function setExplorationContext(id: string | null) {
  ctx = id;
  ctxListeners.forEach((l) => l());
}
export function useExplorationContext() {
  return useSyncExternalStore(
    (l) => {
      ctxListeners.add(l);
      return () => ctxListeners.delete(l);
    },
    () => ctx,
    () => null,
  );
}

/* Ask UTOPIA panel open state */
let askOpen = false;
const askListeners = new Set<() => void>();
export function setAskOpen(v: boolean) {
  askOpen = v;
  askListeners.forEach((l) => l());
}
export function useAskOpen() {
  return useSyncExternalStore(
    (l) => {
      askListeners.add(l);
      return () => askListeners.delete(l);
    },
    () => askOpen,
    () => false,
  );
}
