"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getUnlockedSnapshot, subscribeUnlocked } from "./mezgeb";

export function useUnlocked(): string[] {
  const raw = useSyncExternalStore(subscribeUnlocked, getUnlockedSnapshot, () => "[]");
  return useMemo(() => JSON.parse(raw) as string[], [raw]);
}