"use client";

import dynamic from "next/dynamic";

const AksumScene = dynamic(() => import("@/components/game/AksumScene"), {
  ssr: false,
});

export default function AksumPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <AksumScene />
      <div className="pointer-events-none absolute left-4 top-4 text-sm text-white/90">
        <div className="font-semibold">Time Journeys · Episode 01: Aksum</div>
        <div className="text-white/60">Scribe&apos;s Apprentice</div>
      </div>
      <div className="pointer-events-none absolute right-4 top-4 text-right text-xs text-white/70">
        A / D or ← → to walk
        <br />
        W / S or ↑ ↓ to step inward / outward
      </div>
    </main>
  );
}