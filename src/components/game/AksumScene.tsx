"use client";

import { Canvas, useFrame, } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const WORLD_HALF_WIDTH = 40;
const Z_MIN = -3; // furthest into the background
const Z_MAX = 3; // closest to the camera

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

function Player() {
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
    if (k.ArrowUp || k.KeyW) p.position.z -= speed * 0.7 * dt; // inward
    if (k.ArrowDown || k.KeyS) p.position.z += speed * 0.7 * dt; // outward

    p.position.x = THREE.MathUtils.clamp(p.position.x, -WORLD_HALF_WIDTH, WORLD_HALF_WIDTH);
    p.position.z = THREE.MathUtils.clamp(p.position.z, Z_MIN, Z_MAX);

    // Side-profile camera: glides along X only, fixed height and distance
    const follow = 1 - Math.pow(0.001, dt);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, p.position.x, follow);
    camera.position.y = 2.4;
    camera.position.z = 9;
    camera.lookAt(camera.position.x, 1.4, 0);
  });

  // Placeholder body (replaced by a real scribe's apprentice model later)
  return (
    <group ref={ref} position={[0, 0, 0]}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.28, 0.32, 1.3, 12]} />
        <meshStandardMaterial color="#c9a227" />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color="#6b4423" />
      </mesh>
    </group>
  );
}

function Stele({ x, height }: { x: number; height: number }) {
  return (
    <mesh position={[x, height / 2, -2.5]}>
      <boxGeometry args={[1, height, 0.6]} />
      <meshStandardMaterial color="#8a8578" />
    </mesh>
  );
}

export default function AksumScene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 2.4, 9], fov: 40 }}>
      <color attach="background" args={["#e9c9a1"]} />
      <fog attach="fog" args={["#e9c9a1", 14, 45]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[8, 12, 6]} intensity={1.1} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 24]} />
        <meshStandardMaterial color="#b89968" />
      </mesh>

      {/* Placeholder stelae */}
      <Stele x={6} height={5} />
      <Stele x={9} height={7} />
      <Stele x={12} height={4} />
      <Stele x={-8} height={3} />

      <Player />
    </Canvas>
  );
}