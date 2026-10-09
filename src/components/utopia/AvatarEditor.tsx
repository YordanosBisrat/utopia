"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { actions, usePlayer } from "@/lib/store";
import { GhostButton, GoldButton } from "./ui";
import { Avatar } from "./Avatar";

const VIEW = 224; // on-screen crop circle (px)
const OUT = 256; // saved image size (px)

// Pick a photo, drag to reposition, zoom, save. Stored on this device only.
export function AvatarEditor() {
  const p = usePlayer();
  const fileRef = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 }); // image centre offset from circle centre
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  // size of the image at zoom 1 so that it just covers the circle
  const base = img ? Math.max(VIEW / img.width, VIEW / img.height) : 1;
  const scale = base * zoom;

  const clamp = (x: number, y: number, z = zoom) => {
    if (!img) return { x, y };
    const w = img.width * base * z;
    const h = img.height * base * z;
    const mx = Math.max(0, (w - VIEW) / 2);
    const my = Math.max(0, (h - VIEW) / 2);
    return { x: Math.min(mx, Math.max(-mx, x)), y: Math.min(my, Math.max(-my, y)) };
  };

  useEffect(() => {
    // keep the crop valid when zoom changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPos((q) => clamp(q.x, q.y));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, img]);

  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (f.size > 15 * 1024 * 1024) return toast.error("Image is too large (max 15 MB)");
    const url = URL.createObjectURL(f);
    const im = new Image();
    im.onload = () => {
      setImg(im);
      setZoom(1);
      setPos({ x: 0, y: 0 });
    };
    im.onerror = () => toast.error("Couldn't read that image");
    im.src = url;
  };

  const save = () => {
    if (!img) return;
    const c = document.createElement("canvas");
    c.width = c.height = OUT;
    const g = c.getContext("2d")!;
    const k = OUT / VIEW;
    const w = img.width * scale * k;
    const h = img.height * scale * k;
    g.fillStyle = "#0b1a14";
    g.fillRect(0, 0, OUT, OUT);
    g.drawImage(img, OUT / 2 + pos.x * k - w / 2, OUT / 2 + pos.y * k - h / 2, w, h);
    actions.setAvatar(c.toDataURL("image/jpeg", 0.88));
    toast.success("Profile picture saved");
    setImg(null);
  };

  const cancel = () => setImg(null);

  return (
    <section className="panel rounded-sm p-5">
      <div className="font-display text-sm tracking-widest text-gold">PROFILE PICTURE</div>

      {!img ? (
        <div className="mt-4 flex flex-wrap items-center gap-5">
          <Avatar name={p.name} src={p.avatar} className="h-24 w-24 border-2 text-2xl" />
          <div className="flex flex-wrap gap-3">
            <GoldButton onClick={() => fileRef.current?.click()}>
              <span className="inline-flex items-center gap-2">
                {p.avatar ? <Camera className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                {p.avatar ? "CHANGE PHOTO" : "UPLOAD PHOTO"}
              </span>
            </GoldButton>
            {p.avatar && (
              <GhostButton onClick={() => { actions.setAvatar(null); toast("Profile picture removed"); }}>
                <span className="inline-flex items-center gap-2">
                  <Trash2 className="h-4 w-4" /> REMOVE
                </span>
              </GhostButton>
            )}
          </div>
          <p className="w-full text-xs text-muted-foreground">
            Saved on this device only. Without a photo, your initials are shown.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div
            className="relative cursor-grab touch-none overflow-hidden rounded-full border-2 border-gold bg-background active:cursor-grabbing"
            style={{ width: VIEW, height: VIEW }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              if (!d) return;
              setPos(clamp(d.ox + e.clientX - d.sx, d.oy + e.clientY - d.sy));
            }}
            onPointerUp={() => (drag.current = null)}
            onPointerCancel={() => (drag.current = null)}
            onWheel={(e) => setZoom((z) => Math.min(3, Math.max(1, z - e.deltaY * 0.002)))}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt="Crop preview"
              draggable={false}
              className="pointer-events-none absolute max-w-none select-none"
              style={{
                width: img.width * scale,
                height: img.height * scale,
                left: VIEW / 2 + pos.x - (img.width * scale) / 2,
                top: VIEW / 2 + pos.y - (img.height * scale) / 2,
              }}
            />
          </div>

          <div className="flex w-full max-w-xs flex-col gap-4">
            <p className="text-sm text-muted-foreground">Drag to reposition. Use the slider or scroll to zoom.</p>
            <label className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>ZOOM</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-[#d4a017]"
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <GoldButton onClick={save}>SAVE PHOTO</GoldButton>
              <GhostButton onClick={() => fileRef.current?.click()}>CHOOSE ANOTHER</GhostButton>
              <GhostButton onClick={cancel}>CANCEL</GhostButton>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </section>
  );
}