"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const WORLD_HALF_WIDTH = 40;
const Z_MIN = -3; // furthest into the background
const Z_MAX = 3; // closest to the camera
const BG_POSITION_Y = 60; // % : raise/lower the painted horizon (try 40-75)

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

function Player({ onMove }: { onMove: (x: number) => void }) {
  const ref = useRef<THREE.Group>(null);
  const keys = useKeys();

  useFrame((state, dt) => {
    const camera = state.camera;
    const p = ref.current;
    if (!p) return;
    const k = keys.current;
    const speed = 4;

    if (k.ArrowRight || k.KeyD) p.position.x += speed * dt;
    if (k.ArrowLeft || k.KeyA) p.position.x -= speed * dt;
    if (k.ArrowUp || k.KeyW) p.position.z -= speed * 0.7 * dt;
    if (k.ArrowDown || k.KeyS) p.position.z += speed * 0.7 * dt;

    p.position.x = THREE.MathUtils.clamp(p.position.x, -WORLD_HALF_WIDTH, WORLD_HALF_WIDTH);
    p.position.z = THREE.MathUtils.clamp(p.position.z, Z_MIN, Z_MAX);

    // Side-profile camera glides along X only
    const follow = 1 - Math.pow(0.001, dt);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, p.position.x, follow);
    camera.position.y = 2.4;
    camera.position.z = 13;
    camera.lookAt(camera.position.x, 1.8, 0);

    onMove(camera.position.x);
  });

  // Placeholder body (replaced by the real scribe's apprentice later)
  return (
    <group ref={ref} position={[0, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.5, 20]} />
        <meshBasicMaterial color="black" transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.28, 0.34, 1.3, 12]} />
        <meshStandardMaterial color="#c9a227" />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
    </group>
  );
}

function Stele({ x, z = -5, height }: { x: number; z?: number; height: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.3, 0.25, 1.1]} />
        <meshStandardMaterial color="#6e6150" />
      </mesh>
      <mesh position={[0, height / 2 + 0.25, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[0.26, 0.4, height, 4]} />
        <meshStandardMaterial color="#8c7a62" />
      </mesh>
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

export default function AksumScene() {
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

        <Stele x={-12} z={-5} height={4.5} />
        <Stele x={-4} z={-5.5} height={5.5} />
        <Stele x={6} z={-5} height={4} />
        <Stele x={13} z={-5.5} height={6} />
        <Stele x={21} z={-5} height={4.5} />

        <Player onMove={handleMove} />
      </Canvas>

      {/* cinematic edge darkening */}
      <div className="vignette pointer-events-none absolute inset-0" aria-hidden />
    </div>
  );
}