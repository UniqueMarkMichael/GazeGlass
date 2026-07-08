"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { playGlassSound } from "./glassSound";
import {
  GLASS_SCROLL_OMEN_EVENT,
  GLASS_SCROLL_OMEN_KEY,
  type GlassScrollOmen,
} from "./glassSignals";

export const GLASS_MEMORY_KEY = "gaze-glass.memory.v1";

type GlassRealm = "threshold" | "mortal" | "god" | "spirit" | "seer" | "codex" | "observation";
type GodKey =
  | "love"
  | "fortune"
  | "beauty"
  | "war"
  | "justice"
  | "story"
  | "death"
  | "wisdom"
  | "mercy"
  | "chaos";
type SpiritKey = "marok" | "kitsu" | "jem" | "saroka" | "sindren" | "prose" | "reaper" | "solace";
type WitnessThread = "sight" | "spark" | "law" | "mercy" | "triune";

export type GlassMemoryEntry = {
  id: string;
  label: string;
  href: string;
  realm: GlassRealm;
  firstSeenAt: number;
  lastSeenAt: number;
};

type MemoryLocation = {
  pathname: string;
  hash: string;
};

const LOCATION_EVENT = "gaze-glass:location-change";
const NAMING_RESULT_KEY = "gaze-glass.naming-result.v1";
const COF_WITNESS_CHOICES_KEY = "cof-witness-choices-v1";
const MAX_MEMORY_ENTRIES = 18;
const MAX_VISIBLE_MEMORY_ENTRIES = 5;

type NamedMatch = {
  href: string;
  label: string;
  summary: string;
};

type WitnessSummary = {
  count: number;
  href: string;
  label: string;
  summary: string;
  thread: WitnessThread;
};

type RememberedSignals = {
  namingMatch: NamedMatch | null;
  scrollOmen: GlassScrollOmen | null;
  witnessSummary: WitnessSummary | null;
};

const realmDetails: Record<GlassRealm, { label: string; summary: string }> = {
  threshold: {
    label: "Threshold",
    summary: "You keep returning to openings, choices, and the rituals that name a path.",
  },
  mortal: {
    label: "Mortal",
    summary: "Mortal lives are pulling strongest. The Glass is showing you consequence through human scale.",
  },
  god: {
    label: "God",
    summary: "The divine archive is calling. Power, law, and blessing are becoming your current pattern.",
  },
  spirit: {
    label: "Spirit",
    summary: "The fox spirits are close. Your path keeps circling memory, counsel, and the space between worlds.",
  },
  seer: {
    label: "Seer",
    summary: "You are drawn to the keeper of the record: messages, omens, and the voice behind the Glass.",
  },
  codex: {
    label: "Codex",
    summary: "The sacred laws are gathering around you. The Glass is asking you to read the structure beneath the story.",
  },
  observation: {
    label: "Observation",
    summary: "The witnessed archive is your center. You are following stories as evidence.",
  },
};

const godDetails: Record<GodKey, { label: string; summary: string }> = {
  love: { label: "Love", summary: "Devotion is your blessing." },
  fortune: { label: "Fortune", summary: "Timing is your blessing." },
  beauty: { label: "Beauty", summary: "Radiance is your blessing." },
  war: { label: "War", summary: "Trial is your blessing." },
  justice: { label: "Justice", summary: "Accuracy is your blessing." },
  story: { label: "Story", summary: "Memory is your blessing." },
  death: { label: "Death", summary: "Passage is your blessing." },
  wisdom: { label: "Wisdom", summary: "Seeing is your blessing." },
  mercy: { label: "Mercy", summary: "Return is your blessing." },
  chaos: { label: "Chaos", summary: "The unknown is your blessing." },
};

const spiritDetails: Record<SpiritKey, { label: string; summary: string }> = {
  kitsu: { label: "Kitsu", summary: "Kitsu notices what the room hopes no one can prove." },
  marok: { label: "Marok", summary: "Marok notices the trial before the trial admits its name." },
  jem: { label: "Jem", summary: "Jem notices the ache under radiance and the radiance under ache." },
  sindren: { label: "Sindren", summary: "Sindren notices the bond everyone else underestimates." },
  saroka: { label: "Saroka", summary: "Saroka notices the exit, the opening, and the lucky mistake." },
  prose: { label: "Prose", summary: "Prose notices where the truth began before power revised the page." },
  solace: { label: "Solace", summary: "Solace notices pain before it has language and stays until breath returns." },
  reaper: { label: "Reaper", summary: "Reaper notices the threshold and remembers every name carried through it." },
};

const witnessOptionThreads: Record<string, WitnessThread> = {
  "count-exits": "sight",
  "watch-war": "spark",
  "watch-justice": "law",
  "marok-hand": "spark",
  "kitsu-hand": "law",
  "no-hand-yet": "sight",
  "answer-mercy": "mercy",
  "answer-wrath": "spark",
  "answer-restraint": "law",
  "jem-testimony": "sight",
  "fox-testimony": "triune",
  "veyr-testimony": "mercy",
  "no-claim": "sight",
  "no-debt": "spark",
  "no-witness-claimed": "triune",
};

const witnessThreadDetails: Record<WitnessThread, { label: string; summary: string }> = {
  sight: {
    label: "Sees Beneath Ornament",
    summary: "You keep choosing the hidden door and the truth under the glamour.",
  },
  spark: {
    label: "Trusts Dangerous Sincerity",
    summary: "You reach toward heat once it learns to ask before it burns.",
  },
  law: {
    label: "Honors Restraint",
    summary: "You notice the hand that stops before it claims.",
  },
  mercy: {
    label: "Holds The Wounded Witness",
    summary: "You tend the wound without letting harm go unnamed.",
  },
  triune: {
    label: "Refuses A Single Verdict",
    summary: "You keep rose, green, and gold in the record together.",
  },
};

const homeSections = [
  { hash: "#home", id: "first-glass", label: "The First Glass", href: "/#home", realm: "threshold" },
  { hash: "#gaze-into-glass", id: "glass-portal", label: "Gaze Into The Glass", href: "/#gaze-into-glass", realm: "threshold" },
  { hash: "#the-seer", id: "seer-records", label: "Seer Records", href: "/#the-seer", realm: "seer" },
  { hash: "#the-mortals", id: "mortal-threshold", label: "Mortals Pray", href: "/#the-mortals", realm: "mortal" },
  { hash: "#featured-gods", id: "gods-watch", label: "Gods Watch", href: "/#featured-gods", realm: "god" },
  { hash: "#the-spirits", id: "spirits-remember", label: "Spirits Remember", href: "/#the-spirits", realm: "spirit" },
  { hash: "#behind-the-glass", id: "behind-the-glass", label: "Seer Speaks", href: "/#behind-the-glass", realm: "seer" },
  { hash: "#the-seer-circle", id: "seer-circle", label: "The Circle Listens", href: "/#the-seer-circle", realm: "seer" },
] as const;

const mortalCases = [
  { hash: "#patricia-case", id: "patricia", label: "Patricia, Awakened by Wisdom", href: "/observations/patricia" },
  { hash: "#marcella-case", id: "marcella", label: "Marcella, Blessed by Justice", href: "/observations/marcella" },
  { hash: "#malika-case", id: "malika", label: "Malika, Blessed by Love", href: "/observations/malika" },
  { hash: "#takeshi-case", id: "takeshi", label: "Takeshi, Blessed by Fortune", href: "/observations/takeshi" },
  { hash: "#walter-case", id: "walter", label: "Walter, Blessed by War", href: "/observations/walter" },
] as const;

const spirits = [
  { hash: "#marok", id: "marok", label: "Marok", href: "/the-spirits#marok" },
  { hash: "#kitsu", id: "kitsu", label: "Kitsu", href: "/the-spirits#kitsu" },
  { hash: "#jem", id: "jem", label: "Jem", href: "/the-spirits#jem" },
  { hash: "#saroka", id: "saroka", label: "Saroka", href: "/the-spirits#saroka" },
  { hash: "#sindren", id: "sindren", label: "Sindren", href: "/the-spirits#sindren" },
  { hash: "#prose", id: "prose", label: "Prose", href: "/the-spirits#prose" },
  { hash: "#reaper", id: "reaper", label: "Reaper", href: "/the-spirits#reaper" },
  { hash: "#solace", id: "solace", label: "Solace", href: "/the-spirits#solace" },
] as const;

const codexLaws = [
  { hash: "#witness", id: "law-witness", label: "The Law of Witness", href: "/celestial-codex#witness" },
  { hash: "#consequence", id: "law-consequence", label: "The Law of Consequence", href: "/celestial-codex#consequence" },
  { hash: "#surrender", id: "law-surrender", label: "The Law of Surrender", href: "/celestial-codex#surrender" },
  { hash: "#pressure", id: "law-pressure", label: "The Law of Pressure", href: "/celestial-codex#pressure" },
  { hash: "#memory", id: "law-memory", label: "The Law of Memory", href: "/celestial-codex#memory" },
  { hash: "#devotion", id: "law-devotion", label: "The Law of Devotion", href: "/celestial-codex#devotion" },
  { hash: "#return", id: "law-return", label: "The Law of Return", href: "/celestial-codex#return" },
] as const;

function readMemory() {
  try {
    const stored = window.localStorage.getItem(GLASS_MEMORY_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((entry): entry is GlassMemoryEntry => {
      return (
        typeof entry?.id === "string" &&
        typeof entry?.label === "string" &&
        typeof entry?.href === "string" &&
        typeof entry?.firstSeenAt === "number" &&
        typeof entry?.lastSeenAt === "number"
      );
    });
  } catch {
    return [];
  }
}

function isGodKey(value: unknown): value is GodKey {
  return typeof value === "string" && value in godDetails;
}

function isSpiritKey(value: unknown): value is SpiritKey {
  return typeof value === "string" && value in spiritDetails;
}

function isGlassScrollOmen(value: unknown): value is GlassScrollOmen {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as GlassScrollOmen).href === "string" &&
    typeof (value as GlassScrollOmen).label === "string" &&
    typeof (value as GlassScrollOmen).message === "string" &&
    typeof (value as GlassScrollOmen).progress === "number" &&
    typeof (value as GlassScrollOmen).seenAt === "number"
  );
}

function readScrollOmen() {
  try {
    const raw = window.localStorage.getItem(GLASS_SCROLL_OMEN_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return isGlassScrollOmen(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function readNamedMatch(): NamedMatch | null {
  try {
    const raw = window.localStorage.getItem(NAMING_RESULT_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const godKey = parsed?.godKey;
    const spiritKey = parsed?.spiritKey;

    if (!isGodKey(godKey) || !isSpiritKey(spiritKey)) {
      return null;
    }

    const god = godDetails[godKey];
    const spirit = spiritDetails[spiritKey];

    return {
      href: `/the-glass-names-you?god=${godKey}&spirit=${spiritKey}`,
      label: `${god.label} / ${spirit.label}`,
      summary: `${god.summary} ${spirit.summary}`,
    };
  } catch {
    return null;
  }
}

function readWitnessSummary(): WitnessSummary | null {
  try {
    const raw = window.localStorage.getItem(COF_WITNESS_CHOICES_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    const threads = Object.values(parsed)
      .map((choiceId) => (typeof choiceId === "string" ? witnessOptionThreads[choiceId] : null))
      .filter((thread): thread is WitnessThread => Boolean(thread));

    if (!threads.length) {
      return null;
    }

    const scores = threads.reduce<Record<WitnessThread, number>>(
      (record, thread) => {
        record[thread] += 1;
        return record;
      },
      { sight: 0, spark: 0, law: 0, mercy: 0, triune: 0 },
    );
    const order: WitnessThread[] = ["triune", "sight", "spark", "law", "mercy"];
    const dominantThread = order.reduce<WitnessThread>(
      (winner, thread) => (scores[thread] > scores[winner] ? thread : winner),
      order[0],
    );
    const details = witnessThreadDetails[dominantThread];

    return {
      count: threads.length,
      href: "/a-court-of-foxes",
      label: details.label,
      summary: `${threads.length} witness ${threads.length === 1 ? "mark" : "marks"} recorded. ${details.summary}`,
      thread: dominantThread,
    };
  } catch {
    return null;
  }
}

function readRememberedSignals(): RememberedSignals {
  return {
    namingMatch: readNamedMatch(),
    scrollOmen: readScrollOmen(),
    witnessSummary: readWitnessSummary(),
  };
}

function writeMemory(entries: GlassMemoryEntry[]) {
  window.localStorage.setItem(GLASS_MEMORY_KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent("gaze-glass:memory-update", { detail: entries }));
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function matchHash<T extends { hash: string }>(items: readonly T[], hash: string) {
  return items.find((item) => item.hash === hash.toLowerCase());
}

function getMemoryForLocation({ pathname, hash }: MemoryLocation): Omit<GlassMemoryEntry, "firstSeenAt" | "lastSeenAt"> | null {
  if (pathname === "/") {
    const section = matchHash(homeSections, hash || "#home") ?? homeSections[0];
    return {
      id: section.id,
      label: section.label,
      href: section.href,
      realm: section.realm,
    };
  }

  if (pathname === "/the-mortals") {
    const mortal = matchHash(mortalCases, hash);
    return {
      id: mortal?.id ?? "mortal-archive",
      label: mortal?.label ?? "The Mortal Archive",
      href: mortal?.href ?? "/observations/mortals",
      realm: "mortal",
    };
  }

  if (pathname === "/the-spirits") {
    const spirit = matchHash(spirits, hash);
    return {
      id: spirit ? `spirit-${spirit.id}` : "spirit-archive",
      label: spirit?.label ?? "The Spirit Archive",
      href: spirit?.href ?? "/the-spirits",
      realm: "spirit",
    };
  }

  if (pathname === "/the-gods") {
    return {
      id: hash ? `god-${hash.slice(1)}` : "divine-archive",
      label: hash ? titleFromSlug(hash.slice(1)) : "The Divine Archive",
      href: hash ? `/the-gods${hash}` : "/the-gods",
      realm: "god",
    };
  }

  if (pathname === "/the-seer") {
    return {
      id: "the-seer",
      label: "Seer",
      href: "/the-seer",
      realm: "seer",
    };
  }

  if (pathname === "/celestial-codex") {
    const law = matchHash(codexLaws, hash);
    return {
      id: law?.id ?? "celestial-codex",
      label: law?.label ?? "Celestial Codex",
      href: law?.href ?? "/celestial-codex",
      realm: "codex",
    };
  }

  if (pathname === "/observations") {
    return {
      id: "observation-archive",
      label: "The Observation Archive",
      href: "/observations",
      realm: "observation",
    };
  }

  if (pathname === "/the-glass-names-you") {
    return {
      id: "glass-naming",
      label: "Sorting Glass",
      href: "/the-glass-names-you",
      realm: "threshold",
    };
  }

  if (pathname.startsWith("/observations/")) {
    const slug = pathname.split("/").filter(Boolean).at(-1) ?? "observation";
    return {
      id: `observation-${slug}`,
      label:
        slug === "gods"
          ? "Gods in the Witnessed Sky"
          : slug === "mortals"
            ? "Mortals in the Witnessed Sky"
            : slug === "spirits"
              ? "Spirits in the Witnessed Sky"
              : titleFromSlug(slug),
      href: pathname,
      realm: "observation",
    };
  }

  return null;
}

function rememberLocation(location: MemoryLocation) {
  const definition = getMemoryForLocation(location);
  if (!definition) {
    return readMemory();
  }

  const now = Date.now();
  const existing = readMemory();
  const current = existing.find((entry) => entry.id === definition.id);
  const nextEntry: GlassMemoryEntry = {
    ...definition,
    firstSeenAt: current?.firstSeenAt ?? now,
    lastSeenAt: now,
  };

  const nextEntries = [
    nextEntry,
    ...existing.filter((entry) => entry.id !== definition.id),
  ]
    .sort((a, b) => b.lastSeenAt - a.lastSeenAt)
    .slice(0, MAX_MEMORY_ENTRIES);

  writeMemory(nextEntries);
  return nextEntries;
}

function getLocation() {
  return {
    pathname: window.location.pathname,
    hash: window.location.hash,
  };
}

function formatMemoryTime(timestamp: number) {
  const difference = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (difference < minute) {
    return "Just now";
  }

  if (difference < hour) {
    const minutes = Math.max(1, Math.floor(difference / minute));
    return `${minutes}m ago`;
  }

  if (difference < day) {
    const hours = Math.max(1, Math.floor(difference / hour));
    return `${hours}h ago`;
  }

  const days = Math.max(1, Math.floor(difference / day));
  return `${days}d ago`;
}

function getDominantRealm(entries: GlassMemoryEntry[]) {
  if (!entries.length) {
    return "threshold";
  }

  const counts = entries.reduce<Partial<Record<GlassRealm, number>>>((total, entry) => {
    total[entry.realm] = (total[entry.realm] ?? 0) + 1;
    return total;
  }, {});

  return entries.reduce<GlassRealm>((dominant, entry) => {
    return (counts[entry.realm] ?? 0) > (counts[dominant] ?? 0) ? entry.realm : dominant;
  }, entries[0].realm);
}

function getRealmBalance(entries: GlassMemoryEntry[]) {
  if (!entries.length) {
    return [];
  }

  const counts = entries.reduce<Partial<Record<GlassRealm, number>>>((total, entry) => {
    total[entry.realm] = (total[entry.realm] ?? 0) + 1;
    return total;
  }, {});
  const highest = Math.max(...Object.values(counts).map((value) => value ?? 0), 1);

  return Object.entries(counts)
    .map(([realm, value]) => ({
      count: value ?? 0,
      percent: Math.max(14, Math.round(((value ?? 0) / highest) * 100)),
      realm: realm as GlassRealm,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
}

function useRememberedSignals() {
  const [signals, setSignals] = useState<RememberedSignals>({
    namingMatch: null,
    scrollOmen: null,
    witnessSummary: null,
  });

  const refreshSignals = useCallback(() => {
    setSignals(readRememberedSignals());
  }, []);

  useEffect(() => {
    function refreshFromStorage(event: StorageEvent) {
      if (
        event.key === GLASS_SCROLL_OMEN_KEY ||
        event.key === NAMING_RESULT_KEY ||
        event.key === COF_WITNESS_CHOICES_KEY
      ) {
        refreshSignals();
      }
    }

    function refreshFromOmen(event: Event) {
      const detail = event instanceof CustomEvent ? event.detail : null;
      if (isGlassScrollOmen(detail)) {
        setSignals((current) => ({ ...current, scrollOmen: detail }));
        return;
      }

      refreshSignals();
    }

    refreshSignals();
    window.addEventListener(GLASS_SCROLL_OMEN_EVENT, refreshFromOmen);
    window.addEventListener("gaze-glass:memory-update", refreshSignals);
    window.addEventListener("focus", refreshSignals);
    window.addEventListener("storage", refreshFromStorage);

    return () => {
      window.removeEventListener(GLASS_SCROLL_OMEN_EVENT, refreshFromOmen);
      window.removeEventListener("gaze-glass:memory-update", refreshSignals);
      window.removeEventListener("focus", refreshSignals);
      window.removeEventListener("storage", refreshFromStorage);
    };
  }, [refreshSignals]);

  return { refreshSignals, signals };
}

function useGlassMemory() {
  const [entries, setEntries] = useState<GlassMemoryEntry[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let updateTimer: number | null = null;

    function updateMemory() {
      setEntries(rememberLocation(getLocation()));
      setIsReady(true);
    }

    function scheduleMemoryUpdate() {
      if (updateTimer !== null) {
        window.clearTimeout(updateTimer);
      }

      updateTimer = window.setTimeout(() => {
        updateTimer = null;
        updateMemory();
      }, 0);
    }

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    const emitLocationChange = () => window.dispatchEvent(new Event(LOCATION_EVENT));

    window.history.pushState = function pushState(...args: Parameters<History["pushState"]>) {
      originalPushState.apply(this, args);
      emitLocationChange();
    };

    window.history.replaceState = function replaceState(...args: Parameters<History["replaceState"]>) {
      originalReplaceState.apply(this, args);
      emitLocationChange();
    };

    window.addEventListener("hashchange", scheduleMemoryUpdate);
    window.addEventListener("popstate", scheduleMemoryUpdate);
    window.addEventListener(LOCATION_EVENT, scheduleMemoryUpdate);
    scheduleMemoryUpdate();

    return () => {
      if (updateTimer !== null) {
        window.clearTimeout(updateTimer);
      }

      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("hashchange", scheduleMemoryUpdate);
      window.removeEventListener("popstate", scheduleMemoryUpdate);
      window.removeEventListener(LOCATION_EVENT, scheduleMemoryUpdate);
    };
  }, []);

  function clearMemory() {
    window.localStorage.removeItem(GLASS_MEMORY_KEY);
    window.dispatchEvent(new CustomEvent("gaze-glass:memory-update", { detail: [] }));
    setEntries([]);
    playGlassSound("close");
  }

  return { entries, isReady, clearMemory };
}

export function GlassMemory() {
  const pathname = usePathname();
  const isQuietPage = pathname === "/press" || pathname.startsWith("/big-scale-betrayal");
  const { entries, isReady, clearMemory } = useGlassMemory();
  const { refreshSignals, signals } = useRememberedSignals();
  const [isExpanded, setIsExpanded] = useState(false);
  const latest = entries[0];
  const recentEntries = useMemo(() => entries.slice(0, MAX_VISIBLE_MEMORY_ENTRIES), [entries]);
  const dominantRealm = useMemo(() => getDominantRealm(entries), [entries]);
  const dominantDetails = realmDetails[dominantRealm];
  const realmBalance = useMemo(() => getRealmBalance(entries), [entries]);

  const countText = useMemo(() => {
    if (entries.length === 1) {
      return "One vision has been witnessed.";
    }

    return `${entries.length} visions have been witnessed.`;
  }, [entries.length]);

  if (isQuietPage || !isReady || !latest) {
    return null;
  }

  return (
    <div className={`glass-memory-shell${isExpanded ? " is-expanded" : ""}`}>
      <button
        className="glass-memory-toggle"
        type="button"
        aria-expanded={isExpanded}
        aria-controls="glass-memory-panel"
        onClick={() => {
          const nextValue = !isExpanded;
          if (nextValue) {
            refreshSignals();
          }
          setIsExpanded(nextValue);
          playGlassSound(nextValue ? "open" : "close");
        }}
      >
        <span className="glass-memory-toggle-orb" aria-hidden="true" />
        <span className="glass-memory-toggle-copy">
          <span>The Glass Remembers</span>
          <strong>
            {entries.length} {entries.length === 1 ? "vision" : "visions"}
          </strong>
        </span>
      </button>

      {isExpanded ? (
        <aside id="glass-memory-panel" className="glass-memory" aria-label="The Glass remembers your path" aria-live="polite">
          <div className="glass-memory-stars" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <button
            className="glass-memory-close"
            type="button"
            aria-label="Close the Glass Remembers panel"
            onClick={() => {
              setIsExpanded(false);
              playGlassSound("close");
            }}
          >
            Close
          </button>
          <div className="glass-memory-header">
            <p>The Glass Remembers</p>
            <strong>{countText}</strong>
            <span>Private to this browser. No account. No cross-device memory.</span>
          </div>

          <a className="glass-memory-latest" href={latest.href}>
            <small>Return to the latest vision</small>
            <strong>{latest.label}</strong>
            <span>
              {realmDetails[latest.realm].label} / {formatMemoryTime(latest.lastSeenAt)}
            </span>
          </a>

          <div className="glass-memory-omen">
            <small>Current omen</small>
            <strong>{signals.scrollOmen?.label ?? dominantDetails.label}</strong>
            <span>
              {signals.scrollOmen?.message ?? "The surface is waiting for the next place your gaze slows."}
            </span>
          </div>

          <div className="glass-memory-signal">
            <small>Path signal</small>
            <strong>{dominantDetails.label}</strong>
            <span>{dominantDetails.summary}</span>
          </div>

          <div className="glass-memory-personal-grid" aria-label="Remembered signals">
            {signals.namingMatch ? (
              <a className="glass-memory-personal-card" href={signals.namingMatch.href}>
                <small>Sorting Glass</small>
                <strong>{signals.namingMatch.label}</strong>
                <span>{signals.namingMatch.summary}</span>
              </a>
            ) : (
              <a className="glass-memory-personal-card" href="/the-glass-names-you">
                <small>Sorting Glass</small>
                <strong>No match recorded yet</strong>
                <span>Gaze into the Sorting Glass to name the deity and fox spirit nearest your path.</span>
              </a>
            )}

            {signals.witnessSummary ? (
              <a className={`glass-memory-personal-card is-${signals.witnessSummary.thread}`} href={signals.witnessSummary.href}>
                <small>A Court of Foxes</small>
                <strong>{signals.witnessSummary.label}</strong>
                <span>{signals.witnessSummary.summary}</span>
              </a>
            ) : (
              <a className="glass-memory-personal-card" href="/a-court-of-foxes">
                <small>A Court of Foxes</small>
                <strong>No witness marks yet</strong>
                <span>Enter the story and let the Glass record the choices you make inside the court.</span>
              </a>
            )}
          </div>

          {realmBalance.length ? (
            <div className="glass-memory-balance" aria-label="Realm balance">
              <small>Realm balance</small>
              {realmBalance.map((item) => (
                <div className="glass-memory-realm-row" key={item.realm}>
                  <span>{realmDetails[item.realm].label}</span>
                  <i aria-hidden="true">
                    <span style={{ width: `${item.percent}%` }} />
                  </i>
                  <em>{item.count}</em>
                </div>
              ))}
            </div>
          ) : null}

          <div className="glass-memory-trail" aria-label="Recent witnessed path">
            <small>Recent path</small>
            <ol>
              {recentEntries.map((entry, index) => (
                <li key={entry.id}>
                  <a href={entry.href}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{entry.label}</strong>
                    <em>
                      {realmDetails[entry.realm].label} / {formatMemoryTime(entry.lastSeenAt)}
                    </em>
                  </a>
                </li>
              ))}
            </ol>
          </div>

          <div className="glass-memory-actions">
            <button className="glass-memory-forget" type="button" onClick={clearMemory}>
              Let the Glass Forget
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
