"use client";

import { useEffect, useState } from "react";
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

export function GlassSoundToggle() {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    setIsEnabled(isGlassSoundEnabled());

    function syncSoundState(event: Event) {
      const nextValue = event instanceof CustomEvent ? event.detail : isGlassSoundEnabled();
      setIsEnabled(Boolean(nextValue));
    }

    window.addEventListener(GLASS_SOUND_EVENT, syncSoundState);
    return () => window.removeEventListener(GLASS_SOUND_EVENT, syncSoundState);
  }, []);

  useEffect(() => {
    const stopFirstInteractionListener = startGlassMusicAfterFirstInteraction();
    const observer = new MutationObserver(syncGlassMusic);

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
  }, []);

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

  return (
    <button
      className={`glass-sound-toggle${isEnabled ? " is-enabled" : ""}`}
      type="button"
      aria-pressed={isEnabled}
      aria-label={isEnabled ? "Mute site sounds" : "Turn on site sounds"}
      title={isEnabled ? "Mute site sounds" : "Turn on site sounds"}
      onClick={toggleSound}
    >
      <span aria-hidden="true" />
      <span className="glass-sound-toggle-label">{isEnabled ? "Sound on" : "Sound off"}</span>
    </button>
  );
}
