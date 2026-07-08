"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import {
  GLASS_SOUND_EVENT,
  isGlassSoundEnabled,
  pauseGlassMusic,
  playGlassSound,
  setGlassSoundEnabled,
  startGlassMusic,
  startGlassMusicAfterFirstInteraction,
  syncGlassMusic,
} from "./glassSound";

const soundTooltipKey = "site-sound-toggle";
const tooltipClickBlockMs = 900;

export function GlassSoundToggle() {
  const pathname = usePathname();
  const isQuietPage = pathname === "/press" || pathname.startsWith("/big-scale-betrayal");
  const [isEnabled, setIsEnabled] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const tooltipTimerRef = useRef<number | null>(null);
  const tooltipClickBlockRef = useRef<{ key: string; until: number } | null>(null);

  useEffect(() => {
    if (isQuietPage) {
      return;
    }

    setIsEnabled(isGlassSoundEnabled());

    function syncSoundState(event: Event) {
      const nextValue = event instanceof CustomEvent ? event.detail : isGlassSoundEnabled();
      setIsEnabled(Boolean(nextValue));
    }

    window.addEventListener(GLASS_SOUND_EVENT, syncSoundState);
    return () => window.removeEventListener(GLASS_SOUND_EVENT, syncSoundState);
  }, [isQuietPage]);

  useEffect(() => {
    if (isQuietPage) {
      return;
    }

    const stopFirstInteractionListener = startGlassMusicAfterFirstInteraction();
    const observer = new MutationObserver(syncGlassMusic);

    void startGlassMusic();

    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    function syncForVisibility() {
      if (document.hidden) {
        pauseGlassMusic();
        return;
      }

      syncGlassMusic();
    }

    document.addEventListener("visibilitychange", syncForVisibility);

    return () => {
      stopFirstInteractionListener();
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncForVisibility);
    };
  }, [isQuietPage]);

  useEffect(() => {
    return () => {
      clearTooltipTimer();
    };
  }, []);

  function clearTooltipTimer() {
    if (!tooltipTimerRef.current) return;
    window.clearTimeout(tooltipTimerRef.current);
    tooltipTimerRef.current = null;
  }

  function showTooltip(key: string) {
    clearTooltipTimer();
    setActiveTooltip(key);
  }

  function hideTooltip(key: string) {
    clearTooltipTimer();
    setActiveTooltip((current) => (current === key ? null : current));
  }

  function cancelTooltipPress(key: string) {
    hideTooltip(key);
    if (tooltipClickBlockRef.current?.key === key) {
      tooltipClickBlockRef.current = null;
    }
  }

  function showTouchTooltip(key: string, event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    tooltipClickBlockRef.current = { key, until: Date.now() + tooltipClickBlockMs };
    showTooltip(key);
  }

  function blockTooltipClick(key: string, event: MouseEvent<HTMLButtonElement>) {
    const block = tooltipClickBlockRef.current;
    if (!block || block.key !== key) return;
    if (Date.now() > block.until) {
      tooltipClickBlockRef.current = null;
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    tooltipClickBlockRef.current = null;
    hideTooltip(key);
  }

  function toggleSound() {
    const nextValue = !isEnabled;
    setGlassSoundEnabled(nextValue);
    setIsEnabled(nextValue);

    if (nextValue) {
      playGlassSound("open");
      void startGlassMusic();
    } else {
      pauseGlassMusic();
    }
  }

  const tooltipLabel = isEnabled ? "Mute site sounds." : "Turn on site sounds.";

  if (isQuietPage) {
    return null;
  }

  return (
    <button
      className={`glass-sound-toggle cof-tooltip${isEnabled ? " is-enabled" : ""}`}
      type="button"
      aria-pressed={isEnabled}
      aria-label={isEnabled ? "Mute site sounds" : "Turn on site sounds"}
      data-tooltip={tooltipLabel}
      data-tooltip-active={activeTooltip === soundTooltipKey ? "true" : undefined}
      data-tooltip-place="top"
      onBlur={() => hideTooltip(soundTooltipKey)}
      onClickCapture={(event) => blockTooltipClick(soundTooltipKey, event)}
      onContextMenu={(event) => showTouchTooltip(soundTooltipKey, event)}
      onClick={toggleSound}
      onFocus={() => showTooltip(soundTooltipKey)}
      onPointerCancel={() => cancelTooltipPress(soundTooltipKey)}
      onPointerLeave={() => cancelTooltipPress(soundTooltipKey)}
      onPointerUp={() => hideTooltip(soundTooltipKey)}
    >
      <span aria-hidden="true" />
      <span className="glass-sound-toggle-label">{isEnabled ? "Sound on" : "Sound off"}</span>
    </button>
  );
}
