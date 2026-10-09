"use client";

/* eslint-disable react/no-unescaped-entities */

import { useEffect, useRef, useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { explorations } from "@/lib/data";
import { actions } from "@/lib/store";

// Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the live map.
const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

type GMaps = {
  maps: {
    Map: new (el: HTMLElement, o: object) => unknown;
    Marker: new (o: object) => { addListener: (ev: string, fn: () => void) => void };
    InfoWindow: new (o: object) => { open: (o: object) => void };
  };
};

let loader: Promise<GMaps> | null = null;
function loadMaps(key: string): Promise<GMaps> {
  const w = window as unknown as { google?: GMaps };
  if (w.google?.maps) return Promise.resolve(w.google);
  if (!loader) {
    loader = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}`;
      s.async = true;
      s.onload = () => res((window as unknown as { google: GMaps }).google);
      s.onerror = () => {
        loader = null;
        rej(new Error("Google Maps failed to load"));
      };
      document.head.appendChild(s);
    });
  }
  return loader;
}

const pin = (color: string, size: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 40 40"><polygon points="20,2 24,16 38,20 24,24 20,38 16,24 2,20 16,16" fill="${color}" stroke="#0f2a20" stroke-width="2"/></svg>`,
  )}`;

export function GoogleMapExplorer({ latitude, longitude, name, zoom = 11, currentId }: { latitude: number; longitude: number; name: string; zoom?: number; currentId?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "error" | "nokey">(KEY ? "idle" : "nokey");
  const nearby = explorations.filter(
    (e) => e.id !== currentId && e.latitude != null && Math.hypot(e.latitude - latitude, (e.longitude ?? 0) - longitude) < 4,
  );
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  useEffect(() => {
    if (!KEY || !ref.current) return;
    let cancelled = false;
    loadMaps(KEY)
      .then((g) => {
        if (cancelled || !ref.current) return;
        const map = new g.maps.Map(ref.current, {
          center: { lat: latitude, lng: longitude },
          zoom,
          mapTypeId: "terrain",
          disableDefaultUI: false,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#16302a" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#e9d9a6" }] },
            { featureType: "water", stylers: [{ color: "#0d2420" }] },
          ],
        });
        const m = new g.maps.Marker({ position: { lat: latitude, lng: longitude }, map, title: name, icon: pin("#e6b84a", 44) });
        const info = new g.maps.InfoWindow({ content: `<strong>${name}</strong>` });
        m.addListener("click", () => info.open({ map, anchor: m }));
        nearby.forEach((n) => {
          const nm = new g.maps.Marker({ position: { lat: n.latitude, lng: n.longitude }, map, title: n.title, icon: pin("#3fbf8a", 26) });
          nm.addListener("click", () => (window.location.href = `/explore/${n.id}`));
        });
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude, zoom, name]);

  return (
    <div className="panel corners overflow-hidden rounded-sm">
      <div className="relative h-80 w-full bg-emerald-deep md:h-96">
        <div ref={ref} className="absolute inset-0" />
        {status !== "ready" && (
          <div className="pattern-geez absolute inset-0 grid place-items-center p-6 text-center">
            {status === "nokey" ? (
              <div className="max-w-sm">
                <MapPin className="mx-auto h-8 w-8 text-gold" />
                <p className="mt-3 font-display tracking-widest text-gold">MAP AWAITING ITS KEY</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  The live Google Map appears here once a Google Maps key is added. You can still open this place in Google Maps below.
                </p>
              </div>
            ) : status === "error" ? (
              <p className="text-sm text-muted-foreground">The map couldn't load right now. Try opening it in Google Maps.</p>
            ) : (
              <p className="animate-pulse font-display tracking-widest text-gold">UNFOLDING THE MAP…</p>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3 border-t border-border p-4 text-sm">
        <MapPin className="h-4 w-4 text-gold" />
        <span className="font-semibold text-foreground">{name}</span>
        <span className="text-muted-foreground">{latitude.toFixed(4)}°, {longitude.toFixed(4)}°</span>
        <a href={gmapsUrl} target="_blank" rel="noreferrer" onClick={() => actions.openedMap()} className="ml-auto inline-flex items-center gap-1 font-semibold text-gold hover:underline">
          Open in Google Maps <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      {nearby.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3 text-xs">
          <span className="text-muted-foreground">Nearby:</span>
          {nearby.map((n) => (
            <a key={n.id} href={`/explore/${n.id}`} className="rounded-sm border border-emerald/60 px-2 py-0.5 text-emerald-glow hover:bg-emerald/20">
              {n.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
