"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { GLASS_MEMORY_KEY, type GlassMemoryEntry } from "./GlassMemory";
import { playGlassSound } from "./glassSound";
import {
  EMAIL_CAPTURED_EVENT,
  hasSubmittedEmail,
  rememberSubscribedEmail,
} from "./subscriptionStorage";

type FormState = "idle" | "loading" | "success" | "invalid" | "error" | "unconfigured";
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
type SpiritKey = "kitsu" | "marok" | "jem" | "sindren" | "saroka";
type NamingResult = {
  godKey: GodKey;
  spiritKey: SpiritKey;
};
type DailyVision = {
  id: string;
  title: string;
  signal: string;
  omen: string;
  instruction: string;
  href: string;
  cta: string;
};

const DAILY_VISION_DISMISSED_UNTIL_KEY = "gaze-glass.daily-vision.dismissed-until.v1";
const DAILY_VISION_LAST_SHOWN_KEY = "gaze-glass.daily-vision.last-shown.v1";
const NAMING_RESULT_KEY = "gaze-glass.naming-result.v1";
const SHOW_DELAY_MS = 2200;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const godNames: Record<GodKey, string> = {
  love: "Love",
  fortune: "Fortune",
  beauty: "Beauty",
  war: "War",
  justice: "Justice",
  story: "Story",
  death: "Death",
  wisdom: "Wisdom",
  mercy: "Mercy",
  chaos: "Chaos",
};

const spiritNames: Record<SpiritKey, string> = {
  kitsu: "Kitsu",
  marok: "Marok",
  jem: "Jem",
  sindren: "Sindren",
  saroka: "Saroka",
};

const dailyVisions: DailyVision[] = [
  {
    id: "witness-clean-ink",
    title: "The record refuses to blur.",
    signal: "Justice / Kitsu",
    omen:
      "A small truth will ask to be named today. Do not decorate it. Do not shrink it. Let it stand in clean ink.",
    instruction: "Witness Marcella when you need proof that the stolen thing can still return to its rightful name.",
    href: "/observations/marcella",
    cta: "Witness Marcella",
  },
  {
    id: "fortune-gold-door",
    title: "A gold door appears as timing.",
    signal: "Fortune / Saroka",
    omen:
      "One opening will look almost too ordinary to trust. Step closer anyway. Fortune often arrives without trumpets.",
    instruction: "Follow Fortune if you can feel a future arranging itself before the room understands.",
    href: "/the-gods#the-god-of-fortune",
    cta: "Meet Fortune",
  },
  {
    id: "beauty-survives-room",
    title: "Beauty enters before permission.",
    signal: "Beauty / Jem",
    omen:
      "Something radiant in you has been mistaken for excess. Today, let it become structure. Let it hold the room.",
    instruction: "Enter Beauty's archive when radiance needs to become survival instead of performance.",
    href: "/the-gods#the-god-of-beauty",
    cta: "Meet Beauty",
  },
  {
    id: "war-clean-trial",
    title: "The trial reveals the shape.",
    signal: "War / Marok",
    omen:
      "Pressure is not always punishment. Sometimes it is the hand that shows you what cannot be taken from you.",
    instruction: "Witness Walter when you are ready to see what remains after strength stops being the answer.",
    href: "/observations/walter",
    cta: "Witness Walter",
  },
  {
    id: "love-dangerous-mercy",
    title: "The tender thing has teeth.",
    signal: "Love / Sindren",
    omen:
      "A bond may ask for honesty instead of softness. Love is still love when it refuses to lie for comfort.",
    instruction: "Witness Malika when devotion needs consequence, witness, and a god who does not look away.",
    href: "/observations/malika",
    cta: "Witness Malika",
  },
  {
    id: "wisdom-pattern-opens",
    title: "The second pattern is the answer.",
    signal: "Wisdom / Kitsu",
    omen:
      "You already noticed the first sign. Look beneath it. Wisdom is waiting where the obvious explanation ends.",
    instruction: "Witness Patricia when the old map has gone quiet and meaning starts speaking in another voice.",
    href: "/observations/patricia",
    cta: "Witness Patricia",
  },
  {
    id: "court-candlelit-testimony",
    title: "The foxes have taken their seats.",
    signal: "Beauty / War / Justice",
    omen:
      "Three witnesses gather in candlelight. One sees the wound, one designs the trial, and one keeps the record clean.",
    instruction: "Enter A Court of Foxes when you want the spirits to step out of the archive and into the room.",
    href: "/a-court-of-foxes",
    cta: "Enter A Court of Foxes",
  },
];

function isGodKey(value: unknown): value is GodKey {
  return typeof value === "string" && value in godNames;
}

function isSpiritKey(value: unknown): value is SpiritKey {
  return typeof value === "string" && value in spiritNames;
}

function getLocalDayKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}

function getTomorrowStart() {
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0);
  return tomorrow.getTime();
}

function getVisionForDay(dayKey: string) {
  const seed = Array.from(dayKey).reduce(
    (total, character) => (total * 31 + character.charCodeAt(0)) % 100000,
    17,
  );

  return dailyVisions[seed % dailyVisions.length];
}

function readNamingResult() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(NAMING_RESULT_KEY);
    const parsed = raw ? JSON.parse(raw) : null;

    if (isGodKey(parsed?.godKey) && isSpiritKey(parsed?.spiritKey)) {
      return parsed as NamingResult;
    }
  } catch {
    return null;
  }

  return null;
}

function shouldSkipDailyVision() {
  const pathname = window.location.pathname;
  const hash = window.location.hash;

  return (
    pathname.startsWith("/a-court-of-foxes") ||
    pathname.startsWith("/api") ||
    hash === "#the-seer-circle" ||
    document.documentElement.classList.contains("observation-mode-active")
  );
}

function rememberDailyVision(vision: DailyVision, dayKey: string) {
  const now = Date.now();

  try {
    const stored = window.localStorage.getItem(GLASS_MEMORY_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    const entries = Array.isArray(parsed) ? (parsed as GlassMemoryEntry[]) : [];
    const id = `daily-vision-${dayKey}`;
    const existing = entries.find((entry) => entry.id === id);
    const nextEntry: GlassMemoryEntry = {
      id,
      label: `Daily Vision: ${vision.signal}`,
      href: vision.href,
      realm: "seer",
      firstSeenAt: existing?.firstSeenAt ?? now,
      lastSeenAt: now,
    };
    const nextEntries = [nextEntry, ...entries.filter((entry) => entry.id !== id)]
      .sort((a, b) => b.lastSeenAt - a.lastSeenAt)
      .slice(0, 18);

    window.localStorage.setItem(GLASS_MEMORY_KEY, JSON.stringify(nextEntries));
    window.dispatchEvent(new CustomEvent("gaze-glass:memory-update", { detail: nextEntries }));
  } catch {
    return;
  }
}

export function DailyVisionCapture() {
  const dayKey = useMemo(() => getLocalDayKey(), []);
  const vision = useMemo(() => getVisionForDay(dayKey), [dayKey]);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [namingResult, setNamingResult] = useState<NamingResult | null>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setNamingResult(readNamingResult());

    function hideForSubscriber() {
      setIsVisible(false);
    }

    window.addEventListener(EMAIL_CAPTURED_EVENT, hideForSubscriber);

    if (shouldSkipDailyVision() || hasSubmittedEmail()) {
      return () => window.removeEventListener(EMAIL_CAPTURED_EVENT, hideForSubscriber);
    }

    const dismissedUntil = Number(window.localStorage.getItem(DAILY_VISION_DISMISSED_UNTIL_KEY) || 0);
    const lastShownDay = window.localStorage.getItem(DAILY_VISION_LAST_SHOWN_KEY);

    if (dismissedUntil > Date.now() || lastShownDay === dayKey) {
      return () => window.removeEventListener(EMAIL_CAPTURED_EVENT, hideForSubscriber);
    }

    const showTimer = window.setTimeout(() => {
      if (shouldSkipDailyVision() || hasSubmittedEmail()) {
        return;
      }

      window.localStorage.setItem(DAILY_VISION_LAST_SHOWN_KEY, dayKey);
      setIsVisible(true);
      rememberDailyVision(vision, dayKey);
      playGlassSound("open");
    }, SHOW_DELAY_MS);

    return () => {
      window.clearTimeout(showTimer);
      window.removeEventListener(EMAIL_CAPTURED_EVENT, hideForSubscriber);
    };
  }, [dayKey, vision]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        dismissForToday();
      }
    }

    document.body.classList.add("daily-vision-open");
    window.addEventListener("keydown", closeOnEscape);
    window.setTimeout(() => dialogRef.current?.focus(), 0);

    return () => {
      document.body.classList.remove("daily-vision-open");
      window.removeEventListener("keydown", closeOnEscape);
      activeElement?.focus();
    };
  }, [isVisible]);

  function dismissForToday() {
    window.localStorage.setItem(DAILY_VISION_DISMISSED_UNTIL_KEY, String(getTomorrowStart()));
    setIsVisible(false);
    playGlassSound("close");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) {
      setFormState("invalid");
      playGlassSound("error");
      return;
    }

    setFormState("loading");
    setErrorMessage("");
    playGlassSound("travel");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          source: "daily-vision",
          vision: vision.id,
          deity: namingResult ? godNames[namingResult.godKey] : undefined,
          spirit: namingResult ? spiritNames[namingResult.spiritKey] : undefined,
        }),
      });
      const result = (await response.json()) as { message?: string };

      if (response.ok) {
        rememberSubscribedEmail(normalizedEmail);
        rememberDailyVision(vision, dayKey);
        setEmail("");
        setFormState("success");
        playGlassSound("success");
        window.setTimeout(() => setIsVisible(false), 1600);
        return;
      }

      setErrorMessage(result.message || "");
      setFormState(response.status === 503 ? "unconfigured" : "error");
      playGlassSound("error");
    } catch {
      setErrorMessage("");
      setFormState("error");
      playGlassSound("error");
    }
  }

  if (!isVisible) {
    return null;
  }

  const message = {
    idle: "One vision each day. Leave the circle anytime. No spam crosses the glass.",
    loading: "The Glass is carrying your address to the Seer.",
    success: "Tomorrow's vision knows where to find you.",
    invalid: "The Glass could not read that address. Check it and look again.",
    error:
      errorMessage ||
      "The Glass clouded before the vision could be saved. Please try again in a moment.",
    unconfigured:
      errorMessage ||
      "The vision is ready, but Mailchimp still needs to be connected in Vercel.",
  }[formState];

  const personalizedSignal = namingResult
    ? `${godNames[namingResult.godKey]} remembers. ${spiritNames[namingResult.spiritKey]} keeps watch.`
    : "The Glass has not named you yet.";

  const statusRole = formState === "invalid" || formState === "error" ? "alert" : "status";
  const isBusy = formState === "loading";

  return (
    <div className="daily-vision-layer" role="presentation">
      <button
        className="daily-vision-scrim"
        type="button"
        aria-label="Dismiss Daily Vision"
        onClick={dismissForToday}
      />
      <section
        ref={dialogRef}
        className="daily-vision-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="daily-vision-title"
        tabIndex={-1}
      >
        <button className="daily-vision-close" type="button" onClick={dismissForToday}>
          Close
        </button>

        <figure className="daily-vision-art" aria-hidden="true">
          <img src="/brand/sacred-mirror.webp" alt="" />
          <figcaption>
            <span>{dayKey}</span>
            <strong>{vision.signal}</strong>
          </figcaption>
        </figure>

        <div className="daily-vision-copy">
          <div>
            <p className="eyebrow">Daily Vision</p>
            <h2 id="daily-vision-title">{vision.title}</h2>
          </div>

          <p className="daily-vision-omen">{vision.omen}</p>

          <div className="daily-vision-thread" aria-label="Daily Vision signals">
            <span>{vision.signal}</span>
            <span>{personalizedSignal}</span>
          </div>

          <p className="daily-vision-instruction">{vision.instruction}</p>

          <form className="daily-vision-form" onSubmit={submit} noValidate data-state={formState}>
            <label htmlFor="daily-vision-email">Receive tomorrow&apos;s vision</label>
            <div className="daily-vision-input-row">
              <input
                id="daily-vision-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                aria-describedby="daily-vision-message"
                aria-invalid={formState === "invalid"}
                disabled={isBusy}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (formState !== "idle" && formState !== "loading") {
                    setFormState("idle");
                  }
                }}
              />
              <button type="submit" disabled={isBusy}>
                {isBusy ? "Sending" : "Send Tomorrow's Vision"}
              </button>
            </div>
            <p className={`form-note ${formState}`} id="daily-vision-message" role={statusRole} aria-live="polite">
              <span>{formState === "success" ? "Vision saved" : "Seer Circle"}</span>
              {message}
            </p>
          </form>

          <div className="daily-vision-actions">
            <a className="text-link" href={vision.href} onClick={() => playGlassSound("travel")}>
              {vision.cta}
            </a>
            <button className="daily-vision-secondary" type="button" onClick={dismissForToday}>
              Not Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
