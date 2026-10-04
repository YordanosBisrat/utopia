"use client";

import { useMemo, useSyncExternalStore } from "react";
import { VoxideClient, VoxideWidget } from "@voxide/react";

// false on the server, true in the browser
const subscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(subscribe, () => true, () => false);

function AssistantInner() {
  // Created once, only in the browser (never on the server)
  const ai = useMemo(() => {
    const client = new VoxideClient({
      publicKey: process.env.NEXT_PUBLIC_VOXIDE_PUBLIC_KEY ?? "",
    });
    client.bindState(() => ({
      app: "UTOPIA",
      currentRoute: window.location.pathname,
    }));
    return client;
  }, []);

  return <VoxideWidget client={ai} />;
}

export function Assistant() {
  const isClient = useIsClient();
  return isClient ? <AssistantInner /> : null;
}