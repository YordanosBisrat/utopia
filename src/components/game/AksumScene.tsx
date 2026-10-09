"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { NPC, STELE_SPOT, TALK_DISTANCE, type Target } from "@/game/aksum";
import { Scribe, Zeway } from "./AksumCharacters";
import { PLATFORM_H, Stele } from "./AksumStele";

const WORLD_HALF_WIDTH = 40;
const Z_MIN = -3; // furthest into the background
const Z_MAX = 3; // closest to the camera
const BG_POSITION_Y = 60; // % : raise/lower the painted horizon (try 40-75)
const GREAT_STELE_HEIGHT = 6.3;

type Motion = { moving: boolean; dir: number };

function useKeys() {
  const keys = useRef<Record<string, boolean>>({});
  useEffect(() => {
    const handled = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    const down = (e: KeyboardEvent) => {
      if (handled.includes(e.code)) e.preventDefault();
      keys.current[e.code] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);
  return keys;
}

function Player({
  onMove,
  frozen,
  onNearChange,
}: {
  onMove: (x: number) => void;
  frozen: boolean;
  onNearChange: (t: Target) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const motion = useRef<Motion>({ moving: false, dir: 0 });
  const keys = useKeys();
  const frozenRef = useRef(frozen);
  const nearRef = useRef<Target>(null);

  useEffect(() => {
    frozenRef.current = frozen;
  }, [frozen]);

  useFrame((state, dt) => {
    const camera = state.camera;
    const p = ref.current;
    if (!p) return;
    const k = keys.current;
    const speed = 4;

    let dx = 0;
    let dz = 0;
    if (!frozenRef.current) {
      if (k.ArrowRight || k.KeyD) dx += 1;
      if (k.ArrowLeft || k.KeyA) dx -= 1;
      if (k.ArrowUp || k.KeyW) dz -= 1;
      if (k.ArrowDown || k.KeyS) dz += 1;
      p.position.x += dx * speed * dt;
      p.position.z += dz * speed * 0.7 * dt;
    }
    motion.current.moving = dx !== 0 || dz !== 0;
    // turn toward the direction of travel; face Zeway while talking
    motion.current.dir =
      dx !== 0
        ? dx
        : frozenRef.current && nearRef.current === "npc"
          ? Math.sign(NPC.x - p.position.x)
          : 0;

    p.position.x = THREE.MathUtils.clamp(p.position.x, -WORLD_HALF_WIDTH, WORLD_HALF_WIDTH);
    p.position.z = THREE.MathUtils.clamp(p.position.z, Z_MIN, Z_MAX);

    // Side-profile camera glides along X only
    const follow = 1 - Math.pow(0.001, dt);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, p.position.x, follow);
    camera.position.y = 2.4;
    camera.position.z = 13;
    camera.lookAt(camera.position.x, 1.8, 0);

    onMove(camera.position.x);

    // What can the player interact with right now? (report only on change)
    const dNpc = Math.hypot(p.position.x - NPC.x, p.position.z - NPC.z);
    const dStele = Math.hypot(p.position.x - STELE_SPOT.x, p.position.z - STELE_SPOT.z);
    const next: Target =
      dNpc < TALK_DISTANCE ? "npc" : dStele < STELE_SPOT.range ? "stele" : null;
    if (next !== nearRef.current) {
      nearRef.current = next;
      onNearChange(next);
    }
  });

  return (
    <group ref={ref} name="scribe" position={[-3, 0, 0]}>
      <Scribe motion={motion} />
    </group>
  );
}

// The gold discovery star: marks things worth your attention
function Star({
  x,
  y,
  z,
  size = 0.16,
}: {
  x: number;
  y: number;
  z: number;
  size?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const s = ref.current;
    if (!s) return;
    const t = state.clock.elapsedTime;
    s.rotation.y = t;
    s.position.y = y + Math.sin(t * 2) * 0.08;
  });

  return (
    <mesh ref={ref} position={[x, y, z]}>
      <octahedronGeometry args={[size]} />
      <meshBasicMaterial color="#f2c94c" />
    </mesh>
  );
}

// Zeway, the stone carver (fictional)
function Npc() {
  return (
    <group>
      <Zeway x={NPC.x} z={NPC.z} />
      <Star x={NPC.x} y={3.15} z={NPC.z} />
    </group>
  );
}

// Ground that fades into the painted horizon instead of ending in a hard edge
function Ground() {
  const alpha = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 256;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#000000"); // far edge: transparent
    grad.addColorStop(0.3, "#ffffff"); // solid from here forward
    grad.addColorStop(1, "#ffffff");
    g.fillStyle = grad;
    g.fillRect(0, 0, 4, 256);
    return new THREE.CanvasTexture(c);
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[140, 30]} />
      <meshStandardMaterial color="#a89070" transparent alphaMap={alpha} />
    </mesh>
  );
}

export default function AksumScene({
  frozen = false,
  onNearChange,
  highlightStele = false,
}: {
  frozen?: boolean;
  onNearChange: (t: Target) => void;
  highlightStele?: boolean;
}) {
  const bgRef = useRef<HTMLDivElement>(null);

  // Painted backdrop drifts slower than the camera (parallax depth)
  const handleMove = useCallback((x: number) => {
    const el = bgRef.current;
    if (!el) return;
    const shift = (-x / WORLD_HALF_WIDTH) * 0.18 * window.innerWidth;
    el.style.transform = `translate3d(${shift}px, 0, 0)`;
  }, []);

  return (
    <div className="absolute inset-0">
      <div
        ref={bgRef}
        className="absolute inset-y-0 -left-[20%] w-[140%] bg-cover"
        style={{
          backgroundImage: "url(/art/aksum.jpg)",
          backgroundPosition: `center ${BG_POSITION_Y}%`,
        }}
        aria-hidden
      />

      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 2.4, 13], fov: 38 }}
        gl={{ alpha: true }}
        className="!absolute inset-0"
      >
        <ambientLight intensity={0.6} color="#ffd9a8" />
        <directionalLight position={[10, 6, 4]} intensity={1.6} color="#ffcf8a" />
        <directionalLight position={[-8, 4, -6]} intensity={0.35} color="#8fa7d9" />

        <Ground />

        {/* plain stelae: slender slabs with rounded tops */}
        <Stele x={-15} z={-5} height={4.2} />
        <Stele x={6} z={-5} height={3.6} tilt={0.025} tint="#cfc6b3" />
        <Stele x={23} z={-5} height={4.4} tint="#d4cab6" />

        {/* a carved, multi-storey stele and a broken length lying where it fell */}
        <Stele x={-4} z={-5.6} height={5.2} carved storeys={8} tint="#d2c8b4" />
        <Stele x={-9.5} z={-3.7} height={3.1} carved storeys={5} fallen />

        {/* the great stele: carved storeys, false door, stepped platform */}
        <Stele x={STELE_SPOT.x - 2.9} z={-5.9} height={2.6} tilt={-0.02} />
        <Stele x={STELE_SPOT.x + 2.9} z={-5.8} height={2.2} tilt={0.03} tint="#cdc3af" />
        <Stele
          x={STELE_SPOT.x}
          z={STELE_SPOT.z}
          height={GREAT_STELE_HEIGHT}
          carved
          storeys={10}
          platform
        />

        {highlightStele && (
          <Star
            x={STELE_SPOT.x}
            y={PLATFORM_H + GREAT_STELE_HEIGHT + 1.2}
            z={STELE_SPOT.z}
            size={0.3}
          />
        )}

        <Npc />
        <Player
          onMove={handleMove}
          frozen={frozen}
          onNearChange={onNearChange}
        />
      </Canvas>

      {/* cinematic edge darkening */}
      <div className="vignette pointer-events-none absolute inset-0" aria-hidden />
    </div>
  );
}