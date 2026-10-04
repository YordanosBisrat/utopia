"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence } from "motion/react";
import {
  DIALOGUE,
  NPC,
  OBJECTIVES,
  startNodeFor,
  type Choice,
  type Target,
} from "@/game/aksum";
import {
  getUnlockedSnapshot,
  resetUnlocked,
  subscribeUnlocked,
  unlockEntry,
} from "@/game/mezgeb";
import { DialogueBox } from "./DialogueBox";
import { DiscoveryOverlay, ExaminePanel, MezgebPanel } from "./Overlays";

const AksumScene = dynamic(() => import("./AksumScene"), { ssr: false });

export function AksumGame() {
  const [target, setTarget] = useState<Target>(null);
  const [talking, setTalking] = useState(false);
  const [examining, setExamining] = useState(false);
  const [mezgebOpen, setMezgebOpen] = useState(false);
  const [discovery, setDiscovery] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [nodeId, setNodeId] = useState("start");
  const [stage, setStage] = useState(0);

  const rawUnlocked = useSyncExternalStore(
    subscribeUnlocked,
    getUnlockedSnapshot,
    () => "[]",
  );
  const unlocked = useMemo(() => JSON.parse(rawUnlocked) as string[], [rawUnlocked]);

  const busy = talking || examining || mezgebOpen || discovery !== null;
  const node = DIALOGUE.find((d) => d.id === nodeId) ?? DIALOGUE[0];

  // The stele can only be examined once Zeway has sent you there
  const activeTarget: Target = target === "stele" && stage < 1 ? null : target;

  const closeDialogue = useCallback(
    (pend: string | null = pending) => {
      setTalking(false);
      if (pend) {
        setDiscovery(pend);
        setPending(null);
      }
    },
    [pending],
  );

  const finishExamine = useCallback(() => {
    setExamining(false);
    setStage((s) => Math.max(s, 2));
  }, []);

  const interact = useCallback(() => {
    if (busy) return;
    if (activeTarget === "npc") {
      setNodeId(startNodeFor(stage));
      setTalking(true);
    } else if (activeTarget === "stele") {
      setExamining(true);
    }
  }, [busy, activeTarget, stage]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyE") interact();
      else if (e.code === "KeyM") {
        if (!talking && !examining && discovery === null) setMezgebOpen((o) => !o);
      } else if (e.code === "Escape") {
        if (discovery !== null) setDiscovery(null);
        else if (mezgebOpen) setMezgebOpen(false);
        else if (examining) finishExamine();
        else if (talking) closeDialogue();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [interact, talking, examining, mezgebOpen, discovery, finishExamine, closeDialogue]);

  const choose = (c: Choice) => {
    if (c.progress !== undefined) {
      const p = c.progress;
      setStage((s) => Math.max(s, p));
    }
    let pend = pending;
    if (c.unlock) {
      unlockEntry(c.unlock);
      setPending(c.unlock);
      pend = c.unlock;
    }
    if (c.next) setNodeId(c.next);
    else closeDialogue(pend);
  };

  const prompt =
    activeTarget === "npc"
      ? `talk to ${NPC.name}`
      : activeTarget === "stele"
        ? "examine the tallest stele"
        : null;

  return (
    <div className="absolute inset-0">
      <AksumScene frozen={busy} onNearChange={setTarget} highlightStele={stage === 1} />

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

      {/* HUD: top-right */}
      <div className="absolute right-4 top-4 flex flex-col items-end gap-3">
        <div className="pointer-events-none text-right text-xs text-white/70">
          A / D or ← → to walk
          <br />
          W / S or ↑ ↓ to step inward / outward
        </div>
        <button
          onClick={() => !busy && setMezgebOpen(true)}
          className="hud-panel px-4 py-2 text-xs uppercase tracking-[0.3em] text-parchment transition-colors hover:text-gold"
        >
          <span className="font-geez normal-case">መዝገብ</span>{" "}
          <span className="text-gold">({unlocked.length})</span>
          <span className="ml-2 text-sand/50">M</span>
        </button>
      </div>

      {/* Interaction prompt */}
      {prompt && !busy && (
        <div className="pointer-events-none absolute inset-x-0 bottom-28 flex justify-center">
          <button
            onClick={interact}
            className="hud-panel pointer-events-auto px-5 py-2 text-xs uppercase tracking-[0.3em] text-parchment"
          >
            Press <span className="text-gold">E</span> to {prompt}
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
            onClose={() => closeDialogue()}
          />
        )}
        {examining && <ExaminePanel key="examine" onDone={finishExamine} />}
        {discovery && (
          <DiscoveryOverlay
            key="discovery"
            entryId={discovery}
            onOpen={() => {
              setDiscovery(null);
              setMezgebOpen(true);
            }}
            onContinue={() => setDiscovery(null)}
          />
        )}
        {mezgebOpen && (
          <MezgebPanel
            key="mezgeb"
            unlocked={unlocked}
            onClose={() => setMezgebOpen(false)}
            onReset={resetUnlocked}
          />
        )}
      </AnimatePresence>
    </div>
  );
}