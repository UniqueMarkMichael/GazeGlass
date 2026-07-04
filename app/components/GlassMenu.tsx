"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { GLASS_MEMORY_KEY, type GlassMemoryEntry } from "./GlassMemory";
import { playGlassSound } from "./glassSound";

const menuItems = [
  { label: "Home", href: "/#home", detail: "Begin where the Glass first opens.", action: "Open Home" },
  { label: "Gods", href: "/the-gods", detail: "Meet the powers shaping mortal lives.", action: "Open Gods" },
  { label: "Spirits", href: "/the-spirits", detail: "Meet the fox spirits between worlds.", action: "Open Spirits" },
  {
    label: "Observations",
    href: "/observations",
    detail: "Witness mortal lives transformed by unseen cosmic forces.",
    action: "Open Observations",
  },
  {
    label: "A Court of Foxes",
    href: "/a-court-of-foxes",
    detail: "Enter the branching romantasy reader.",
    action: "Open A Court of Foxes",
  },
  {
    label: "Celestial Codex",
    href: "/celestial-codex",
    detail: "Discover the seven laws beneath the seen world.",
    action: "Open Celestial Codex",
  },
  { label: "Seer", href: "/the-seer", detail: "Meet the voice recording what the Glass reveals.", action: "Meet Seer" },
  {
    label: "TikTok",
    href: "/#tiktok-transmissions",
    detail: "See the public transmissions from @gazeglass.",
    action: "Open TikTok",
  },
  {
    label: "Join the Circle",
    href: "/#the-seer-circle",
    detail: "Receive new stories, laws, and letters from the Seer.",
    action: "Join the Circle",
  },
];

function isSamePath(href: string) {
  if (typeof window === "undefined") {
    return false;
  }

  const url = new URL(href, window.location.origin);
  return url.pathname === window.location.pathname;
}

function readRecordedEntries() {
  try {
    const stored = window.localStorage.getItem(GLASS_MEMORY_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? (parsed as GlassMemoryEntry[]) : [];
  } catch {
    return [];
  }
}

function isItemRecorded(href: string, entries: GlassMemoryEntry[]) {
  if (typeof window === "undefined") {
    return false;
  }

  const destination = new URL(href, window.location.origin);

  return entries.some((entry) => {
    const recorded = new URL(entry.href, window.location.origin);

    if (destination.hash) {
      return recorded.pathname === destination.pathname && recorded.hash === destination.hash;
    }

    if (destination.pathname === "/observations") {
      return recorded.pathname.startsWith("/observations");
    }

    return recorded.pathname === destination.pathname;
  });
}

export function GlassMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPassing, setIsPassing] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [recordedEntries, setRecordedEntries] = useState<GlassMemoryEntry[]>([]);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", isOpen);
    return () => document.body.classList.remove("menu-open");
  }, [isOpen]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsPassing(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    function closeForNavigation() {
      setIsOpen(false);
      setIsPassing(false);
    }

    window.addEventListener("hashchange", closeForNavigation);
    window.addEventListener("popstate", closeForNavigation);

    return () => {
      window.removeEventListener("hashchange", closeForNavigation);
      window.removeEventListener("popstate", closeForNavigation);
    };
  }, []);

  useEffect(() => {
    function refreshRecordedEntries(event?: Event) {
      const detail = event instanceof CustomEvent ? event.detail : null;
      setRecordedEntries(Array.isArray(detail) ? detail : readRecordedEntries());
    }

    function refreshFromStorage(event: StorageEvent) {
      if (event.key === GLASS_MEMORY_KEY) {
        setRecordedEntries(readRecordedEntries());
      }
    }

    refreshRecordedEntries();
    window.addEventListener("gaze-glass:memory-update", refreshRecordedEntries);
    window.addEventListener("storage", refreshFromStorage);

    return () => {
      window.removeEventListener("gaze-glass:memory-update", refreshRecordedEntries);
      window.removeEventListener("storage", refreshFromStorage);
    };
  }, []);

  function travel(href: string) {
    const destination = new URL(href, window.location.origin);
    setIsPassing(true);
    playGlassSound("travel");

    window.setTimeout(() => {
      if (destination.hash && isSamePath(href)) {
        setIsOpen(false);
        document.querySelector(destination.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `${destination.pathname}${destination.hash}`);
      } else {
        window.location.href = `${destination.pathname}${destination.hash}`;
      }
    }, 360);

    window.setTimeout(() => setIsPassing(false), 920);
  }

  function closeMenu() {
    setIsOpen(false);
    setIsPassing(false);
    playGlassSound("close");
  }

  const menuOverlay = (
    <>
      <div className={`glass-menu ${isOpen ? "is-open" : ""}`} id="glass-menu" aria-hidden={!isOpen}>
        <button
          className="glass-menu-backdrop"
          type="button"
          aria-label="Close navigation and return to the page"
          tabIndex={isOpen ? 0 : -1}
          onClick={closeMenu}
        />
        <div className="glass-menu-lens" aria-hidden="true" />
        <div className="glass-menu-panel" role="dialog" aria-modal="true" aria-label="Gaze Glass navigation">
          <button className="glass-menu-close" type="button" aria-label="Close menu" onClick={closeMenu}>
            <span aria-hidden="true">×</span>
            Close menu
          </button>
          <p className="eyebrow">Choose where to gaze</p>
          <nav className="glass-menu-nav" aria-label="Primary navigation">
            {menuItems.map((item, index) => (
              <button
                key={item.href}
                type="button"
                aria-label={`${item.label}. ${item.detail}`}
                onClick={() => travel(item.href)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.label}</strong>
                <em>{item.detail}</em>
                {isItemRecorded(item.href, recordedEntries) ? <small>Witnessed</small> : null}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className={`glass-passage ${isPassing ? "is-active" : ""}`} aria-hidden="true" />
    </>
  );

  return (
    <>
      <button
        className={`glass-menu-trigger ${isOpen ? "is-open" : ""}`}
        type="button"
        aria-expanded={isOpen}
        aria-controls="glass-menu"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        onClick={() => {
          const nextValue = !isOpen;
          setIsPassing(false);
          setIsOpen(nextValue);
          playGlassSound(nextValue ? "open" : "close");
        }}
      >
        <span className="trigger-orbit" aria-hidden="true" />
        <span className="trigger-eye" aria-hidden="true" />
        <span className="trigger-label">{isOpen ? "Close" : "Menu"}</span>
      </button>

      {portalRoot ? createPortal(menuOverlay, portalRoot) : null}
    </>
  );
}
