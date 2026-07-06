"use client";

import { useEffect, useState } from "react";
import { GLASS_MEMORY_KEY, type GlassMemoryEntry } from "./GlassMemory";
import { GLASS_SCROLL_OMEN_KEY, type GlassScrollOmen } from "./glassSignals";
import { playGlassSound } from "./glassSound";

type ReturnMoment = {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  signal: string;
};

type ReaderBookmark = {
  chapterIndex: number;
  paragraphIndex: number;
  updatedAt: number;
};

type NamingResult = {
  godKey: string;
  spiritKey: string;
};

const READER_BOOKMARK_KEY = "cof-reader-bookmark-v2";
const NAMING_RESULT_KEY = "gaze-glass.naming-result.v1";
const RETURN_MOMENT_DISMISSED_KEY = "gaze-glass.return-moment-dismissed.v1";

const godLabels: Record<string, string> = {
  beauty: "Beauty",
  chaos: "Chaos",
  death: "Death",
  fortune: "Fortune",
  justice: "Justice",
  love: "Love",
  mercy: "Mercy",
  story: "Story",
  war: "War",
  wisdom: "Wisdom",
};

const spiritLabels: Record<string, string> = {
  jem: "Jem",
  kitsu: "Kitsu",
  marok: "Marok",
  saroka: "Saroka",
  sindren: "Sindren",
};

function readJson<T>(key: string, validator: (value: unknown) => value is T) {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    return validator(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isReaderBookmark(value: unknown): value is ReaderBookmark {
  return (
    typeof value === "object" &&
    value !== null &&
    Number.isFinite((value as ReaderBookmark).chapterIndex) &&
    Number.isFinite((value as ReaderBookmark).paragraphIndex) &&
    Number.isFinite((value as ReaderBookmark).updatedAt)
  );
}

function isNamingResult(value: unknown): value is NamingResult {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as NamingResult).godKey === "string" &&
    typeof (value as NamingResult).spiritKey === "string"
  );
}

function isGlassScrollOmen(value: unknown): value is GlassScrollOmen {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as GlassScrollOmen).href === "string" &&
    typeof (value as GlassScrollOmen).label === "string" &&
    typeof (value as GlassScrollOmen).message === "string" &&
    Number.isFinite((value as GlassScrollOmen).progress) &&
    typeof (value as GlassScrollOmen).seenAt === "number"
  );
}

function readMemoryTrail() {
  try {
    const raw = window.localStorage.getItem(GLASS_MEMORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((entry): entry is GlassMemoryEntry => {
      return (
        typeof entry?.id === "string" &&
        typeof entry?.label === "string" &&
        typeof entry?.href === "string" &&
        typeof entry?.realm === "string" &&
        typeof entry?.lastSeenAt === "number"
      );
    });
  } catch {
    return [];
  }
}

function isMeaningfulMemory(entry: GlassMemoryEntry) {
  const url = new URL(entry.href, window.location.origin);
  if (url.pathname === "/" || url.pathname === "/press") return false;
  return true;
}

function buildReaderMoment(bookmark: ReaderBookmark): ReturnMoment {
  const chapterNumber = Math.max(1, bookmark.chapterIndex + 1);

  return {
    eyebrow: "The Glass kept your place",
    title: "A chapter is still waiting where you left it.",
    body: `A Court of Foxes remembers Chapter ${chapterNumber}. The sentence has not moved. The witness mark is still warm.`,
    href: "/a-court-of-foxes",
    cta: "Return to the reader",
    signal: `Chapter ${chapterNumber}`,
  };
}

function buildNamingMoment(result: NamingResult): ReturnMoment | null {
  const god = godLabels[result.godKey];
  const spirit = spiritLabels[result.spiritKey];
  if (!god || !spirit) return null;

  return {
    eyebrow: "The Sorting Glass remembers",
    title: `${god} watches. ${spirit} remembers.`,
    body: "Your match is still shining behind the surface. Return to the result, or follow the path it opened.",
    href: `/the-glass-names-you?god=${result.godKey}&spirit=${result.spiritKey}`,
    cta: "Revisit your match",
    signal: `${god} / ${spirit}`,
  };
}

function buildOmenMoment(omen: GlassScrollOmen): ReturnMoment | null {
  if (!omen.href || omen.href === "/") return null;

  return {
    eyebrow: "The surface lit up here",
    title: omen.label,
    body: omen.message,
    href: omen.href,
    cta: "Return to the omen",
    signal: `${Math.max(0, Math.min(100, Math.round(omen.progress)))}% witnessed`,
  };
}

function buildMemoryMoment(entry: GlassMemoryEntry): ReturnMoment {
  return {
    eyebrow: "The Glass remembers where you looked",
    title: entry.label,
    body: "This is the last path that found you before the surface closed. Return to it while the thread is still visible.",
    href: entry.href,
    cta: "Return to what found you",
    signal: entry.realm,
  };
}

function getReturnMoment() {
  const readerBookmark = readJson(READER_BOOKMARK_KEY, isReaderBookmark);
  if (readerBookmark) return buildReaderMoment(readerBookmark);

  const namingResult = readJson(NAMING_RESULT_KEY, isNamingResult);
  const namingMoment = namingResult ? buildNamingMoment(namingResult) : null;
  if (namingMoment) return namingMoment;

  const scrollOmen = readJson(GLASS_SCROLL_OMEN_KEY, isGlassScrollOmen);
  const omenMoment = scrollOmen ? buildOmenMoment(scrollOmen) : null;
  if (omenMoment) return omenMoment;

  const memoryEntry = readMemoryTrail().find(isMeaningfulMemory);
  return memoryEntry ? buildMemoryMoment(memoryEntry) : null;
}

function getMomentSignature(moment: ReturnMoment) {
  return `${moment.href}::${moment.title}::${moment.signal}`;
}

function isMomentDismissed(moment: ReturnMoment) {
  try {
    return window.localStorage.getItem(RETURN_MOMENT_DISMISSED_KEY) === getMomentSignature(moment);
  } catch {
    return false;
  }
}

export function ReturnToWhatFoundYou() {
  const [moment, setMoment] = useState<ReturnMoment | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const nextMoment = getReturnMoment();
    setMoment(nextMoment && !isMomentDismissed(nextMoment) ? nextMoment : null);
    setIsReady(true);
  }, []);

  if (!isReady || !moment) {
    return null;
  }

  const activeMoment = moment;
  const actionLabel = `${activeMoment.cta}: ${activeMoment.title}`;

  function dismissMoment() {
    try {
      window.localStorage.setItem(RETURN_MOMENT_DISMISSED_KEY, getMomentSignature(activeMoment));
    } catch {}

    setMoment(null);
    playGlassSound("close");
  }

  return (
    <aside className="return-moment" aria-label="Return to what found you">
      <button
        className="return-moment-dismiss"
        type="button"
        aria-label="Close this return message"
        onClick={dismissMoment}
      >
        <span aria-hidden="true">×</span>
      </button>
      <div className="return-moment-orb" aria-hidden="true">
        <span />
      </div>
      <div className="return-moment-copy">
        <p>{activeMoment.eyebrow}</p>
        <strong>{activeMoment.title}</strong>
        <span>{activeMoment.body}</span>
      </div>
      <div className="return-moment-action">
        <small>{activeMoment.signal}</small>
        <a href={activeMoment.href} aria-label={actionLabel} onClick={() => playGlassSound("travel")}>
          {activeMoment.cta}
        </a>
      </div>
    </aside>
  );
}
