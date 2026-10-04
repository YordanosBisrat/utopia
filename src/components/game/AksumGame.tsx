"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { DIALOGUE, NPC, OBJECTIVES, type Choice } from "@/game/aksum";
import { DialogueBox } from "./DialogueBox";

const AksumScene = dynamic(() => import("./AksumScene"), { ssr: false });

export function AksumGame() {
  const [nearNpc, setNearNpc] = useState(false);
  const [talking, setTalking] = useState(false);
  const [nodeId, setNodeId] = useState("start");
  const [stage, setStage] = useState(0);

  const node = DIALOGUE.find((d) => d.id === nodeId) ?? DIALOGUE[0];

  const openTalk = useCallback(() => {
    setNodeId(stage >= 1 ? "again" : "start");
    setTalking(true);
  }, [stage]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyE" && nearNpc && !talking) openTalk();
      if (e.code === "Escape") setTalking(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nearNpc, talking, openTalk]);

  const choose = (c: Choice) => {
    if (c.progress !== undefined) {
      const p = c.progress;
      setStage((s) => Math.max(s, p));
    }
    if (c.next) setNodeId(c.next);
    else setTalking(false);
  };

  return (
    <div className="absolute inset-0">
      <AksumScene frozen={talking} onNearChange={setNearNpc} />

      {/* HUD: top-left */}
      <div className="pointer-events-none absolute left-4 top-4 space-y-3">
        <div>
          <div className="font-display text-xs uppercase tracking-[0.3em] text-gold">
            Time Journeys · Episode 01
          </div>
          <div className="text-sm text-sand">Aksum · Scribe&apos;s Apprentice</div>
        </div>
        <div className="hud-panel max-w-xs px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-sand/70">Objective</p>
          <p className="mt-1 text-sm text-parchment">{OBJECTIVES[stage]}</p>
        </div>
      </div>

      {/* HUD: controls hint, top-right */}
      <div className="pointer-events-none absolute right-4 top-4 text-right text-xs text-white/70">
        A / D or ← → to walk
        <br />
        W / S or ↑ ↓ to step inward / outward
      </div>

      {/* Interaction prompt */}
      {nearNpc && !talking && (
        <div className="pointer-events-none absolute inset-x-0 bottom-28 flex justify-center">
          <button
            onClick={openTalk}
            className="hud-panel pointer-events-auto px-5 py-2 text-xs uppercase tracking-[0.3em] text-parchment"
          >
            Press <span className="text-gold">E</span> to talk to {NPC.name}
          </button>
        </div>
      )}

      <AnimatePresence>
        {talking && (
          <DialogueBox
            key="dialogue"
            speaker={NPC.name}
            title={NPC.title}
            nodeId={node.id}
            line={node.line}
            choices={node.choices}
            onChoose={choose}
            onClose={() => setTalking(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}