"use client";

export type GlassSound =
  | "open"
  | "close"
  | "travel"
  | "reveal"
  | "select"
  | "copy"
  | "success"
  | "error";

export const GLASS_SOUND_KEY = "gaze-glass.sound.v1";
export const GLASS_SOUND_EVENT = "gaze-glass:sound-change";
const GLASS_MUSIC_SRC = "/audio/atmosphere/divine-sanctuary-observatory.mp3";
const GLASS_MUSIC_VOLUME = 0.42;

type OscillatorShape = OscillatorType;

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientMusic: HTMLAudioElement | null = null;
let ambientMusicUnlocked = false;
let ambientMusicFadeFrame: number | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

export function isGlassSoundEnabled() {
  if (!isBrowser()) {
    return false;
  }

  return window.localStorage.getItem(GLASS_SOUND_KEY) !== "off";
}

export function setGlassSoundEnabled(enabled: boolean) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(GLASS_SOUND_KEY, enabled ? "on" : "off");
  if (!enabled) {
    pauseGlassMusic();
  }
  window.dispatchEvent(new CustomEvent(GLASS_SOUND_EVENT, { detail: enabled }));
}

function isObservationModeActive() {
  return document.documentElement.classList.contains("observation-mode-active");
}

function getAmbientMusic() {
  if (!isBrowser()) {
    return null;
  }

  if (!ambientMusic) {
    ambientMusic = new Audio(GLASS_MUSIC_SRC);
    ambientMusic.loop = true;
    ambientMusic.preload = "auto";
    ambientMusic.volume = 0;
  }

  return ambientMusic;
}

function fadeGlassMusic(targetVolume: number) {
  const music = getAmbientMusic();
  if (!music) {
    return;
  }

  const musicElement = music;

  if (ambientMusicFadeFrame !== null) {
    window.cancelAnimationFrame(ambientMusicFadeFrame);
  }

  const startVolume = musicElement.volume;
  const startedAt = performance.now();
  const duration = 700;

  function step(now: number) {
    const progress = Math.min(1, Math.max(0, (now - startedAt) / duration));
    musicElement.volume = Math.min(1, Math.max(0, startVolume + (targetVolume - startVolume) * progress));

    if (progress < 1) {
      ambientMusicFadeFrame = window.requestAnimationFrame(step);
      return;
    }

    ambientMusicFadeFrame = null;
    if (targetVolume === 0) {
      musicElement.pause();
    }
  }

  ambientMusicFadeFrame = window.requestAnimationFrame(step);
}

export async function startGlassMusic() {
  if (!isBrowser() || !isGlassSoundEnabled() || isObservationModeActive()) {
    return;
  }

  const music = getAmbientMusic();
  if (!music) {
    return;
  }

  ambientMusicUnlocked = true;

  try {
    if (!music.paused && music.volume > 0) {
      return;
    }

    await music.play();
    fadeGlassMusic(GLASS_MUSIC_VOLUME);
  } catch {
    ambientMusicUnlocked = false;
  }
}

export function pauseGlassMusic() {
  if (!isBrowser() || !ambientMusic) {
    return;
  }

  fadeGlassMusic(0);
}

export function syncGlassMusic() {
  if (!isBrowser()) {
    return;
  }

  if (!isGlassSoundEnabled() || isObservationModeActive()) {
    pauseGlassMusic();
    return;
  }

  if (ambientMusicUnlocked) {
    void startGlassMusic();
  }
}

export function startGlassMusicAfterFirstInteraction() {
  if (!isBrowser()) {
    return () => {};
  }

  const start = () => {
    void startGlassMusic();
  };

  window.addEventListener("click", start, { passive: true });
  window.addEventListener("mousedown", start, { passive: true });
  window.addEventListener("pointerdown", start, { passive: true });
  window.addEventListener("keydown", start);
  window.addEventListener("touchstart", start, { passive: true });

  return () => {
    window.removeEventListener("click", start);
    window.removeEventListener("mousedown", start);
    window.removeEventListener("pointerdown", start);
    window.removeEventListener("keydown", start);
    window.removeEventListener("touchstart", start);
  };
}

function getAudioContext() {
  if (!isBrowser() || !isGlassSoundEnabled()) {
    return null;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.16;
    masterGain.connect(audioContext.destination);
  }

  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }

  return audioContext;
}

function tone(
  context: AudioContext,
  frequency: number,
  duration: number,
  options: {
    delay?: number;
    endFrequency?: number;
    gain?: number;
    shape?: OscillatorShape;
  } = {},
) {
  if (!masterGain) {
    return;
  }

  const now = context.currentTime + (options.delay ?? 0);
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = options.shape ?? "sine";
  oscillator.frequency.setValueAtTime(frequency, now);

  if (options.endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(options.endFrequency, now + duration);
  }

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(options.gain ?? 0.32, now + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain);
  gain.connect(masterGain);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.04);
}

function noise(context: AudioContext, duration: number, options: { delay?: number; gain?: number } = {}) {
  if (!masterGain) {
    return;
  }

  const now = context.currentTime + (options.delay ?? 0);
  const bufferSize = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const samples = buffer.getChannelData(0);

  for (let index = 0; index < bufferSize; index += 1) {
    samples[index] = (Math.random() * 2 - 1) * (1 - index / bufferSize);
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  source.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.value = 950;
  gain.gain.setValueAtTime(options.gain ?? 0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  source.start(now);
  source.stop(now + duration);
}

export function playGlassSound(sound: GlassSound) {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  switch (sound) {
    case "open":
      tone(context, 330, 0.18, { endFrequency: 660, gain: 0.22 });
      tone(context, 990, 0.24, { delay: 0.03, gain: 0.11 });
      noise(context, 0.16, { gain: 0.035 });
      break;
    case "close":
      tone(context, 520, 0.16, { endFrequency: 260, gain: 0.18 });
      noise(context, 0.12, { gain: 0.026 });
      break;
    case "travel":
      tone(context, 196, 0.34, { endFrequency: 392, gain: 0.2, shape: "triangle" });
      tone(context, 784, 0.22, { delay: 0.08, gain: 0.08 });
      noise(context, 0.28, { gain: 0.03 });
      break;
    case "reveal":
      tone(context, 392, 0.22, { gain: 0.16 });
      tone(context, 587.33, 0.26, { delay: 0.07, gain: 0.16 });
      tone(context, 880, 0.34, { delay: 0.14, gain: 0.12 });
      break;
    case "select":
      tone(context, 440, 0.09, { gain: 0.13 });
      tone(context, 660, 0.12, { delay: 0.035, gain: 0.1 });
      break;
    case "copy":
      tone(context, 740, 0.08, { gain: 0.13 });
      tone(context, 1110, 0.11, { delay: 0.04, gain: 0.1 });
      break;
    case "success":
      tone(context, 523.25, 0.14, { gain: 0.14 });
      tone(context, 659.25, 0.17, { delay: 0.06, gain: 0.13 });
      tone(context, 987.77, 0.28, { delay: 0.13, gain: 0.12 });
      break;
    case "error":
      tone(context, 220, 0.16, { endFrequency: 185, gain: 0.16, shape: "sawtooth" });
      tone(context, 164.81, 0.18, { delay: 0.08, gain: 0.09, shape: "triangle" });
      break;
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
