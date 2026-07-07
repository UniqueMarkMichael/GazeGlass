"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type GlassRealm =
  | "threshold"
  | "mortal"
  | "god"
  | "spirit"
  | "seer"
  | "codex"
  | "observation"
  | "court";

const HOME_REALM_SECTIONS: Array<{ id: string; realm: GlassRealm }> = [
  { id: "featured-gods", realm: "god" },
  { id: "the-spirits", realm: "spirit" },
  { id: "the-mortals", realm: "mortal" },
  { id: "glass-opens", realm: "threshold" },
  { id: "the-seer", realm: "seer" },
  { id: "behind-the-glass", realm: "seer" },
  { id: "gaze-into-glass", realm: "threshold" },
  { id: "home", realm: "threshold" },
];

function getRealmFromPath(pathname: string): GlassRealm {
  if (pathname.startsWith("/a-court-of-foxes")) return "court";
  if (pathname.startsWith("/celestial-codex")) return "codex";
  if (pathname.startsWith("/the-gods")) return "god";
  if (pathname.startsWith("/the-spirits")) return "spirit";
  if (pathname.startsWith("/the-seer")) return "seer";
  if (pathname.startsWith("/the-mortals")) return "mortal";
  if (pathname.startsWith("/the-glass-names-you")) return "threshold";
  if (pathname.startsWith("/observations/marcella")) return "mortal";
  if (pathname.startsWith("/observations")) return "observation";
  return "threshold";
}

function getHomeRealm() {
  const targetLine = window.innerHeight * 0.46;
  let best: { distance: number; realm: GlassRealm } | null = null;

  for (const section of HOME_REALM_SECTIONS) {
    const element = document.getElementById(section.id);
    if (!element) continue;

    const rect = element.getBoundingClientRect();
    if (rect.bottom < 96 || rect.top > window.innerHeight * 0.86) continue;

    const center = rect.top + rect.height * 0.28;
    const distance = Math.abs(center - targetLine);
    if (!best || distance < best.distance) {
      best = { distance, realm: section.realm };
    }
  }

  return best?.realm ?? "threshold";
}

export function RealmAtmosphere() {
  const pathname = usePathname();
  const [realm, setRealm] = useState<GlassRealm>(() => getRealmFromPath(pathname));
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (pathname === "/press") return;

    const root = document.documentElement;
    root.dataset.glassRealm = realm;

    return () => {
      if (root.dataset.glassRealm === realm) {
        delete root.dataset.glassRealm;
      }
    };
  }, [pathname, realm]);

  useEffect(() => {
    if (pathname !== "/") {
      setRealm(getRealmFromPath(pathname));
      return;
    }

    function updateRealm() {
      frameRef.current = null;
      setRealm((currentRealm) => {
        const nextRealm = getHomeRealm();
        return nextRealm === currentRealm ? currentRealm : nextRealm;
      });
    }

    function scheduleUpdate() {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(updateRealm);
    }

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/press") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const root = document.documentElement;
    let pointerFrame: number | null = null;
    let nextX = 50;
    let nextY = 34;

    function commitPointer() {
      pointerFrame = null;
      root.style.setProperty("--realm-pointer-x", `${Math.round(nextX)}%`);
      root.style.setProperty("--realm-pointer-y", `${Math.round(nextY)}%`);
    }

    function schedulePointer(event: PointerEvent) {
      if (event.pointerType === "touch") return;

      nextX = Math.max(0, Math.min(100, (event.clientX / window.innerWidth) * 100));
      nextY = Math.max(0, Math.min(100, (event.clientY / window.innerHeight) * 100));

      if (pointerFrame !== null) return;
      pointerFrame = window.requestAnimationFrame(commitPointer);
    }

    window.addEventListener("pointermove", schedulePointer, { passive: true });

    return () => {
      if (pointerFrame !== null) {
        window.cancelAnimationFrame(pointerFrame);
      }

      window.removeEventListener("pointermove", schedulePointer);
      root.style.removeProperty("--realm-pointer-x");
      root.style.removeProperty("--realm-pointer-y");
    };
  }, [pathname]);

  if (pathname === "/press") {
    return null;
  }

  return (
    <div className={`realm-atmosphere is-${realm}`} aria-hidden="true">
      <span className="realm-atmosphere-field" />
      <span className="realm-atmosphere-mark" />
      <span className="realm-atmosphere-trace" />
    </div>
  );
}
