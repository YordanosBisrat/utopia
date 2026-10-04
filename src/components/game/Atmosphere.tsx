"use client";

import { useMemo } from "react";

// Deterministic pseudo-random so server and browser render identical markup
const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return Math.round((x - Math.floor(x)) * 1000) / 1000;
};

/** Drifting embers / dust motes. */
export function Embers({ count = 26 }: { count?: number }) {
  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.round(rand(i + 1) * 100),
        size: 1 + Math.round(rand(i + 101) * 3),
        duration: 16 + Math.round(rand(i + 201) * 26),
        delay: -Math.round(rand(i + 301) * 40),
        sway: `${Math.round((rand(i + 401) - 0.5) * 160)}px`,
        opacity: 0.25 + Math.round(rand(i + 501) * 50) / 100,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {motes.map((m) => (
        <span
          key={m.id}
          className="animate-ember absolute bottom-[-6vh] rounded-full bg-gold"
          style={{
            left: `${m.left}%`,
            width: m.size,
            height: m.size,
            opacity: m.opacity,
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
            ["--sway" as string]: m.sway,
            boxShadow: "0 0 8px currentColor",
          }}
        />
      ))}
    </div>
  );
}

/** Slow banks of cloud passing across the sky. */
export function Clouds() {
  const bands = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        id: i,
        top: 4 + i * 11,
        duration: 90 + i * 40,
        delay: -i * 35,
        height: 60 + i * 30,
        opacity: 0.12 + i * 0.03,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 overflow-hidden" aria-hidden>
      {bands.map((b) => (
        <div
          key={b.id}
          className="absolute w-[45%] rounded-full bg-parchment blur-3xl"
          style={{
            top: `${b.top}%`,
            height: b.height,
            opacity: b.opacity,
            animation: `cloud-pan ${b.duration}s linear infinite`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Full-bleed living backdrop: drifting image + sky + particles + vignette. */
export function SceneBackdrop({
  image,
  cinematic = false,
}: {
  image: string;
  cinematic?: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="animate-kenburns absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <Clouds />
      <Embers count={cinematic ? 34 : 24} />
      <div className="vignette absolute inset-0" />
      <div className="scrim absolute inset-x-0 bottom-0 h-2/3" />
      {cinematic && (
        <>
          <div className="absolute inset-x-0 top-0 h-[8vh] bg-ink" />
          <div className="absolute inset-x-0 bottom-0 h-[8vh] bg-ink" />
        </>
      )}
    </div>
  );
}