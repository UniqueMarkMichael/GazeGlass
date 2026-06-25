"use client";

import { useEffect, useMemo, useState } from "react";

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

const homeSections = [
  { hash: "#home", id: "first-glass", label: "The First Glass", href: "/#home", realm: "threshold" },
  { hash: "#gaze-into-glass", id: "glass-portal", label: "Gaze Into The Glass", href: "/#gaze-into-glass", realm: "threshold" },
  { hash: "#the-seer", id: "seer-records", label: "The Seer Records", href: "/#the-seer", realm: "seer" },
  { hash: "#the-mortals", id: "mortal-threshold", label: "Mortals Pray", href: "/#the-mortals", realm: "mortal" },
  { hash: "#featured-gods", id: "gods-watch", label: "Gods Watch", href: "/#featured-gods", realm: "god" },
  { hash: "#the-spirits", id: "spirits-remember", label: "Spirits Remember", href: "/#the-spirits", realm: "spirit" },
  { hash: "#behind-the-glass", id: "behind-the-glass", label: "Behind the Glass", href: "/#behind-the-glass", realm: "seer" },
  { hash: "#the-seer-circle", id: "seer-circle", label: "The Circle Listens", href: "/#the-seer-circle", realm: "seer" },
] as const;

const mortalCases = [
  { hash: "#patricia-case", id: "patricia", label: "Patricia, Awakened by Wisdom", href: "/the-mortals#patricia-case" },
  { hash: "#marcella-case", id: "marcella", label: "Marcella, Blessed by Justice", href: "/observations/marcella" },
  { hash: "#malika-case", id: "malika", label: "Malika, Blessed by Love", href: "/the-mortals#malika-case" },
  { hash: "#takeshi-case", id: "takeshi", label: "Takeshi, Blessed by Fortune", href: "/the-mortals#takeshi-case" },
  { hash: "#walter-case", id: "walter", label: "Walter, Blessed by War", href: "/the-mortals#walter-case" },
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
      href: mortal?.href ?? "/the-mortals",
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
      label: "The Seer",
      href: "/the-seer",
      realm: "seer",
    };
  }

  if (pathname === "/celestial-codex") {
    const law = matchHash(codexLaws, hash);
    return {
      id: law?.id ?? "celestial-codex",
      label: law?.label ?? "The Celestial Codex",
      href: law?.href ?? "/celestial-codex",
      realm: "codex",
    };
  }

  if (pathname === "/observations") {
    return {
      id: "patricia-observation",
      label: "Patricia, Awakened by Wisdom",
      href: "/observations",
      realm: "observation",
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
  }

  return { entries, isReady, clearMemory };
}

export function GlassMemory() {
  const { entries, isReady, clearMemory } = useGlassMemory();
  const [isExpanded, setIsExpanded] = useState(false);
  const latest = entries[0];

  const countText = useMemo(() => {
    if (entries.length === 1) {
      return "One vision has been witnessed.";
    }

    return `${entries.length} visions have been witnessed.`;
  }, [entries.length]);

  if (!isReady || !latest) {
    return null;
  }

  return (
    <div className={`glass-memory-shell${isExpanded ? " is-expanded" : ""}`}>
      <button
        className="glass-memory-toggle"
        type="button"
        aria-expanded={isExpanded}
        aria-controls="glass-memory-panel"
        onClick={() => setIsExpanded((current) => !current)}
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
            onClick={() => setIsExpanded(false)}
          >
            Close
          </button>
          <p>The Glass Remembers</p>
          <strong>{countText}</strong>
          <span>
            Latest: <a href={latest.href}>{latest.label}</a>
          </span>
          <button className="glass-memory-forget" type="button" onClick={clearMemory}>
            Let the Glass Forget
          </button>
        </aside>
      ) : null}
    </div>
  );
}
