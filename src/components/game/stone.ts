import * as THREE from "three";

// Procedural weathered-granite textures (tileable), generated once on the client.
// No image files needed: colour map + matching bump map.

const S = 256;

function hash(ix: number, iy: number, seed: number) {
  let h =
    Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

const wrap = (v: number, p: number) => ((v % p) + p) % p;

function vnoise(x: number, y: number, px: number, py: number, seed: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash(wrap(x0, px), wrap(y0, py), seed);
  const b = hash(wrap(x0 + 1, px), wrap(y0, py), seed);
  const c = hash(wrap(x0, px), wrap(y0 + 1, py), seed);
  const d = hash(wrap(x0 + 1, px), wrap(y0 + 1, py), seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

function fbm(u: number, v: number, seed: number) {
  let sum = 0;
  let amp = 1;
  let norm = 0;
  let f = 4;
  for (let o = 0; o < 4; o++) {
    sum += amp * vnoise(u * f, v * f, f, f, seed + o);
    norm += amp;
    amp *= 0.5;
    f *= 2;
  }
  return sum / norm;
}

let base: { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } | null = null;
const variants = new Map<string, { map: THREE.Texture; bump: THREE.Texture }>();

function build() {
  const col = document.createElement("canvas");
  const bmp = document.createElement("canvas");
  col.width = col.height = bmp.width = bmp.height = S;
  const cg = col.getContext("2d")!;
  const bg = bmp.getContext("2d")!;
  const ci = cg.createImageData(S, S);
  const bi = bg.createImageData(S, S);

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const u = x / S;
      const v = y / S;
      const n = fbm(u, v, 3);
      const fine = hash(x, y, 99);
      // vertical rain streaks (stretched noise)
      const streak = vnoise(u * 24, v * 3, 24, 3, 11);
      // dark lichen / mineral blotches
      const l = fbm(u, v, 40);
      const lichen = Math.max(0, l - 0.6) * 3.2;

      let r = 150 + (n - 0.5) * 78 + (fine - 0.5) * 34 - streak * 20;
      let g = 139 + (n - 0.5) * 72 + (fine - 0.5) * 32 - streak * 20;
      let b = 120 + (n - 0.5) * 62 + (fine - 0.5) * 30 - streak * 17;
      r += (104 - r) * lichen * 0.6;
      g += (108 - g) * lichen * 0.6;
      b += (86 - b) * lichen * 0.6;

      const i = (y * S + x) * 4;
      ci.data[i] = r;
      ci.data[i + 1] = g;
      ci.data[i + 2] = b;
      ci.data[i + 3] = 255;

      const h = 128 + (n - 0.5) * 170 + (fine - 0.5) * 70;
      bi.data[i] = bi.data[i + 1] = bi.data[i + 2] = h;
      bi.data[i + 3] = 255;
    }
  }
  cg.putImageData(ci, 0, 0);
  bg.putImageData(bi, 0, 0);

  const map = new THREE.CanvasTexture(col);
  map.colorSpace = THREE.SRGBColorSpace;
  const bump = new THREE.CanvasTexture(bmp);
  for (const t of [map, bump]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
  }
  return { map, bump };
}

/** Granite maps repeated `rx` x `ry` times across a surface's 0..1 UVs. */
export function stoneMaps(rx: number, ry: number) {
  const key = `${rx.toFixed(3)}|${ry.toFixed(3)}`;
  const hit = variants.get(key);
  if (hit) return hit;
  if (!base) base = build();
  const map = base.map.clone();
  const bump = base.bump.clone();
  map.repeat.set(rx, ry);
  bump.repeat.set(rx, ry);
  map.needsUpdate = true;
  bump.needsUpdate = true;
  const made = { map, bump };
  variants.set(key, made);
  return made;
}
