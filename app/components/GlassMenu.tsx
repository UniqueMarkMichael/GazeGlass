"use client";

import { useEffect, useState } from "react";

const menuItems = [
  { label: "Home", href: "/#home", detail: "Return to the first glass.", action: "Open Home" },
  { label: "The Gods", href: "/the-gods", detail: "Enter the divine archive.", action: "Open The Gods" },
  { label: "The Spirits", href: "/the-spirits", detail: "Find what waits at the edge.", action: "Open The Spirits" },
  {
    label: "The Mortals",
    href: "/the-mortals",
    detail: "Witness the blessed and changed.",
    action: "Open The Mortals",
  },
  { label: "The Seer", href: "/the-seer", detail: "Meet the keeper of the glass.", action: "Meet The Seer" },
  {
    label: "The Seer Circle",
    href: "/#the-seer-circle",
    detail: "Receive new observations.",
    action: "Join The Seer Circle",
  },
];

function isSamePath(href: string) {
  if (typeof window === "undefined") {
    return false;
  }

  const url = new URL(href, window.location.origin);
  return url.pathname === window.location.pathname;
}

export function GlassMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPassing, setIsPassing] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", isOpen);
    return () => document.body.classList.remove("menu-open");
  }, [isOpen]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  function travel(href: string) {
    const destination = new URL(href, window.location.origin);
    setIsPassing(true);

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

  return (
    <>
      <button
        className={`glass-menu-trigger ${isOpen ? "is-open" : ""}`}
        type="button"
        aria-expanded={isOpen}
        aria-controls="glass-menu"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span className="trigger-orbit" aria-hidden="true" />
        <span className="trigger-eye" aria-hidden="true" />
        <span className="trigger-label">{isOpen ? "Close" : "Menu"}</span>
      </button>

      <div className={`glass-menu ${isOpen ? "is-open" : ""}`} id="glass-menu" aria-hidden={!isOpen}>
        <div className="glass-menu-lens" aria-hidden="true" />
        <div className="glass-menu-panel" role="dialog" aria-modal="true" aria-label="Gaze Glass navigation">
          <p className="eyebrow">Choose a lens</p>
          <nav className="glass-menu-nav" aria-label="Gaze Glass sections">
            {menuItems.map((item, index) => (
              <button
                key={item.href}
                type="button"
                aria-label={item.action}
                onClick={() => travel(item.href)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.label}</strong>
                <em>{item.detail}</em>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className={`glass-passage ${isPassing ? "is-active" : ""}`} aria-hidden="true" />
    </>
  );
}
