"use client";

import { useMemo } from "react";
import * as THREE from "three";

let tex: THREE.CanvasTexture | null = null;

function shadowTexture() {
  if (tex) return tex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, "rgba(0,0,0,0.9)");
  grad.addColorStop(0.55, "rgba(0,0,0,0.4)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  tex = new THREE.CanvasTexture(c);
  return tex;
}

/** Soft blob shadow lying on the ground. */
export function ContactShadow({
  w,
  d,
  opacity = 0.5,
  position = [0, 0.02, 0],
}: {
  w: number;
  d: number;
  opacity?: number;
  position?: [number, number, number];
}) {
  const map = useMemo(() => shadowTexture(), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} renderOrder={1}>
      <planeGeometry args={[w, d]} />
      <meshBasicMaterial
        map={map}
        transparent
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
