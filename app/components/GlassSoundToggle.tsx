"use client";

import { useEffect, useState } from "react";
import {
  GLASS_SOUND_EVENT,
  isGlassSoundEnabled,
  playGlassSound,
  setGlassSoundEnabled,
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

  function toggleSound() {
    const nextValue = !isEnabled;
    setGlassSoundEnabled(nextValue);
    setIsEnabled(nextValue);

    if (nextValue) {
      playGlassSound("open");
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
