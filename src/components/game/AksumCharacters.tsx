"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import * as THREE from "three";
import { ContactShadow } from "./ContactShadow";

// Hand-built, outlined cartoon characters modelled on the reference art:
//  - the young scribe: curly black hair, big brown eyes, teal studded jacket,
//    turquoise tee with a gold/white sash, studded shorts, barefoot, staff
//    carried across the shoulders
//  - Zeway the stone carver: tall elongated figure, big round afro, almond
//    eyes, forehead mark, indigo + blue angular collar with gold stripes,
//    ochre robe with a tricolour woven hem, mallet and chisel

const INK = "#150e0a";
type V3 = [number, number, number];

function Part({
  geo,
  color,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  outline = true,
  rough = 0.8,
}: {
  geo: ReactNode;
  color: string;
  position?: V3;
  rotation?: V3;
  scale?: V3;
  outline?: boolean;
  rough?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh>
        {geo}
        <meshStandardMaterial color={color} roughness={rough} />
      </mesh>
      {outline && (
        <mesh scale={1.08}>
          {geo}
          <meshBasicMaterial color={INK} side={THREE.BackSide} />
        </mesh>
      )}
    </group>
  );
}

// Flat unlit-ish detail piece (eyes, stripes, studs...)
function Dot({
  color,
  position,
  scale = [1, 1, 1],
  r = 1,
  rotation = [0, 0, 0],
}: {
  color: string;
  position: V3;
  scale?: V3;
  r?: number;
  rotation?: V3;
}) {
  return (
    <mesh position={position} scale={scale} rotation={rotation}>
      <sphereGeometry args={[r, 14, 10]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
}

function Slab({
  color,
  size,
  position,
  rotation = [0, 0, 0],
  basic = false,
}: {
  color: string;
  size: V3;
  position: V3;
  rotation?: V3;
  basic?: boolean;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={size} />
      {basic ? (
        <meshBasicMaterial color={color} />
      ) : (
        <meshStandardMaterial color={color} roughness={0.8} />
      )}
    </mesh>
  );
}

function Limb({
  a,
  b,
  r0,
  r1,
  color,
}: {
  a: V3;
  b: V3;
  r0: number;
  r1: number;
  color: string;
}) {
  const A = new THREE.Vector3(...a);
  const B = new THREE.Vector3(...b);
  const dir = B.clone().sub(A);
  const len = dir.length();
  const q = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.normalize(),
  );
  const mid = A.add(B).multiplyScalar(0.5).toArray() as V3;
  return (
    <group position={mid} quaternion={q}>
      <Part geo={<cylinderGeometry args={[r1, r0, len, 12]} />} color={color} />
    </group>
  );
}

function polyGeo(points: [number, number][], depth: number) {
  const s = new THREE.Shape();
  points.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false });
  g.translate(0, 0, -depth / 2);
  return g;
}

type Motion = { moving: boolean; dir: number };

/* ------------------------------------------------------------------ */
/*  Young scribe (the player)                                          */
/* ------------------------------------------------------------------ */

const SKIN_BOY = "#8b5236";
const TEAL = "#1f9a8a";
const TURQ = "#35bfc9";

export function Scribe({ motion }: { motion: MutableRefObject<Motion> }) {
  const body = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const phase = useRef(0);

  useFrame((state, dt) => {
    const m = motion.current;
    const b = body.current;
    if (!b || !legL.current || !legR.current) return;
    if (m.moving) phase.current += dt * 9;
    const swing = m.moving ? Math.sin(phase.current) * 0.6 : 0;
    const D = THREE.MathUtils.damp;
    legL.current.rotation.x = D(legL.current.rotation.x, swing, 18, dt);
    legR.current.rotation.x = D(legR.current.rotation.x, -swing, 18, dt);
    b.rotation.y = D(b.rotation.y, m.dir * 0.6, 8, dt);
    b.rotation.z = D(b.rotation.z, m.moving ? swing * 0.04 : 0, 10, dt);
    b.position.y = m.moving
      ? Math.abs(Math.sin(phase.current)) * 0.05
      : Math.sin(state.clock.elapsedTime * 1.6) * 0.008;
  });

  const studs = (n: number, radius: number, y: number, from: number, to: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = from + ((to - from) * i) / Math.max(1, n - 1);
      return (
        <Dot
          key={i}
          color="#f4f1e6"
          r={0.017}
          position={[Math.sin(a) * radius, y, Math.cos(a) * radius]}
        />
      );
    });

  const curls = useMemo(() => {
    const out: { p: V3; r: number }[] = [];
    const rings: [number, number][] = [
      [0.3, 1],
      [0.75, 7],
      [1.15, 11],
    ];
    for (const [phi, n] of rings) {
      for (let i = 0; i < n; i++) {
        const az = (i / n) * Math.PI * 2 + phi;
        const R = 0.37;
        out.push({
          p: [
            R * Math.sin(phi) * Math.sin(az),
            R * Math.cos(phi),
            R * Math.sin(phi) * Math.cos(az),
          ],
          r: 0.085,
        });
      }
    }
    return out;
  }, []);

  return (
    <group scale={0.88}>
      <ContactShadow w={1.3} d={0.9} opacity={0.5} />
      <group ref={body}>
        {/* legs (swing from the hip) */}
        {[
          { ref: legL, x: -0.12 },
          { ref: legR, x: 0.12 },
        ].map(({ ref, x }) => (
          <group key={x} ref={ref} position={[x, 0.6, 0]}>
            <Part
              geo={<cylinderGeometry args={[0.072, 0.062, 0.54, 12]} />}
              color={SKIN_BOY}
              position={[0, -0.27, 0]}
            />
            <Part
              geo={<sphereGeometry args={[0.085, 14, 10]} />}
              color="#7a4a30"
              position={[0, -0.55, 0.05]}
              scale={[1, 0.6, 1.5]}
            />
          </group>
        ))}

        {/* shorts with studded hem */}
        <Part
          geo={<cylinderGeometry args={[0.2, 0.245, 0.42, 20]} />}
          color={TEAL}
          position={[0, 0.74, 0]}
        />
        {studs(18, 0.26, 0.55, 0, Math.PI * 2 - 0.3)}

        {/* turquoise tee + gold/white sash */}
        <Part
          geo={<boxGeometry args={[0.4, 0.52, 0.26]} />}
          color={TURQ}
          position={[0, 1.12, 0]}
        />
        <Slab color="#e9c43d" size={[0.03, 0.46, 0.012]} position={[-0.06, 1.12, 0.134]} rotation={[0, 0, -0.62]} />
        <Slab color="#eef2f2" size={[0.032, 0.46, 0.012]} position={[-0.015, 1.12, 0.134]} rotation={[0, 0, -0.62]} />
        <Slab color="#e9c43d" size={[0.03, 0.46, 0.012]} position={[0.03, 1.12, 0.134]} rotation={[0, 0, -0.62]} />
        <Slab color="#e9c43d" size={[0.2, 0.025, 0.012]} position={[0, 1.37, 0.134]} />

        {/* open teal jacket: two studded panels + collar */}
        {[-1, 1].map((s) => (
          <group key={s}>
            <Part
              geo={<boxGeometry args={[0.13, 0.54, 0.31]} />}
              color={TEAL}
              position={[s * 0.265, 1.11, 0]}
            />
            {Array.from({ length: 7 }, (_, i) => (
              <Dot
                key={i}
                color="#f4f1e6"
                r={0.016}
                position={[s * 0.2, 0.9 + i * 0.075, 0.158]}
              />
            ))}
            <Slab color={TEAL} size={[0.15, 0.1, 0.03]} position={[s * 0.15, 1.42, 0.12]} rotation={[0, 0, -s * 0.55]} />
            <Dot color="#f4f1e6" r={0.015} position={[s * 0.2, 1.46, 0.148]} />
            <Dot color="#f4f1e6" r={0.015} position={[s * 0.115, 1.395, 0.148]} />
          </group>
        ))}

        {/* arms: sleeve -> forearm -> hand holding the staff */}
        {[-1, 1].map((s) => (
          <group key={s}>
            <Limb a={[s * 0.34, 1.3, -0.02]} b={[s * 0.56, 1.2, -0.06]} r0={0.09} r1={0.085} color={TEAL} />
            <Limb a={[s * 0.56, 1.2, -0.06]} b={[s * 0.66, 1.44, -0.1]} r0={0.058} r1={0.052} color={SKIN_BOY} />
            <Part geo={<sphereGeometry args={[0.066, 14, 10]} />} color={SKIN_BOY} position={[s * 0.67, 1.48, -0.1]} />
            <Dot color="#f4f1e6" r={0.016} position={[s * 0.6, 1.16, 0.015]} />
            <Dot color="#f4f1e6" r={0.016} position={[s * 0.55, 1.14, 0.02]} />
          </group>
        ))}
        {/* the staff across the shoulders */}
        <Part
          geo={<cylinderGeometry args={[0.032, 0.032, 1.95, 10]} />}
          color="#c98c4e"
          position={[0, 1.5, -0.12]}
          rotation={[0, 0, Math.PI / 2 + 0.03]}
          rough={0.7}
        />

        {/* neck */}
        <Part
          geo={<cylinderGeometry args={[0.09, 0.1, 0.16, 12]} />}
          color={SKIN_BOY}
          position={[0, 1.48, 0]}
        />

        {/* head */}
        <group position={[0, 1.8, 0]}>
          <Part geo={<sphereGeometry args={[0.34, 32, 24]} />} color={SKIN_BOY} scale={[1, 1.05, 0.95]} />
          {[-1, 1].map((s) => (
            <Part
              key={s}
              geo={<sphereGeometry args={[0.07, 12, 10]} />}
              color={SKIN_BOY}
              position={[s * 0.335, -0.02, 0]}
              scale={[0.6, 1, 0.8]}
            />
          ))}

          {/* hair: cap tipped back so the forehead shows, plus curls */}
          <group rotation={[-0.3, 0, 0]} position={[0, 0.012, 0]}>
            <Part
              geo={<sphereGeometry args={[0.375, 32, 20, 0, Math.PI * 2, 0, 1.45]} />}
              color="#16100c"
              outline={false}
              rough={0.95}
            />
            {curls.map((c, i) => (
              <Dot key={i} color="#16100c" r={c.r} position={c.p} />
            ))}
          </group>

          {/* eyes */}
          {[-1, 1].map((s) => (
            <group key={s}>
              <Dot color="#fbf8f2" r={0.072} position={[s * 0.12, 0.0, 0.287]} scale={[1, 1.12, 0.45]} />
              <Dot color="#4a2815" r={0.046} position={[s * 0.12, -0.002, 0.307]} scale={[1, 1.1, 0.4]} />
              <Dot color="#0c0705" r={0.026} position={[s * 0.12, -0.002, 0.316]} scale={[1, 1.1, 0.4]} />
              <Dot color="#ffffff" r={0.011} position={[s * 0.12 + 0.014, 0.016, 0.324]} />
              <Slab color={INK} size={[0.115, 0.022, 0.02]} position={[s * 0.12, 0.085, 0.28]} rotation={[0, 0, s * 0.1]} basic />
            </group>
          ))}
          {/* nose + smile */}
          <Dot color="#7c4a30" r={0.036} position={[0, -0.055, 0.31]} />
          <mesh position={[0.012, -0.115, 0.29]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.07, 0.009, 6, 18, Math.PI]} />
            <meshBasicMaterial color="#3a1c10" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Zeway, the stone carver (fictional)                                */
/* ------------------------------------------------------------------ */

const SKIN_ZEWAY = "#8a5230";
const ROBE = "#c98b2c";

export function Zeway({ x, z }: { x: number; z: number }) {
  const body = useRef<THREE.Group>(null);
  const mallet = useRef<THREE.Group>(null);
  const pupils = useRef<THREE.Group>(null);

  const collar = useMemo(
    () => ({
      top: polyGeo(
        [
          [-0.54, -0.02],
          [-0.13, 0.08],
          [0.13, 0.08],
          [0.54, -0.02],
          [0, -0.25],
        ],
        0.05,
      ),
      v: polyGeo(
        [
          [-0.43, -0.06],
          [0, -0.66],
          [0.43, -0.06],
          [0, -0.27],
        ],
        0.05,
      ),
    }),
    [],
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const dx = (state.scene.getObjectByName("scribe")?.position.x ?? x) - x;
    const b = body.current;
    if (b) {
      b.rotation.y = THREE.MathUtils.damp(
        b.rotation.y,
        THREE.MathUtils.clamp(dx * 0.12, -0.6, 0.6),
        4,
        dt,
      );
      b.position.y = Math.sin(t * 1.4) * 0.01;
    }
    if (mallet.current) {
      // an occasional tap of the mallet while he works
      const pulse = Math.pow(Math.max(0, Math.sin(t * 2.2)), 3);
      mallet.current.rotation.x = -0.45 - pulse * 0.55;
    }
    if (pupils.current) {
      pupils.current.position.x = THREE.MathUtils.damp(
        pupils.current.position.x,
        THREE.MathUtils.clamp(dx * 0.006, -0.02, 0.02),
        6,
        dt,
      );
    }
  });

  const H = 2.15; // head centre height
  const hem = ["#2e8b3e", "#f2c94c", "#c8332b"];

  return (
    <group position={[x, 0, z]} scale={0.82}>
      <ContactShadow w={1.6} d={1.1} opacity={0.5} />
      <group ref={body}>
        {/* long robe with a woven tricolour hem */}
        <Part
          geo={<cylinderGeometry args={[0.28, 0.45, 1.2, 24]} />}
          color={ROBE}
          position={[0, 0.6, 0]}
        />
        {Array.from({ length: 20 }, (_, i) => {
          const a = (i / 20) * Math.PI * 2;
          return (
            <group key={i} position={[Math.sin(a) * 0.453, 0.1, Math.cos(a) * 0.453]} rotation={[0, a, 0]}>
              <Slab color={hem[i % 3]} size={[0.1, 0.1, 0.02]} position={[0, 0, 0]} />
            </group>
          );
        })}
        <Part
          geo={<cylinderGeometry args={[0.31, 0.31, 0.1, 22]} />}
          color="#7a2a1f"
          position={[0, 0.82, 0]}
        />

        {/* chest */}
        <Part
          geo={<cylinderGeometry args={[0.22, 0.27, 0.42, 20]} />}
          color="#d8a03e"
          position={[0, 1.38, 0]}
        />

        {/* angular collar: blue V under, indigo shoulder plate over */}
        <mesh geometry={collar.v} position={[0, 1.58, 0.24]}>
          <meshStandardMaterial color="#1f6fb8" roughness={0.7} />
        </mesh>
        <mesh geometry={collar.top} position={[0, 1.58, 0.27]}>
          <meshStandardMaterial color="#2c2f8e" roughness={0.7} />
        </mesh>
        <Slab color="#f4d03f" size={[0.58, 0.022, 0.012]} position={[-0.215, 1.255, 0.272]} rotation={[0, 0, -0.923]} basic />
        <Slab color="#f4d03f" size={[0.58, 0.022, 0.012]} position={[0.215, 1.255, 0.272]} rotation={[0, 0, 0.923]} basic />
        <Slab color="#f4d03f" size={[0.016, 0.1, 0.012]} position={[-0.045, 1.56, 0.298]} basic />
        <Slab color="#f4d03f" size={[0.016, 0.1, 0.012]} position={[0.045, 1.56, 0.298]} basic />

        {/* arm holding the mallet (pivots at the shoulder) */}
        <group ref={mallet} position={[-0.42, 1.46, 0.02]}>
          <Limb a={[0, 0, 0]} b={[-0.06, -0.5, 0.06]} r0={0.078} r1={0.07} color={ROBE} />
          <Part geo={<sphereGeometry args={[0.07, 14, 10]} />} color={SKIN_ZEWAY} position={[-0.065, -0.54, 0.065]} />
          <group position={[-0.065, -0.54, 0.065]} rotation={[0.7, 0, 0.15]}>
            <Part geo={<cylinderGeometry args={[0.024, 0.024, 0.44, 8]} />} color="#6b4a2b" position={[0, 0.1, 0]} />
            <Part geo={<boxGeometry args={[0.22, 0.12, 0.12]} />} color="#857d71" position={[0, 0.34, 0]} />
          </group>
        </group>

        {/* arm holding the chisel */}
        <group position={[0.42, 1.46, 0.02]} rotation={[-0.7, 0, 0]}>
          <Limb a={[0, 0, 0]} b={[0.06, -0.5, 0.06]} r0={0.078} r1={0.07} color={ROBE} />
          <Part geo={<sphereGeometry args={[0.07, 14, 10]} />} color={SKIN_ZEWAY} position={[0.065, -0.54, 0.065]} />
          <group position={[0.065, -0.54, 0.065]} rotation={[0.5, 0, -0.1]}>
            <Part geo={<cylinderGeometry args={[0.018, 0.018, 0.34, 8]} />} color="#a4adb2" position={[0, 0.12, 0]} outline={false} />
            <Part geo={<coneGeometry args={[0.02, 0.07, 8]} />} color="#6f787d" position={[0, -0.08, 0]} rotation={[Math.PI, 0, 0]} outline={false} />
          </group>
        </group>

        {/* long neck */}
        <Part
          geo={<cylinderGeometry args={[0.082, 0.092, 0.5, 14]} />}
          color={SKIN_ZEWAY}
          position={[0, 1.78, 0]}
        />

        {/* big round afro, set behind the face so the face frames out of it */}
        <Part
          geo={<sphereGeometry args={[0.52, 32, 24]} />}
          color="#14100c"
          position={[0, H + 0.16, -0.26]}
          scale={[1, 0.95, 1]}
          outline={false}
          rough={0.95}
        />

        {/* elongated face */}
        <Part
          geo={<sphereGeometry args={[0.27, 32, 24]} />}
          color={SKIN_ZEWAY}
          position={[0, H, 0.1]}
          scale={[1, 1.33, 0.96]}
        />

        {/* forehead mark */}
        <mesh position={[0, H + 0.225, 0.312]}>
          <torusGeometry args={[0.02, 0.0065, 6, 14]} />
          <meshBasicMaterial color={INK} />
        </mesh>
        <Slab color={INK} size={[0.012, 0.075, 0.012]} position={[0, H + 0.165, 0.31]} basic />
        <Slab color={INK} size={[0.056, 0.013, 0.012]} position={[0, H + 0.178, 0.31]} basic />

        {/* brows + almond eyes */}
        {[-1, 1].map((s) => (
          <group key={s}>
            <Slab color={INK} size={[0.15, 0.026, 0.02]} position={[s * 0.1, H + 0.145, 0.305]} rotation={[0, 0, -s * 0.14]} basic />
            <Dot color="#fbf8f2" r={0.062} position={[s * 0.1, H + 0.06, 0.324]} scale={[1.5, 0.78, 0.5]} />
            <Slab color={INK} size={[0.17, 0.02, 0.02]} position={[s * 0.1, H + 0.093, 0.333]} rotation={[0, 0, s * 0.07]} basic />
          </group>
        ))}
        <group ref={pupils}>
          {[-1, 1].map((s) => (
            <group key={s}>
              <Dot color="#3b2415" r={0.036} position={[s * 0.1, H + 0.058, 0.348]} scale={[1, 1.1, 0.4]} />
              <Dot color="#0a0604" r={0.02} position={[s * 0.1, H + 0.058, 0.358]} scale={[1, 1.1, 0.4]} />
              <Dot color="#ffffff" r={0.008} position={[s * 0.1 + 0.012, H + 0.072, 0.364]} />
            </group>
          ))}
        </group>

        {/* long nose and lips */}
        <mesh position={[0, H - 0.05, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.036, 0.085, 8]} />
          <meshStandardMaterial color="#774526" roughness={0.7} />
        </mesh>
        <Dot color="#a8342d" r={0.05} position={[0, H - 0.17, 0.32]} scale={[1, 0.38, 0.45]} />
      </group>
    </group>
  );
}
