"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  GLASS_SCROLL_OMEN_EVENT,
  GLASS_SCROLL_OMEN_KEY,
  type GlassScrollOmen,
} from "./glassSignals";

const SECTION_SELECTOR = "section[id], article[id], main > div[id], main > header[id]";
const OMEN_VISIBLE_MS = 3200;

function titleFromId(id: string) {
  return id
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getSectionLabel(section: HTMLElement) {
  const explicitLabel = section.getAttribute("aria-label");
  if (explicitLabel) return explicitLabel;

  const heading = section.querySelector("h1, h2, h3");
  const headingText = heading?.textContent?.replace(/\s+/g, " ").trim();
  if (headingText) return headingText;

  return titleFromId(section.id);
}

function getScrollProgress() {
  const scrollable = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  ) - window.innerHeight;

  if (scrollable <= 0) return 1;
  return Math.max(0, Math.min(1, window.scrollY / scrollable));
}

function findCurrentSection() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>(SECTION_SELECTOR));
  const targetLine = window.innerHeight * 0.42;
  let best: { distance: number; section: HTMLElement } | null = null;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.bottom < 80 || rect.top > window.innerHeight * 0.86) continue;

    const distance = Math.abs(rect.top - targetLine);
    if (!best || distance < best.distance) {
      best = { distance, section };
    }
  }

  return best?.section ?? null;
}

function getOmenMessage(pathname: string, label: string, progress: number) {
  if (pathname.startsWith("/a-court-of-foxes")) {
    return "A sentence glints under the page, then waits for you to keep reading.";
  }

  if (pathname.startsWith("/observations")) {
    return "The record brightens around a witnessed life.";
  }

  if (pathname === "/the-gods") {
    return "A divine pressure moves behind the glass.";
  }

  if (pathname === "/the-spirits") {
    return "A fox-shadow crosses the surface and remembers your path.";
  }

  if (pathname === "/the-glass-names-you") {
    return "The Sorting Glass listens for the shape beneath the answer.";
  }

  if (pathname === "/celestial-codex") {
    return "One law catches the light and becomes difficult to ignore.";
  }

  if (progress > 0.72) {
    return `${label} leaves a final reflection in the glass.`;
  }

  return `${label} catches light beneath the surface.`;
}

function saveOmen(omen: GlassScrollOmen) {
  try {
    window.localStorage.setItem(GLASS_SCROLL_OMEN_KEY, JSON.stringify(omen));
  } catch {}

  window.dispatchEvent(new CustomEvent(GLASS_SCROLL_OMEN_EVENT, { detail: omen }));
}

export function GlassSurfaceScroll() {
  const pathname = usePathname();
  const [omen, setOmen] = useState<GlassScrollOmen | null>(null);
  const [isAwake, setIsAwake] = useState(false);
  const activeSectionRef = useRef("");
  const hasScrolledRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const pulseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (pathname === "/press") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const root = document.documentElement;

    function clearPulseTimer() {
      if (pulseTimerRef.current !== null) {
        window.clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = null;
      }
    }

    function pulse(nextOmen: GlassScrollOmen) {
      clearPulseTimer();
      setOmen(nextOmen);
      setIsAwake(true);
      saveOmen(nextOmen);
      pulseTimerRef.current = window.setTimeout(() => {
        setIsAwake(false);
        pulseTimerRef.current = null;
      }, OMEN_VISIBLE_MS);
    }

    function update() {
      frameRef.current = null;
      const progress = getScrollProgress();
      const progressValue = progress.toFixed(3);
      root.style.setProperty("--glass-scroll-progress", progressValue);
      root.style.setProperty("--glass-scroll-shift", `${Math.round(progress * 100)}%`);

      if (window.scrollY > 24) {
        hasScrolledRef.current = true;
      }

      const currentSection = findCurrentSection();
      if (!currentSection?.id) return;

      if (!activeSectionRef.current) {
        activeSectionRef.current = currentSection.id;
        return;
      }

      if (currentSection.id !== activeSectionRef.current) {
        activeSectionRef.current = currentSection.id;
        if (!hasScrolledRef.current) return;

        const label = getSectionLabel(currentSection);
        const nextOmen: GlassScrollOmen = {
          id: `${pathname}-${currentSection.id}-${Date.now()}`,
          href: `${pathname}#${currentSection.id}`,
          label,
          message: getOmenMessage(pathname, label, progress),
          progress: Math.round(progress * 100),
          seenAt: Date.now(),
        };

        pulse(nextOmen);
      }
    }

    function scheduleUpdate() {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(update);
    }

    activeSectionRef.current = "";
    hasScrolledRef.current = false;
    scheduleUpdate();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      clearPulseTimer();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      root.style.removeProperty("--glass-scroll-progress");
      root.style.removeProperty("--glass-scroll-shift");
    };
  }, [pathname]);

  if (pathname === "/press") {
    return null;
  }

  return (
    <div className={`glass-surface-scroll${isAwake ? " is-awake" : ""}`} aria-hidden="true">
      <span className="glass-surface-sheen" />
      <span className="glass-surface-sigil" />
      <span className="glass-surface-rift" />
      {omen ? (
        <span className="glass-scroll-omen">
          <small>The Glass catches</small>
          <strong>{omen.label}</strong>
        </span>
      ) : null}
    </div>
  );
}
