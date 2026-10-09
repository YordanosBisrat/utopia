"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { ContactShadow } from "./ContactShadow";
import { stoneMaps } from "./stone";

// Aksumite stelae, modelled on the real monuments:
//  - a tall, slightly tapering granite slab with a rounded (arched) top
//  - the great ones are carved as multi-storey buildings: a false door at the
//    foot, rows of false windows, projecting beam-ends ("rope courses") and a
//    thin vertical groove down the middle
//  - the king's stele stands on a wide stepped platform, flanked by small
//    rounded stones

const TAPER = 0.22; // how much the slab thins in depth from base to tip
const BEVEL = 0.025;
export const PLATFORM_H = 0.36;

function bodyGeometry(h: number, wb: number, wt: number, d: number) {
  const r = wt / 2;
  const s = new THREE.Shape();
  s.moveTo(-wb / 2, 0);
  s.lineTo(wb / 2, 0);
  s.lineTo(wt / 2, h - r);
  s.absarc(0, h - r, r, 0, Math.PI, false);
  s.lineTo(-wb / 2, 0);

  const g = new THREE.ExtrudeGeometry(s, {
    depth: d,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 2,
    curveSegments: 20,
  });
  g.translate(0, 0, -d / 2);

  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const t = THREE.MathUtils.clamp(pos.getY(i) / h, 0, 1);
    pos.setZ(i, pos.getZ(i) * (1 - TAPER * t));
  }
  g.computeVertexNormals();
  return g;
}

function carvingGeometries(
  h: number,
  wb: number,
  wt: number,
  d: number,
  storeys: number,
) {
  const dark: THREE.BufferGeometry[] = [];
  const light: THREE.BufferGeometry[] = [];
  const k = wb / 0.9; // detail scale relative to a 0.9m-wide slab

  const w = (y: number) => wb - (wb - wt) * (y / h);
  const fz = (y: number) => (d / 2) * (1 - TAPER * (y / h)) + BEVEL;

  const box = (
    arr: THREE.BufferGeometry[],
    bw: number,
    bh: number,
    bd: number,
    x: number,
    y: number,
    z: number,
    rz = 0,
  ) => {
    const g = new THREE.BoxGeometry(bw, bh, bd);
    if (rz) g.rotateZ(rz);
    g.translate(x, y, z);
    arr.push(g);
  };

  const y0 = 1.05 * k;
  const top = h - wt / 2 - 0.4 * k;
  const sh = (top - y0) / storeys;

  // central vertical groove
  box(dark, 0.014 * k, top - y0 + 0.1, 0.03, 0, (top + y0) / 2, fz(h / 2) + 0.004);

  for (let i = 0; i <= storeys; i++) {
    const yb = y0 + i * sh;
    // horizontal course between storeys
    box(light, w(yb) * 0.99, 0.03, 0.06, 0, yb, fz(yb) + 0.012);
    if (i === storeys) break;

    const yc = yb + sh * 0.56;
    const wk = w(yc) / wb;
    const ww = 0.07 * k * wk;
    const wh = sh * 0.4;

    for (const s of [-1, 1]) {
      // two false windows each side of the groove
      for (let j = 0; j < 2; j++) {
        const x = s * w(yc) * (0.17 + 0.16 * j);
        const z = fz(yc);
        box(dark, ww, wh, 0.02, x, yc, z + 0.008);
        box(light, ww + 0.04 * k, 0.022, 0.05, x, yc + wh / 2 + 0.01, z + 0.02); // lintel
        box(light, ww + 0.04 * k, 0.022, 0.05, x, yc - wh / 2 - 0.01, z + 0.02); // sill
        for (const e of [-1, 1]) {
          box(light, 0.014 * k, wh, 0.04, x + e * (ww / 2 + 0.007 * k), yc, z + 0.015);
        }
      }
      // beam-ends: the round log heads that stick out of every storey
      for (let n = 0; n < 4; n++) {
        const x = s * w(yb) * (0.09 + 0.085 * n);
        const g = new THREE.CylinderGeometry(0.028 * k, 0.028 * k, 0.09, 8);
        g.rotateX(Math.PI / 2);
        g.translate(x, yb + sh * 0.16, fz(yb) + 0.04);
        light.push(g);
      }
    }
  }

  // false door at the foot: lintel, frame, leaves, locks
  const dz = fz(0.5);
  box(light, 0.34 * k, 0.06, 0.07, 0, 0.88 * k, dz + 0.02);
  box(light, 0.3 * k, 0.72 * k, 0.045, 0, 0.45 * k, dz + 0.012);
  box(dark, 0.22 * k, 0.64 * k, 0.05, 0, 0.42 * k, dz + 0.018);
  box(light, 0.012 * k, 0.64 * k, 0.06, 0, 0.42 * k, dz + 0.024);
  for (const s of [-1, 1]) {
    const g = new THREE.CylinderGeometry(0.024 * k, 0.024 * k, 0.05, 10);
    g.rotateX(Math.PI / 2);
    g.translate(s * 0.045 * k, 0.4 * k, dz + 0.05);
    light.push(g);
  }

  // arched top: a thin carved rim and the slot of the original
  const rA = (wt / 2) * 0.62;
  const arc = new THREE.TorusGeometry(rA, 0.012 * k, 6, 28, Math.PI);
  arc.translate(0, h - wt / 2, fz(h) + 0.006);
  dark.push(arc);
  box(dark, 0.022 * k, wt * 0.7, 0.02, 0, h - wt / 2 - wt * 0.2, fz(h) + 0.004);

  return {
    dark: mergeGeometries(dark),
    light: mergeGeometries(light),
  };
}

function Platform() {
  // wide steps leading up to the stele, like the stairway at the Great Stele
  const { map, bump } = useMemo(() => stoneMaps(2, 1), []);
  const slabs = [0, 1, 2].map((k) => {
    const hk = (k + 1) * 0.12;
    const front = 0.75 + (2 - k) * 0.42;
    const depth = front + 0.75;
    return { hk, depth, zc: (front - 0.75) / 2 };
  });
  const stones = [-1.35, -1.12, -0.92, 0.92, 1.12, 1.35];

  return (
    <group>
      {slabs.map((s, i) => (
        <mesh key={i} position={[0, s.hk / 2, s.zc]}>
          <boxGeometry args={[3.2, s.hk, s.depth]} />
          <meshStandardMaterial
            map={map}
            bumpMap={bump}
            bumpScale={1.5}
            color="#cfc6b2"
            roughness={1}
          />
        </mesh>
      ))}
      {/* the small rounded markers along the platform edge */}
      {stones.map((x, i) => (
        <mesh
          key={x}
          position={[x, PLATFORM_H + 0.13, -0.15 + (i % 2) * 0.3]}
          scale={[1, 1, 0.8]}
        >
          <capsuleGeometry args={[0.1 + (i % 3) * 0.015, 0.1 + (i % 2) * 0.06, 4, 10]} />
          <meshStandardMaterial
            map={map}
            bumpMap={bump}
            bumpScale={1.5}
            color="#d6cdb9"
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

export type SteleProps = {
  x: number;
  z?: number;
  height: number;
  carved?: boolean;
  storeys?: number;
  platform?: boolean;
  tilt?: number;
  fallen?: boolean;
  tint?: string;
};

export function Stele({
  x,
  z = -5,
  height: h,
  carved = false,
  storeys = 9,
  platform = false,
  tilt = 0,
  fallen = false,
  tint = "#d9d0bc",
}: SteleProps) {
  const dims = useMemo(() => {
    const wb = carved ? h / 7.2 : h * 0.13 + 0.1;
    const wt = wb * (carved ? 0.76 : 0.72);
    const d = wb * (carved ? 0.62 : 0.45);
    return { wb, wt, d };
  }, [h, carved]);

  const geo = useMemo(() => {
    const { wb, wt, d } = dims;
    return {
      body: bodyGeometry(h, wb, wt, d),
      ...(carved
        ? carvingGeometries(h, wb, wt, d, storeys)
        : { dark: null, light: null }),
    };
  }, [dims, h, carved, storeys]);

  const { map, bump } = useMemo(() => stoneMaps(1 / 1.6, 1 / 1.6), []);
  const baseY = platform ? PLATFORM_H : 0;

  const stone = (
    <meshStandardMaterial
      map={map}
      bumpMap={bump}
      bumpScale={2}
      color={tint}
      roughness={1}
    />
  );

  const slab = (
    <>
      <mesh geometry={geo.body}>{stone}</mesh>
      {geo.light && (
        <mesh geometry={geo.light}>
          <meshStandardMaterial
            map={map}
            bumpMap={bump}
            bumpScale={1}
            color="#e4dcc8"
            roughness={1}
          />
        </mesh>
      )}
      {geo.dark && (
        <mesh geometry={geo.dark}>
          <meshStandardMaterial color="#2b231a" roughness={1} />
        </mesh>
      )}
    </>
  );

  if (fallen) {
    // a broken length of a great stele, lying where it fell
    return (
      <group position={[x, dims.wb / 2 + 0.03, z]} rotation={[0, 0.1, -Math.PI / 2 + 0.03]}>
        {slab}
      </group>
    );
  }

  return (
    <group position={[x, 0, z]} rotation={[0, 0, tilt]}>
      {platform && <Platform />}
      <group position={[0, baseY, 0]}>{slab}</group>
      <ContactShadow
        w={dims.wb * 3.4}
        d={dims.d * 3.2}
        opacity={0.45}
        position={[0, baseY + 0.015, 0.05]}
      />
    </group>
  );
}
