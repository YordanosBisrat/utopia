"use client";

import { useEffect } from "react";

// Every tap / click anywhere bursts a few golden Ethiopian (Ge'ez) letters
// that float up and fade. Pure DOM + Web Animations API, no re-renders.

const LETTERS = "ሀለሐመሠረሰሸቀበተቸኀነኘአከወዐዘዠየደጀገጠጰጸፀፈፐ".split("");
const GOLDS = ["#f2c94c", "#e8b923", "#ffd86b", "#d4a017", "#fbe39a"];

export function TapEffect() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const burst = (x: number, y: number) => {
      const count = 6;
      for (let i = 0; i < count; i++) {
        const el = document.createElement("span");
        el.textContent = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        const size = 16 + Math.random() * 18;
        Object.assign(el.style, {
          position: "fixed",
          left: `${x}px`,
          top: `${y}px`,
          zIndex: "2147483000",
          pointerEvents: "none",
          userSelect: "none",
          fontFamily: "var(--font-noto-ethiopic), serif",
          fontWeight: "700",
          fontSize: `${size}px`,
          color: GOLDS[Math.floor(Math.random() * GOLDS.length)],
          textShadow: "0 0 8px rgba(242,201,76,0.8), 0 0 18px rgba(212,160,23,0.5)",
          willChange: "transform, opacity",
        } as Partial<CSSStyleDeclaration>);
        document.body.appendChild(el);

        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
        const dist = 40 + Math.random() * 50;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 30; // drifts upward
        const rot = (Math.random() - 0.5) * 60;

        const anim = el.animate(
          [
            { transform: "translate(-50%,-50%) scale(0.3) rotate(0deg)", opacity: 0 },
            { transform: `translate(calc(-50% + ${dx * 0.5}px), calc(-50% + ${dy * 0.5}px)) scale(1.1) rotate(${rot / 2}deg)`, opacity: 1, offset: 0.35 },
            { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy - 20}px)) scale(0.8) rotate(${rot}deg)`, opacity: 0 },
          ],
          { duration: 800 + Math.random() * 400, easing: "cubic-bezier(.2,.7,.3,1)" },
        );
        anim.onfinish = () => el.remove();
      }
    };

    const onDown = (e: PointerEvent) => burst(e.clientX, e.clientY);
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  return null;
}