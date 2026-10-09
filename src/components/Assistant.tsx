"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { VoxideClient, VoxideWidget } from "@voxide/react";
import {
  getGameActions,
  getGameSnapshot,
  getLanguageName,
  setLanguageName,
} from "@/game/bridge";
import { lookup } from "@/game/knowledge";

// false on the server, true in the browser
const subscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(subscribe, () => true, () => false);

function AssistantInner() {
  const [notice, setNotice] = useState<string | null>(null);

  const ai = useMemo(() => {
    const client = new VoxideClient({
      publicKey: process.env.NEXT_PUBLIC_VOXIDE_PUBLIC_KEY ?? "",
    });

    // The agent sees this small snapshot on every turn
    client.bindState(() => ({
      app: "UTOPIA",
      route: window.location.pathname,
      language: getLanguageName(),
      ...getGameSnapshot(),
    }));

    // Used when the agent has no grounded answer
    client.setFallback({
      message: "I don't have enough verified information about that yet.",
      suggestions: [
        "Tell me about Aksum",
        "What is a stele?",
        "What should I do now?",
      ],
    });

    client.register({
      lookupKnowledge: {
        description:
          "Look up verified facts about Aksum and Ethiopian history. ALWAYS call this before stating any historical fact, date or claim. Speech recognition may mishear names: treat 'Axum', 'Axsum' and 'Oxsum' as Aksum. Pass the player's topic in your own clean words.",
        params: {
          topic: {
            type: "string",
            required: true,
            description:
              "What the player is asking about, e.g. 'Aksum trade', 'stelae', 'Ge'ez script'.",
          },
        },
        handler: ({ topic }) => {
          const result = lookup(String(topic ?? ""));
          console.log("[voxide] lookup result", topic, result);
          return result;
        },
      },

      openMezgeb: {
        description:
          "Open the መዝገብ (Mezgeb) knowledge archive that shows the player's discoveries.",
        handler: () => {
          const a = getGameActions();
          if (!a.openMezgeb) return { status: "unavailable", reason: "Open a journey first." };
          a.openMezgeb();
          return { status: "opened" };
        },
      },

      closeOverlay: {
        description: "Close the archive or any discovery screen that is open.",
        handler: () => {
          getGameActions().closeOverlay?.();
          return { status: "closed" };
        },
      },

      interactWithNearby: {
        description:
          "Talk to the nearby character or examine the nearby object, the same as pressing E. Use when the player says 'talk to him', 'start the quest' or 'look at that'.",
        handler: () => {
          const a = getGameActions();
          if (!a.interact) return { status: "unavailable", reason: "Open a journey first." };
          return { status: "ok", result: a.interact() };
        },
      },

      switchLanguage: {
        description: "Switch the language the guide speaks.",
        params: {
          language: {
            type: "string",
            required: true,
            enum: ["english", "amharic"],
            description: "The language to speak from now on.",
          },
        },
        handler: ({ language }) => {
          const am = language === "amharic";
          client.setLanguage(am ? "am-ET" : "en-US");
          setLanguageName(am ? "Amharic" : "English");
          return { status: "ok", language: am ? "Amharic" : "English" };
        },
      },
    });

    return client;
  }, []);

  // TEMPORARY debug log: delete this block after the voice test
  useEffect(() => {
    const events = ["status", "transcript", "message", "ready", "error", "action"] as const;
    const offs = events.map((ev) =>
      ai.on(ev, (payload) => console.log("[voxide]", ev, payload)),
    );
    return () => offs.forEach((off) => off());
  }, [ai]);

  // Graceful failure: the game keeps working if voice is unavailable
  useEffect(() => {
    const off = ai.on("error", () =>
      setNotice("Voice assistant unavailable. You can continue exploring."),
    );
    return off;
  }, [ai]);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 7000);
    return () => clearTimeout(id);
  }, [notice]);

  return (
    <>
      <VoxideWidget client={ai} />
      {notice && (
        <div
          role="status"
          className="hud-panel fixed bottom-20 left-1/2 z-[2147483000] -translate-x-1/2 px-4 py-2 text-xs text-sand"
        >
          {notice}
        </div>
      )}
    </>
  );
}

export function Assistant() {
  const isClient = useIsClient();
  return isClient ? <AssistantInner /> : null;
}