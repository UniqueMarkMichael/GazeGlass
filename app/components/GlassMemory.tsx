"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { playGlassSound } from "./glassSound";

export const GLASS_MEMORY_KEY = "gaze-glass.memory.v1";

type GlassRealm = "threshold" | "mortal" | "god" | "spirit" | "seer" | "codex" | "observation";

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
const MAX_MEMORY_ENTRIES = 18;
const MAX_VISIBLE_MEMORY_ENTRIES = 5;

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
  { hash: "#kitsu", id: "kitsu", label: "Kitsu", href: "/the-spirits#kitsu" },
  { hash: "#marok", id: "marok", label: "Marok", href: "/the-spirits#marok" },
  { hash: "#jem", id: "jem", label: "Jem", href: "/the-spirits#jem" },
  { hash: "#sindren", id: "sindren", label: "Sindren", href: "/the-spirits#sindren" },
  { hash: "#saroka", id: "saroka", label: "Saroka", href: "/the-spirits#saroka" },
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
  const { entries, isReady, clearMemory } = useGlassMemory();
  const [isExpanded, setIsExpanded] = useState(false);
  const latest = entries[0];
  const recentEntries = useMemo(() => entries.slice(0, MAX_VISIBLE_MEMORY_ENTRIES), [entries]);
  const dominantRealm = useMemo(() => getDominantRealm(entries), [entries]);
  const dominantDetails = realmDetails[dominantRealm];

  const countText = useMemo(() => {
    if (entries.length === 1) {
      return "One vision has been witnessed.";
    }

    return `${entries.length} visions have been witnessed.`;
  }, [entries.length]);

  if (pathname === "/press" || !isReady || !latest) {
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

          <div className="glass-memory-signal">
            <small>Path signal</small>
            <strong>{dominantDetails.label}</strong>
            <span>{dominantDetails.summary}</span>
          </div>

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
