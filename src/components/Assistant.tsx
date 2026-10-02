"use client";

import { useSyncExternalStore } from "react";
import { VoxideClient, VoxideWidget } from "@voxide/react";

const ai = new VoxideClient({
  publicKey: process.env.NEXT_PUBLIC_VOXIDE_PUBLIC_KEY ?? "",
});

ai.bindState(() => ({
  app: "UTOPIA",
  currentRoute: window.location.pathname,
}));

// false on the server, true in the browser: avoids the hydration mismatch
const subscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(subscribe, () => true, () => false);

export function Assistant() {
  const isClient = useIsClient();
  if (!isClient) return null;
  return <VoxideWidget client={ai} />;
}