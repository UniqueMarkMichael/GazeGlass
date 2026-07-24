"use client";

import Link from "next/link";
import { Fragment, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { playGlassSound } from "../../../../components/glassSound";

type ReaderTheme = "night" | "moonstone" | "parchment";
type ReaderFont = "literary" | "readable";
type ReaderWidth = "intimate" | "balanced" | "expansive";
type SceneKey = string;
type PanelKey = "reading" | "atmosphere" | "voice" | "archive";

type StoryImage = {
  after: number;
  src: string;
  alt: string;
  portrait?: boolean;
};

type Preferences = {
  theme: ReaderTheme;
  font: ReaderFont;
  width: ReaderWidth;
  fontStep: number;
  showImages: boolean;
  motion: boolean;
  focus: boolean;
};

const PREFS_KEY = "gaze-glass:afom:reader-preferences";
const SAVED_KEY = "gaze-glass:afom:held-passages";
const SECOND_GAZE_KEY = "gaze-glass:afom:second-gaze";

const scenes: Array<{ key: SceneKey; start: number; label: string; invitation: string }> = [
  { key: "paradise", start: 0, label: "The Realm of Paradise", invitation: "Foxnip, pearl dust, and a spirit late for destiny." },
  { key: "war", start: 15, label: "The God of War", invitation: "Utopia darkens around the primordial flame." },
  { key: "beauty", start: 22, label: "The God of Beauty", invitation: "Rose quartz light enters the Judgment." },
  { key: "mortal", start: 58, label: "A Mortal Prayer", invitation: "The gods cross the mirror into a desperate home." },
  { key: "possession", start: 68, label: "Divine Possession", invitation: "Two vessels are abandoned. Two serpents awaken." },
];

const glossary: Record<string, { kind: string; title: string; body: string }> = {
  "The Realm of Paradise": { kind: "Realm", title: "The Realm of Paradise", body: "The divine realm where immortal spirits and forgiven souls dwell beneath the authority of the Cardinal gods." },
  Utopia: { kind: "Realm", title: "Utopia", body: "The always-changing kingdom above Paradise, forged from metal and gemstone so the gods may watch The Judgment." },
  Judgment: { kind: "Divine Law", title: "The Judgment", body: "A period of divine trial in which chosen mortal families wield power and determine the fate of civilizations." },
  "The God of War": { kind: "Cardinal God", title: "The God of War", body: "A primordial force born from betrayal, charged with enforcing cosmic consequence through flame, malice, and divine order." },
  "The God of Beauty": { kind: "Cardinal God", title: "The God of Beauty", body: "A radiant, mercurial deity whose appetite for sensation makes creation, cruelty, and delight nearly indistinguishable." },
  pledge: { kind: "Divine Law", title: "Pledge", body: "An unbreakable contract binding a mortal life-thread to a divine ruler in exchange for transformative boons." },
  "Scales of Judgment": { kind: "Divine Artifact", title: "The Scales of Judgment", body: "A sacred mechanism capable of disrupting judgment across parallel universes when touched by mortal defiance." },
};

const lensPattern = /(The Realm of Paradise|The God of Beauty|The God of War|Scales of Judgment|Utopia|Judgments?|pledges?)/g;
const holdablePassages = new Set([22, 53, 73]);

const defaults: Preferences = {
  theme: "night",
  font: "literary",
  width: "balanced",
  fontStep: 1,
  showImages: true,
  motion: true,
  focus: false,
};

function numberWord(number: number) {
  return ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"][number] ?? String(number);
}

type ChapterConfig = {
  number: number;
  title: string;
  video?: string;
  poster: string;
  invitation?: string;
  scenes?: Array<{ key: SceneKey; start: number; label: string; invitation: string }>;
  relicTitle?: string;
  relicQuote?: string;
  relicMeaning?: string;
  focusKind?: string;
  focusName?: string;
  focusDescription?: string;
};

export function ChapterOneExperience({ paragraphs, images, config }: { paragraphs: string[]; images: StoryImage[]; config?: ChapterConfig }) {
  const chapterNumber = config?.number ?? 1;
  const chapterTitle = config?.title ?? "Marok";
  const chapterScenes = config?.scenes ?? scenes;
  const placeKey = `gaze-glass:afom:chapter-${chapterNumber}-place`;
  const relicKey = `gaze-glass:afom:chapter-${chapterNumber}-relic`;
  const [prefs, setPrefs] = useState<Preferences>(defaults);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelKey>("reading");
  const [progress, setProgress] = useState(0);
  const [savedPlace, setSavedPlace] = useState(0);
  const [resumeVisible, setResumeVisible] = useState(false);
  const [activeParagraph, setActiveParagraph] = useState(0);
  const [activeScene, setActiveScene] = useState<SceneKey>(chapterScenes[0]?.key ?? "opening");
  const [lensTerm, setLensTerm] = useState<string | null>(null);
  const [heldPassages, setHeldPassages] = useState<number[]>([]);
  const [relicUnlocked, setRelicUnlocked] = useState(false);
  const [secondGaze, setSecondGaze] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const imagesByParagraph = useMemo(() => new Map(images.map((image) => [image.after, image])), [images]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PREFS_KEY);
      if (raw) setPrefs({ ...defaults, ...JSON.parse(raw) });
      const place = Number(window.localStorage.getItem(placeKey) ?? 0);
      if (place > 4 && place < 95) {
        setSavedPlace(place);
        setResumeVisible(true);
      }
      const held = JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? "[]");
      if (Array.isArray(held)) setHeldPassages(held.filter((value) => Number.isInteger(value)));
      setRelicUnlocked(window.localStorage.getItem(relicKey) === "unlocked");
      setSecondGaze(window.localStorage.getItem(SECOND_GAZE_KEY) === "on");
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch {}
  }, [hydrated, prefs]);

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      setProgress(next);
      try { window.localStorage.setItem(placeKey, next.toFixed(2)); } catch {}
      if (next > 92) {
        setRelicUnlocked(true);
        try { window.localStorage.setItem(relicKey, "unlocked"); } catch {}
      }
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const markers = Array.from(document.querySelectorAll<HTMLElement>("[data-afom-paragraph][data-afom-scene]"));
    const updateScene = () => {
      const threshold = window.innerHeight * 0.42;
      let current: SceneKey = chapterScenes[0]?.key ?? "opening";
      for (const marker of markers) {
        if (marker.getBoundingClientRect().top <= threshold) current = marker.dataset.afomScene as SceneKey;
        else break;
      }
      setActiveScene(current);
    };
    updateScene();
    window.addEventListener("scroll", updateScene, { passive: true });
    window.addEventListener("resize", updateScene);
    return () => {
      window.removeEventListener("scroll", updateScene);
      window.removeEventListener("resize", updateScene);
    };
  }, [chapterScenes]);

  useEffect(() => {
    if (!prefs.focus) return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-afom-paragraph]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveParagraph(Number((visible.target as HTMLElement).dataset.afomParagraph ?? 0));
      },
      { rootMargin: "-38% 0px -38% 0px", threshold: [0, 0.25, 0.6] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [prefs.focus]);

  useEffect(() => {
    if (prefs.motion) void videoRef.current?.play().catch(() => {});
    else videoRef.current?.pause();
  }, [prefs.motion]);

  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanelOpen(false);
      if (event.key === "Tab" && panelRef.current) {
        const controls = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled), a[href]"));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("afom-observation-open");
    window.setTimeout(() => panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("afom-observation-open");
    };
  }, [panelOpen]);

  function updatePrefs(next: Partial<Preferences>) {
    setPrefs((current) => ({ ...current, ...next }));
    playGlassSound("select");
  }

  function openPanel(panel: PanelKey = "reading") {
    setActivePanel(panel);
    setPanelOpen(true);
    playGlassSound("open");
  }

  function closePanel() {
    setPanelOpen(false);
    playGlassSound("close");
  }

  function resumeReading() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * (savedPlace / 100), behavior: prefs.motion ? "smooth" : "auto" });
    setResumeVisible(false);
    playGlassSound("travel");
  }

  function toggleHeldPassage(index: number) {
    setHeldPassages((current) => {
      const next = current.includes(index) ? current.filter((value) => value !== index) : [...current, index];
      try { window.localStorage.setItem(SAVED_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    playGlassSound(heldPassages.includes(index) ? "close" : "reveal");
  }

  function renderEnchantedText(text: string, index: number): ReactNode[] {
    return text.split(lensPattern).filter(Boolean).map((part, partIndex) => {
      const normalized = part.startsWith("Judgment") ? "Judgment" : part.startsWith("pledge") ? "pledge" : part;
      const entry = glossary[normalized];
      if (!entry) return <Fragment key={`${index}-${partIndex}`}>{part}</Fragment>;
      return <button className="afom-lens-term" type="button" key={`${index}-${partIndex}`} onClick={() => { setLensTerm(normalized); playGlassSound("reveal"); }}>{part}</button>;
    });
  }

  const activeSceneData = chapterScenes.find((scene) => scene.key === activeScene) ?? chapterScenes[0]!;
  const lens = lensTerm ? glossary[lensTerm] : null;
  const knownProgress = Math.max(progress, savedPlace);

  return (
    <main
      className="afom-reader afom-novel-mode"
      data-theme={prefs.theme}
      data-font={prefs.font}
      data-width={prefs.width}
      data-font-step={prefs.fontStep}
      data-focus={prefs.focus ? "on" : "off"}
      data-scene={activeScene}
      data-second-gaze={secondGaze ? "on" : "off"}
    >
      <div className="afom-scene-aura" aria-hidden="true" />
      <div className="afom-reading-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
        <div className="afom-progress-stars">{chapterScenes.map((scene) => <i key={scene.key} className={chapterScenes.indexOf(scene) / Math.max(1, chapterScenes.length - 1) * 100 <= progress ? "is-passed" : ""} style={{ left: `${chapterScenes.indexOf(scene) / Math.max(1, chapterScenes.length - 1) * 100}%` }} />)}</div>
      </div>
      <header className="afom-reader-bar">
        <Link href="/novels/a-family-of-mortals" className="afom-reader-back"><span aria-hidden="true">←</span> A Family of Mortals</Link>
        <span className="afom-reader-progress">Chapter {chapterNumber} of 77 · {Math.round(progress)}%</span>
      </header>

      <div className="afom-scene-whisper" aria-live="polite"><span>{activeSceneData.label}</span><p>{activeSceneData.invitation}</p></div>

      <section className="afom-chapter-hero" aria-labelledby="chapter-title">
        {prefs.motion && config?.video ? (
          <video ref={videoRef} className="afom-chapter-video" autoPlay muted loop playsInline preload="metadata" poster={config?.poster ?? "/novels/a-family-of-mortals/chapter-1/marok-floating-over-foxnip.png"} aria-hidden="true">
            <source src={config.video} type="video/mp4" />
          </video>
        ) : <div className="afom-chapter-still" style={{ backgroundImage: `url('${config?.poster ?? "/novels/a-family-of-mortals/chapter-1/marok-floating-over-foxnip.png"}')` }} aria-hidden="true" />}
        <div className="afom-chapter-veil" aria-hidden="true" />
        <div className="afom-chapter-titleblock">
          <p>A Family of Mortals</p><span>Chapter {numberWord(chapterNumber)}</span><h1 id="chapter-title">{chapterTitle}</h1>
          <div className="afom-chapter-sigil" aria-hidden="true">◆</div>
          <p className="afom-chapter-invitation">{config?.invitation ?? "The Judgment begins in Paradise."}</p>
        </div>
      </section>

      {resumeVisible ? (
        <aside className="afom-resume" aria-label="Saved reading place">
          <div><span>The Glass kept your place</span><strong>{Math.round(savedPlace)}% through Chapter {numberWord(chapterNumber)}</strong></div>
          <button type="button" onClick={resumeReading}>Return</button>
          <button type="button" aria-label="Dismiss saved place" onClick={() => setResumeVisible(false)}>Not now</button>
        </aside>
      ) : null}

      <article className="afom-prose" aria-label={`Chapter ${chapterNumber}: ${chapterTitle}`}>
        {paragraphs.map((paragraph, index) => {
          const image = imagesByParagraph.get(index);
          const scene = chapterScenes.find((item) => item.start === index);
          const isDivine = chapterNumber === 1 && (index === 22 || index === 23 || index === 53);
          const isWar = chapterNumber === 1 && (index === 15 || index === 18 || index === 20);
          return (
            <div className="afom-prose-beat" key={index} data-afom-scene={scene?.key}>
              {scene && index !== 0 ? <div className="afom-scene-threshold"><span>{scene.label}</span><p>{scene.invitation}</p><button type="button" disabled title="Narration master required">Listen from here · Voice master pending</button></div> : null}
              {image && prefs.showImages ? (
                <figure className={`${image.portrait ? "afom-story-image afom-story-image-portrait" : "afom-story-image"}${prefs.motion ? " is-living" : ""}`}>
                  <img src={image.src} alt={image.alt} loading="lazy" />
                  <div className="afom-living-light" aria-hidden="true" />
                  <figcaption>Witnessed in the Glass</figcaption>
                </figure>
              ) : null}
              <p
                id={scene ? `scene-${scene.key}` : undefined}
                className={`${index === 0 ? "afom-dropcap " : ""}${prefs.focus && index === activeParagraph ? "is-witnessed " : ""}${isDivine ? "is-beauty-voice " : ""}${isWar ? "is-war-voice" : ""}`.trim()}
                data-afom-paragraph={index}
                data-afom-scene={scene?.key}
              >{renderEnchantedText(paragraph, index)}</p>
              {holdablePassages.has(index) ? <button className="afom-hold-passage" type="button" aria-pressed={heldPassages.includes(index)} onClick={() => toggleHeldPassage(index)}>{heldPassages.includes(index) ? "Held in the Glass" : "Hold this passage in the Glass"}</button> : null}
              {chapterNumber === 1 && secondGaze && (index === 15 || index === 53 || index === 73) ? <aside className="afom-second-gaze"><span>Second Gaze</span><p>{index === 15 ? "War watches Earth through a mirror, but the chapter is quietly asking who is truly being observed." : index === 53 ? "Their forms change while their recognition of one another does not. Divinity resides in the bond, not the vessel." : "The prayer is answered literally—and abandoned morally. Divine attention is not divine care."}</p></aside> : null}
            </div>
          );
        })}
      </article>

      <section className={`afom-chapter-relic${relicUnlocked ? " is-unlocked" : ""}`} aria-labelledby="afom-relic-title">
        <span>Chapter Relic · {String(chapterNumber).padStart(2, "0")}</span><h2 id="afom-relic-title">{config?.relicTitle ?? "The Indifference of Gods"}</h2>
        <blockquote>{config?.relicQuote ?? "“They didn’t know how indifferent gods are to mortals.”"}</blockquote>
        <p>{relicUnlocked ? "The first record has entered your Sacred Archive." : "Complete the chapter to unseal this record."}</p>
        <button type="button" disabled={!relicUnlocked} onClick={() => openPanel("archive")}>{relicUnlocked ? "Open the Sacred Archive" : "Relic Sealed"}</button>
      </section>

      <footer className="afom-chapter-end">
        <span aria-hidden="true">✦</span><p>End of Chapter {numberWord(chapterNumber)}</p>
        {chapterNumber < 8 ? (
          <Link className="afom-next-chapter" href={`/novels/a-family-of-mortals/read/chapter-${chapterNumber + 1}`}>
            Enter Chapter {numberWord(chapterNumber + 1)}
          </Link>
        ) : (
          <button type="button" disabled>Chapter {numberWord(chapterNumber + 1)} · In production</button>
        )}
        <Link href="/novels/a-family-of-mortals">Return to the sealed account</Link>
      </footer>

      <nav className="afom-observation-dock" aria-label="Observation Mode quick controls">
        <button type="button" onClick={() => openPanel("voice")}><span>Voice</span><strong>Awaiting master</strong></button>
        <button className="afom-observation-orb" type="button" aria-expanded={panelOpen} onClick={() => panelOpen ? closePanel() : openPanel()}>
          <span>Observation Mode</span><strong>{panelOpen ? "Close the Glass" : "Open the Glass"}</strong>
        </button>
        <button type="button" aria-pressed={prefs.focus} onClick={() => updatePrefs({ focus: !prefs.focus })}><span>Focus</span><strong>{prefs.focus ? "Witnessing" : "Free reading"}</strong></button>
        <button type="button" onClick={() => openPanel("archive")}><span>Archive</span><strong>{heldPassages.length} held · {relicUnlocked ? "1 relic" : "sealed"}</strong></button>
      </nav>

      {lens ? <aside className="afom-lens-card" role="dialog" aria-modal="false" aria-label={`${lens.title} definition`}><button type="button" onClick={() => setLensTerm(null)}>Close</button><span>{lens.kind}</span><h2>{lens.title}</h2><p>{lens.body}</p></aside> : null}

      {panelOpen ? (
        <div className="afom-observation-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closePanel(); }}>
          <section className="afom-observation-panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="afom-observation-title">
            <header>
              <div><span>The Glass in Hand</span><h2 id="afom-observation-title">Observation Mode</h2><p>Shape the telling without disturbing the tale.</p></div>
              <button type="button" onClick={closePanel}>Close</button>
            </header>
            <div className="afom-observation-tabs" role="tablist" aria-label="Observation controls">
              {(["reading", "atmosphere", "voice", "archive"] as const).map((tab) => (
                <button key={tab} type="button" role="tab" aria-selected={activePanel === tab} onClick={() => setActivePanel(tab)}>{tab}</button>
              ))}
            </div>

            {activePanel === "reading" ? (
              <div className="afom-control-groups">
                <fieldset><legend>Text size</legend><div className="afom-segmented">
                  {[0, 1, 2].map((step) => <button key={step} type="button" aria-pressed={prefs.fontStep === step} onClick={() => updatePrefs({ fontStep: step })}>{["Quiet", "Balanced", "Grand"][step]}</button>)}
                </div></fieldset>
                <fieldset><legend>Page measure</legend><div className="afom-segmented">
                  {(["intimate", "balanced", "expansive"] as const).map((width) => <button key={width} type="button" aria-pressed={prefs.width === width} onClick={() => updatePrefs({ width })}>{width}</button>)}
                </div></fieldset>
                <fieldset><legend>Type</legend><div className="afom-segmented">
                  <button type="button" aria-pressed={prefs.font === "literary"} onClick={() => updatePrefs({ font: "literary" })}>Literary</button>
                  <button type="button" aria-pressed={prefs.font === "readable"} onClick={() => updatePrefs({ font: "readable" })}>Readable</button>
                </div></fieldset>
                <label className="afom-switch-row"><span><strong>Witness focus</strong><small>Let the current passage rise from the page.</small></span><input type="checkbox" checked={prefs.focus} onChange={(event) => updatePrefs({ focus: event.target.checked })} /></label>
              </div>
            ) : null}

            {activePanel === "atmosphere" ? (
              <div className="afom-control-groups">
                <fieldset><legend>Reading atmosphere</legend><div className="afom-theme-grid">
                  {(["night", "moonstone", "parchment"] as const).map((theme) => <button key={theme} type="button" aria-pressed={prefs.theme === theme} data-swatch={theme} onClick={() => updatePrefs({ theme })}><span /><strong>{theme === "night" ? "Night Glass" : theme}</strong></button>)}
                </div></fieldset>
                <label className="afom-switch-row"><span><strong>Story images</strong><small>Reveal the chapter’s visual witnesses.</small></span><input type="checkbox" checked={prefs.showImages} onChange={(event) => updatePrefs({ showImages: event.target.checked })} /></label>
                <label className="afom-switch-row"><span><strong>Living motion</strong><small>Allow the opening vision to move.</small></span><input type="checkbox" checked={prefs.motion} onChange={(event) => updatePrefs({ motion: event.target.checked })} /></label>
              </div>
            ) : null}

            {activePanel === "voice" ? (
              <div className="afom-voice-chamber">
                <span>Narrated by Gaze Glass</span><h3>The voice is being summoned.</h3>
                <p>Your cloned narration will live here as one uninterrupted performance, with scene-level “listen from here” witnessing throughout the prose.</p>
                <div className="afom-audio-preview" aria-disabled="true"><button type="button" disabled>Play</button><div><strong>Chapter {numberWord(chapterNumber)} · {chapterTitle}</strong><span>Master narration not yet connected</span></div><time>—:—</time></div>
              </div>
            ) : null}

            {activePanel === "archive" ? (
              <div className="afom-archive">
                <div className="afom-archive-heading"><span>The Sacred Archive</span><h3>What the Glass has revealed.</h3><p>Records appear only after the story permits them to be known.</p></div>
                <div className="afom-archive-grid">
                  <article><span>{config?.focusKind ?? "Spirit"}</span><strong>{config?.focusName ?? "Marok"}</strong><p>{config?.focusDescription ?? "Divine fox. Judgment designer. Newly appointed servant of War and Beauty."}</p></article>
                  <article className={knownProgress > 18 ? "" : "is-sealed"}><span>Cardinal Gods</span><strong>{knownProgress > 18 ? "War & Beauty" : "Unwitnessed deities"}</strong><p>{knownProgress > 18 ? "Consorts whose love survives every form—and whose attention may destroy what it touches." : "Continue reading to reveal this record."}</p></article>
                  <article className={relicUnlocked ? "" : "is-sealed"}><span>Chapter Relic</span><strong>{relicUnlocked ? (config?.relicTitle ?? "The Indifference of Gods") : "Sealed until completion"}</strong><p>{relicUnlocked ? (config?.relicMeaning ?? "A prayer can be answered without mercy.") : `Continue witnessing Chapter ${numberWord(chapterNumber)}.`}</p></article>
                </div>
                <section className="afom-held-records"><h4>Held passages</h4>{heldPassages.length ? heldPassages.map((index) => <blockquote key={index}>{paragraphs[index]}</blockquote>) : <p>No passages held yet. Look for “Hold this passage in the Glass” as you read.</p>}</section>
                <label className={`afom-switch-row${relicUnlocked ? "" : " is-locked"}`}><span><strong>Second Gaze</strong><small>{relicUnlocked ? "Reveal deeper connections during a return reading." : "Complete the chapter to awaken a deeper reading."}</small></span><input type="checkbox" disabled={!relicUnlocked} checked={secondGaze} onChange={(event) => { setSecondGaze(event.target.checked); try { window.localStorage.setItem(SECOND_GAZE_KEY, event.target.checked ? "on" : "off"); } catch {} }} /></label>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </main>
  );
}
