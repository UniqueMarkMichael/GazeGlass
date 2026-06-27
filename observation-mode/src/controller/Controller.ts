import { createAnnouncer } from "../a11y/announcer";
import { trapFocus } from "../a11y/focusTrap";
import { parseHtmlBody } from "../content/parseHtmlBody";
import { renderBlocks } from "../content/renderBlocks";
import type { BlockModel, ObservationManifest } from "../content/types";
import { COMPONENT_STYLES } from "../styles/shared";
import { COPY } from "../ui/copy";
import { EventBus, type OMEvent, type OMEventName } from "./eventBus";
import { transition, type MachineEvent, type MachineState, type PanelId } from "./stateMachine";

export interface ObservationModeControllerOptions {
  host: HTMLElement;
  manifest?: ObservationManifest;
}

type FocusMode = "off" | "spotlight" | "band" | "ruler";
type FocusChangeSource = "dock" | "panel" | "restore";
type ReadingTrackId = "reading-mode" | "reading-room";
type ReadingPace = "drift" | "focus" | "sprint" | "rest";
type PagePromise = "scene" | "time" | "finish";
type PleasureMode = "wonder" | "calm" | "intensity" | "tenderness";
type ObservationTheme = "obsidian" | "parchment" | "moonlight";
type ReadAloudMode = "voice-follow" | "spoken-playback";
type ReadAloudRecognitionConstructor = new () => ReadAloudRecognition;
type ReadAloudRecognitionAlternative = {
  transcript: string;
  confidence?: number;
};
type ReadAloudRecognitionResult = {
  readonly isFinal: boolean;
  readonly length: number;
  readonly [index: number]: ReadAloudRecognitionAlternative | undefined;
};
type ReadAloudRecognitionEvent = Event & {
  readonly resultIndex: number;
  readonly results: {
    readonly length: number;
    readonly [index: number]: ReadAloudRecognitionResult | undefined;
  };
};
type ReadAloudRecognitionErrorEvent = Event & {
  readonly error?: string;
  readonly message?: string;
};
type ReadAloudRecognition = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: ((event: Event) => void) | null;
  onerror: ((event: ReadAloudRecognitionErrorEvent) => void) | null;
  onresult: ((event: ReadAloudRecognitionEvent) => void) | null;
  abort(): void;
  start(): void;
  stop(): void;
};
type ReadAloudSentence = {
  index: number;
  oid: string;
  tokens: string[];
  sentenceElement: HTMLElement;
  blockElement: HTMLElement;
};
type SceneBeat = {
  index: number;
  total: number;
  startIndex: number;
  label: string;
};
type ResumeBookmark = {
  blockId: string;
  cue: string;
  updatedAt: number;
};

type ReaderPrefs = {
  focusMode?: FocusMode;
  readingPace?: ReadingPace;
  pagePromise?: PagePromise;
  pleasureMode?: PleasureMode;
  observationTheme?: ObservationTheme;
  textSizeRem?: number;
  generousSpacing?: boolean;
  showImages?: boolean;
  audioMuted?: boolean;
  audioTrackId?: ReadingTrackId;
};

const PREFS_KEY = "gg.om.prefs";
const RESUME_KEY_PREFIX = "gg.om.resume.";
const SITE_SOUND_PREF_KEY = "gaze-glass.sound.v1";
const FOCUS_MODES = new Set<FocusMode>(["off", "spotlight", "band", "ruler"]);
const READING_PACES = new Set<ReadingPace>(["drift", "focus", "sprint", "rest"]);
const PAGE_PROMISES = new Set<PagePromise>(["scene", "time", "finish"]);
const PLEASURE_MODES = new Set<PleasureMode>(["wonder", "calm", "intensity", "tenderness"]);
const OBSERVATION_THEMES = new Set<ObservationTheme>(["obsidian", "parchment", "moonlight"]);
const DEFAULT_READING_TRACK_ID: ReadingTrackId = "reading-mode";
const DEFAULT_READING_PACE: ReadingPace = "drift";
const DEFAULT_PAGE_PROMISE: PagePromise = "scene";
const DEFAULT_PLEASURE_MODE: PleasureMode = "wonder";
const PAGE_PROMISE_DURATION_MS = 5 * 60 * 1000;
const READING_PACE_PRESETS: Record<
  ReadingPace,
  { focusMode: FocusMode; generousSpacing: boolean; fontSizeRem: number; trackId: ReadingTrackId }
> = {
  drift: { focusMode: "off", generousSpacing: true, fontSizeRem: 1.22, trackId: "reading-room" },
  focus: { focusMode: "ruler", generousSpacing: true, fontSizeRem: 1.18, trackId: "reading-mode" },
  sprint: { focusMode: "band", generousSpacing: false, fontSizeRem: 1.1, trackId: "reading-mode" },
  rest: { focusMode: "spotlight", generousSpacing: true, fontSizeRem: 1.28, trackId: "reading-room" },
};
const READING_TRACKS: Array<{
  id: ReadingTrackId;
  label: string;
  src: string;
  gainDb: number;
}> = [
  {
    id: "reading-mode",
    label: "Focus #1",
    src: "/audio/focus/sacred-glass-reading-mode.mp3",
    gainDb: -8,
  },
  {
    id: "reading-room",
    label: "Focus #2",
    src: "/audio/focus/sacred-glass-reading-room.mp3",
    gainDb: -8,
  },
];
const PLEASURE_PRESETS: Record<
  PleasureMode,
  {
    pace: ReadingPace;
    focusMode: FocusMode;
    generousSpacing: boolean;
    trackId: ReadingTrackId;
    theme: ObservationTheme;
    status: string;
  }
> = {
  wonder: {
    pace: "drift",
    focusMode: "off",
    generousSpacing: true,
    trackId: "reading-room",
    theme: "moonlight",
    status: "Read for wonder",
  },
  calm: {
    pace: "rest",
    focusMode: "spotlight",
    generousSpacing: true,
    trackId: "reading-room",
    theme: "moonlight",
    status: "Read for calm",
  },
  intensity: {
    pace: "sprint",
    focusMode: "band",
    generousSpacing: false,
    trackId: "reading-mode",
    theme: "obsidian",
    status: "Stay with the intensity",
  },
  tenderness: {
    pace: "rest",
    focusMode: "spotlight",
    generousSpacing: true,
    trackId: "reading-room",
    theme: "parchment",
    status: "Stay with the tenderness",
  },
};

export class ObservationModeController {
  private state: MachineState = "idle";
  private readonly bus: EventBus;
  private readonly shadow: ShadowRoot;
  private readonly entryMount: HTMLElement;
  private readonly root: HTMLElement;
  private readonly announce: (message: string) => void;
  private releaseTrap: (() => void) | null = null;
  private sourceArticle: HTMLElement | null = null;
  private readingArticle: HTMLElement | null = null;
  private models: BlockModel[] = [];
  private manifest: ObservationManifest | null;
  private previousActiveElement: Element | null = null;
  private focusMode: FocusMode = "off";
  private readingPace: ReadingPace = DEFAULT_READING_PACE;
  private pagePromise: PagePromise = DEFAULT_PAGE_PROMISE;
  private pleasureMode: PleasureMode = DEFAULT_PLEASURE_MODE;
  private observationTheme: ObservationTheme = PLEASURE_PRESETS[DEFAULT_PLEASURE_MODE].theme;
  private textSizeRem = 1.18;
  private generousSpacing = false;
  private showImages = false;
  private activeBlockId: string | null = null;
  private activeBlockFrame: number | null = null;
  private releaseActiveBlockTracker: (() => void) | null = null;
  private sceneBeats: SceneBeat[] = [];
  private readingStartedAt = 0;
  private promiseStartBeatIndex = 1;
  private promiseTimer: number | null = null;
  private lastRestBeatIndex = 1;
  private shownRestBeatIndexes = new Set<number>();
  private resumePromptActive = false;
  private lostAnchorTimer: number | null = null;
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private atmosphereGain: GainNode | null = null;
  private atmosphereOscillators: OscillatorNode[] = [];
  private atmosphereNoise: AudioBufferSourceNode | null = null;
  private atmosphereAudio: HTMLAudioElement | null = null;
  private narrationAudio: HTMLAudioElement | null = null;
  private atmosphereOn = false;
  private narrationOn = false;
  private readAloudRecognition: ReadAloudRecognition | null = null;
  private readAloudOn = false;
  private readAloudStopping = false;
  private readAloudMode: ReadAloudMode | null = null;
  private readAloudCursor = 0;
  private readAloudFinalTranscript = "";
  private readAloudUtterance: SpeechSynthesisUtterance | null = null;
  private audioMuted = false;
  private atmosphereTrackId: ReadingTrackId = DEFAULT_READING_TRACK_ID;
  private activeNarrationOid: string | null = null;
  private scrollLock:
    | {
        scrollY: number;
        htmlOverflow: string;
        htmlOverscrollBehavior: string;
        bodyOverflow: string;
        bodyPosition: string;
        bodyTop: string;
        bodyWidth: string;
      }
    | null = null;

  constructor(private readonly options: ObservationModeControllerOptions) {
    this.manifest = options.manifest ?? null;
    this.shadow = options.host.attachShadow({ mode: "open" });
    this.entryMount = document.createElement("div");
    this.entryMount.className = "om-entry-mount";
    this.root = document.createElement("div");
    this.root.className = "om-root";
    this.root.dataset.omTheme = "obsidian";
    this.root.tabIndex = -1;
    this.root.setAttribute("role", "dialog");
    this.shadow.append(this.createStyleElement(), this.entryMount, document.createElement("slot"), this.root);
    this.bus = new EventBus(this.root);
    this.announce = createAnnouncer(this.root);
  }

  connect(): void {
    this.sourceArticle = this.options.host.querySelector<HTMLElement>(".om-source");
    if (!this.sourceArticle) {
      this.emitError("Observation Mode requires an .om-source article.", true);
      return;
    }

    this.sourceArticle.classList.add("om-source");
    this.models = parseHtmlBody(this.sourceArticle);
    this.loadPrefs();
    this.applyPrefsToRoot();
    this.renderEntryButton();
  }

  disconnect(): void {
    this.releaseTrap?.();
    this.releaseTrap = null;
    this.stopActiveBlockTracker();
    this.stopPromiseTimer();
    this.stopAllAudio();
    this.unlockHostExperience();
  }

  getState(): MachineState {
    return this.state;
  }

  setManifest(manifest: ObservationManifest): void {
    this.manifest = manifest;
    this.renderEntryButton();
  }

  on<T extends OMEventName>(name: T, cb: (event: OMEvent<T>) => void): () => void {
    return this.bus.on(name, cb);
  }

  async open(): Promise<void> {
    if (this.state !== "idle") return;
    this.previousActiveElement = document.activeElement;
    this.dispatch({ type: "OPEN" });
    this.playInterfaceSound("open");
    this.renderThreshold();
    this.lockHostExperience();
    this.root.classList.add("is-open");
    this.sourceArticle?.setAttribute("aria-hidden", "true");
    this.releaseTrap = trapFocus(this.root);
    this.root.focus();
    this.announce("Entering Observation Mode.");
  }

  async exit(): Promise<void> {
    if (this.state === "idle" || this.state === "exiting") return;
    this.closePanel(false);
    this.playInterfaceSound("close");
    this.stopAllAudio();
    this.dispatch({ type: "EXIT" });
    this.root.classList.remove("is-open");
    this.sourceArticle?.removeAttribute("aria-hidden");
    this.stopActiveBlockTracker();
    this.stopPromiseTimer();
    this.unlockHostExperience();
    this.releaseTrap?.();
    this.releaseTrap = null;
    await this.delay(0);
    this.dispatch({ type: "TEARDOWN_DONE" });
    this.root.replaceChildren();
    if (this.previousActiveElement instanceof HTMLElement) {
      this.previousActiveElement.focus();
    }
  }

  openPanel(panelId: PanelId): void {
    if (this.state !== "panel") {
      this.dispatch({ type: "OPEN_PANEL", panelId });
    }
    this.renderPanel(panelId);
    this.bus.emit("panelchange", { panelId });
  }

  closePanel(announce = true): void {
    this.root.querySelector(".om-panel")?.remove();
    if (this.state === "panel") {
      this.dispatch({ type: "CLOSE_PANEL" });
      this.bus.emit("panelchange", { panelId: null });
      if (announce) {
        this.playInterfaceSound("close");
        this.announce("Panel closed.");
      }
    }
    this.updateFocusControls();
  }

  private dispatch(event: MachineEvent): void {
    const nextState = transition(this.state, event);
    if (nextState === this.state) return;
    this.state = nextState;
    this.bus.emit("statechange", { state: nextState });
  }

  private isState(state: MachineState): boolean {
    return this.state === state;
  }

  private renderEntryButton(): void {
    const label = `Immersive reading · ${this.getReadingTime()} min`;
    const existingButton = this.entryMount.querySelector<HTMLButtonElement>(".om-entry");
    if (existingButton) {
      const labelNode = existingButton.querySelector<HTMLElement>("[data-om-entry-meta]");
      if (labelNode) labelNode.textContent = label;
      return;
    }

    const button = document.createElement("button");
    button.className = "om-entry";
    button.type = "button";
    button.setAttribute("aria-label", COPY.openAria);
    button.innerHTML = `
      <span class="om-entry-glyph" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M3.4 12s3.1-5.1 8.6-5.1 8.6 5.1 8.6 5.1-3.1 5.1-8.6 5.1S3.4 12 3.4 12Z" />
          <circle cx="12" cy="12" r="2.45" />
        </svg>
      </span>
      <span class="om-entry-copy">
        <strong>${COPY.open}</strong>
        <span data-om-entry-meta>${label}</span>
      </span>
    `;
    button.addEventListener("click", () => void this.open());
    this.entryMount.append(button);
  }

  private renderThreshold(): void {
    this.root.replaceChildren();
    this.announce("Opening the Glass.");

    const plate = document.createElement("section");
    plate.className = "om-threshold";
    plate.innerHTML = `
      <div class="om-plate">
        <p>${COPY.plateObservation} ${this.getObservationNumber()}</p>
        <h2>${this.getTitle()}</h2>
        <p>${this.getRealm()} · ${this.getMagnitude()}</p>
        ${this.manifest?.deity ? `<p>Associated with the God of ${this.manifest.deity}</p>` : ""}
        <p>${COPY.recordedBy}</p>
        <div class="om-mode-intro" aria-label="${COPY.modeName}">
          <strong>${COPY.modeName}</strong>
          <span>${COPY.modeDescription}</span>
        </div>
        <div class="om-promise" role="radiogroup" aria-label="${COPY.promiseKicker}">
          <p class="om-panel-kicker">${COPY.promiseKicker}</p>
          <p>${COPY.promiseDescription}</p>
          <div class="om-promise-options">
            <button type="button" role="radio" aria-checked="false" data-promise="scene" aria-label="${COPY.promiseOneSceneAria}">${COPY.promiseOneScene}</button>
            <button type="button" role="radio" aria-checked="false" data-promise="time" aria-label="${COPY.promiseFiveMinutesAria}">${COPY.promiseFiveMinutes}</button>
            <button type="button" role="radio" aria-checked="false" data-promise="finish" aria-label="${COPY.promiseFinishAria}">${COPY.promiseFinish}</button>
          </div>
        </div>
        <div class="om-pleasure" role="radiogroup" aria-label="${COPY.pleasureKicker}">
          <p class="om-panel-kicker">${COPY.pleasureKicker}</p>
          <p>${COPY.pleasureDescription}</p>
          <div class="om-pleasure-options">
            <button type="button" role="radio" aria-checked="false" data-pleasure="wonder" aria-label="${COPY.pleasureWonderAria}">${COPY.pleasureWonder}</button>
            <button type="button" role="radio" aria-checked="false" data-pleasure="calm" aria-label="${COPY.pleasureCalmAria}">${COPY.pleasureCalm}</button>
            <button type="button" role="radio" aria-checked="false" data-pleasure="intensity" aria-label="${COPY.pleasureIntensityAria}">${COPY.pleasureIntensity}</button>
            <button type="button" role="radio" aria-checked="false" data-pleasure="tenderness" aria-label="${COPY.pleasureTendernessAria}">${COPY.pleasureTenderness}</button>
          </div>
        </div>
        <div class="om-actions">
          <button type="button" data-action="skip" aria-label="${COPY.skipAria}">${COPY.skip}</button>
          <button type="button" data-action="exit" aria-label="${COPY.leaveAria}">${COPY.leave}</button>
        </div>
      </div>
    `;

    plate.querySelector<HTMLButtonElement>("[data-action='skip']")?.addEventListener("click", () => {
      this.playInterfaceSound("select");
      this.dispatch({ type: "THRESHOLD_DONE" });
      this.renderWitnessing();
    });
    plate.querySelectorAll<HTMLButtonElement>("[data-promise]").forEach((button) => {
      button.addEventListener("click", () => this.setPagePromise(button.dataset.promise));
    });
    plate.querySelectorAll<HTMLButtonElement>("[data-pleasure]").forEach((button) => {
      button.addEventListener("click", () => this.setPleasureMode(button.dataset.pleasure));
    });
    plate.querySelector<HTMLButtonElement>("[data-action='exit']")?.addEventListener("click", () => void this.exit());
    plate.addEventListener("keydown", (event) => {
      if (event.key === "Escape") void this.exit();
    });
    this.root.append(plate);
    this.updatePromiseControls();
    this.updatePleasureControls();
    plate.querySelector<HTMLButtonElement>("[data-action='skip']")?.focus();
  }

  private renderWitnessing(): void {
    this.root.replaceChildren();
    const shell = document.createElement("section");
    shell.className = "om-witnessing";
    shell.innerHTML = `
      <article class="om-reading" tabindex="0" aria-label="${this.getTitle()}">
        <h1>${this.getTitle()}</h1>
      </article>
      <div class="om-dock" role="toolbar" aria-label="Observation controls">
        <button type="button" data-action="exit" aria-label="${COPY.leaveAria}">${COPY.leave}</button>
        <span class="om-status">
          <span data-status-scene>${COPY.plateObservation} ${this.getObservationNumber()}</span>
          <span data-status-promise>${this.getPromiseStatusText()}</span>
          <span data-status-pleasure>${this.getPleasureStatusText()}</span>
        </span>
        <button type="button" data-action="lost" aria-label="${COPY.lostAria}">${COPY.lost}</button>
        <button type="button" data-panel="sound" aria-label="${COPY.soundAria}" aria-haspopup="dialog" aria-expanded="false">${COPY.sound}</button>
        <span class="om-split-control" role="group" aria-label="Focus controls">
          <button
            class="om-lantern-toggle"
            type="button"
            data-action="lantern"
            aria-label="${COPY.lanternAriaOff}"
            aria-pressed="false"
          >
            <span class="om-lantern-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path class="om-lantern-shell" d="M9 3.7h6M10 6.1h4l1.6 3.1v6.8L12 20.3 8.4 16V9.2L10 6.1Z" />
                <path class="om-lantern-fill" d="M12 9.1c1.35 1.4 2.05 2.65 2.05 3.77A2.05 2.05 0 0 1 12 14.97a2.05 2.05 0 0 1-2.05-2.1c0-1.12.7-2.37 2.05-3.77Z" />
                <path d="M8.4 16h7.2" />
              </svg>
            </span>
            <span class="om-lantern-label">${COPY.lantern}</span>
          </button>
          <button
            class="om-focus-more"
            type="button"
            data-panel="focus"
            aria-label="${COPY.focusMoreAria}"
            aria-haspopup="dialog"
            aria-expanded="false"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path d="M5.5 7.5 10 12l4.5-4.5" />
            </svg>
          </button>
        </span>
        ${
          this.hasImageBlocks()
            ? `<button type="button" data-action="images" aria-label="${COPY.imagesAriaOff}" aria-pressed="false">${COPY.images}</button>`
            : ""
        }
        <button type="button" data-panel="display" aria-label="${COPY.textAria}" aria-haspopup="dialog" aria-expanded="false">${COPY.text}</button>
      </div>
    `;

    this.readingArticle = shell.querySelector<HTMLElement>(".om-reading");
    if (this.readingArticle && this.manifest?.body?.length) {
      this.models = renderBlocks(this.manifest.body, this.readingArticle, this.manifest.glossary);
    } else if (this.readingArticle && this.sourceArticle) {
      for (const node of Array.from(this.sourceArticle.children)) {
        this.readingArticle.append(node.cloneNode(true));
      }
      this.models = parseHtmlBody(this.readingArticle);
    }
    this.sceneBeats = this.createSceneBeats();
    this.readingStartedAt = Date.now();
    this.promiseStartBeatIndex = this.getActiveSceneBeat()?.index ?? 1;
    this.lastRestBeatIndex = this.promiseStartBeatIndex;
    this.shownRestBeatIndexes.clear();
    this.updateSceneStatus();
    this.startPromiseTimer();

    shell.querySelector<HTMLButtonElement>("[data-action='exit']")?.addEventListener("click", () => void this.exit());
    shell.querySelector<HTMLButtonElement>("[data-action='lost']")?.addEventListener("click", () => this.showLostCard());
    shell.querySelector<HTMLButtonElement>("[data-action='lantern']")?.addEventListener("click", () => this.toggleLantern());
    shell.querySelector<HTMLButtonElement>("[data-action='images']")?.addEventListener("click", () => this.toggleImages());
    shell.querySelectorAll<HTMLButtonElement>("[data-panel]").forEach((button) => {
      button.addEventListener("click", () => {
        this.playInterfaceSound("panel");
        this.openPanel(button.dataset.panel as PanelId);
      });
    });
    shell.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (this.state === "panel") {
        this.closePanel();
      } else {
        void this.exit();
      }
    });

    this.root.append(shell);
    this.applyPrefsToRoot();
    this.updateFocusControls();
    this.updateImageControls();
    this.startActiveBlockTracker();
    this.maybeShowResumeCard();
    this.readingArticle?.focus();
  }

  private renderPanel(panelId: PanelId): void {
    this.root.querySelector(".om-panel")?.remove();
    const panel = document.createElement("section");
    panel.className = "om-panel";
    panel.dataset.panelId = panelId;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");

    if (panelId === "sound") {
      const readAloudAvailable = this.isReadAloudAvailable();
      panel.setAttribute("aria-label", COPY.soundPanelAria);
      panel.innerHTML = `
        <button class="om-panel-close" type="button" aria-label="${COPY.closePanelAria}">${COPY.close}</button>
        <p class="om-panel-kicker">${COPY.sound}</p>
        <h2>${COPY.sound}</h2>
        <p data-sound-description>${this.getSoundPanelDescription()}</p>
        <p class="om-panel-field-label">${COPY.focusTrack}</p>
        <div class="om-panel-actions om-audio-track-options" role="radiogroup" aria-label="${COPY.focusTrackGroupAria}">
          ${READING_TRACKS.map(
            (track) =>
              `<button type="button" role="radio" data-audio-track="${track.id}" aria-checked="${track.id === this.atmosphereTrackId}" aria-label="${track.label} focus track">${track.label}</button>`,
          ).join("")}
        </div>
        <div class="om-panel-actions">
          <button type="button" data-audio-action="atmosphere" aria-label="${COPY.atmosphereAria}" aria-pressed="${this.atmosphereOn}">${this.atmosphereOn ? COPY.pauseMusic : COPY.playMusic}</button>
          <button type="button" data-audio-action="read-aloud" aria-label="${this.getReadAloudAriaLabel(readAloudAvailable)}" aria-disabled="${!readAloudAvailable}" ${readAloudAvailable ? "" : "disabled"} aria-pressed="${this.readAloudOn}">${this.readAloudOn ? COPY.stopReading : COPY.readAloud}</button>
          <button type="button" data-audio-action="mute" aria-label="${COPY.muteAria}" aria-pressed="${this.audioMuted}">${COPY.mute}</button>
        </div>
        <p class="om-read-aloud-status" data-read-aloud-status>${this.getReadAloudStatus()}</p>
      `;
    } else if (panelId === "focus") {
      panel.setAttribute("aria-label", COPY.focusPanelAria);
      panel.innerHTML = `
        <button class="om-panel-close" type="button" aria-label="${COPY.closePanelAria}">${COPY.close}</button>
        <p class="om-panel-kicker">${COPY.focus}</p>
        <h2>${COPY.focus}</h2>
        <p>${COPY.focusDescription}</p>
        <div class="om-panel-actions om-focus-options" role="radiogroup" aria-label="${COPY.focusModeAria}">
          <button type="button" role="radio" aria-checked="false" data-focus-mode="off" aria-label="${COPY.offAria}">${COPY.off}</button>
          <button type="button" role="radio" aria-checked="false" data-focus-mode="spotlight" aria-label="${COPY.lanternPanelAria}">${COPY.lantern}</button>
          <button type="button" role="radio" aria-checked="false" data-focus-mode="band" aria-label="${COPY.bandAria}">${COPY.band}</button>
          <button type="button" role="radio" aria-checked="false" data-focus-mode="ruler" aria-label="${COPY.rulerAria}">${COPY.ruler}</button>
        </div>
      `;
    } else {
      panel.setAttribute("aria-label", COPY.textAria);
      panel.innerHTML = `
        <button class="om-panel-close" type="button" aria-label="${COPY.closePanelAria}">${COPY.close}</button>
        <p class="om-panel-kicker">${COPY.text}</p>
        <h2>${COPY.text}</h2>
        <p>${COPY.textDescription}</p>
        <p class="om-panel-field-label">${COPY.pace}</p>
        <div class="om-panel-actions om-pace-options" role="radiogroup" aria-label="${COPY.paceGroupAria}">
          <button type="button" role="radio" aria-checked="false" data-pace="drift" aria-label="${COPY.driftAria}">${COPY.drift}</button>
          <button type="button" role="radio" aria-checked="false" data-pace="focus" aria-label="${COPY.focusPaceAria}">${COPY.focusPace}</button>
          <button type="button" role="radio" aria-checked="false" data-pace="sprint" aria-label="${COPY.sprintAria}">${COPY.sprint}</button>
          <button type="button" role="radio" aria-checked="false" data-pace="rest" aria-label="${COPY.restAria}">${COPY.rest}</button>
        </div>
        <div class="om-panel-actions">
          <button type="button" data-theme="obsidian" aria-label="${COPY.obsidianAria}">${COPY.obsidian}</button>
          <button type="button" data-theme="parchment" aria-label="${COPY.parchmentAria}">${COPY.parchment}</button>
          <button type="button" data-theme="moonlight" aria-label="${COPY.moonlightAria}">${COPY.moonlight}</button>
        </div>
        <div class="om-panel-field">
          <span>${COPY.size}</span>
          <div class="om-stepper" role="group" aria-label="${COPY.sizeGroupAria}">
            <button type="button" data-size="-1" aria-label="${COPY.decreaseTextSizeAria}">−</button>
            <button type="button" data-size="1" aria-label="${COPY.increaseTextSizeAria}">+</button>
          </div>
        </div>
        <div class="om-panel-actions">
          <button type="button" data-spacing-toggle aria-label="${COPY.spacingAriaOff}" aria-pressed="false">${COPY.spacing}</button>
        </div>
      `;
    }

    panel.querySelector<HTMLButtonElement>(".om-panel-close")?.addEventListener("click", () => this.closePanel());
    panel.querySelectorAll<HTMLButtonElement>("[data-audio-action]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.disabled || button.getAttribute("aria-disabled") === "true") return;
        this.handleAudioAction(button.dataset.audioAction);
      });
    });
    panel.querySelectorAll<HTMLButtonElement>("[data-audio-track]").forEach((button) => {
      button.addEventListener("click", () => this.selectAtmosphereTrack(button.dataset.audioTrack));
    });
    panel.querySelectorAll<HTMLButtonElement>("[data-theme]").forEach((button) => {
      button.addEventListener("click", () => {
        this.observationTheme = this.parseObservationTheme(button.dataset.theme);
        this.applyPrefsToRoot();
        this.savePrefs();
        this.showToast(`${button.textContent ?? "Theme"} selected.`);
      });
    });
    panel.querySelectorAll<HTMLButtonElement>("[data-size]").forEach((button) => {
      button.addEventListener("click", () => {
        const direction = Number.parseInt(button.dataset.size ?? "0", 10);
        this.textSizeRem = Math.min(1.6, Math.max(1, this.textSizeRem + direction * 0.08));
        this.applyPrefsToRoot();
        this.savePrefs();
      });
    });
    panel.querySelectorAll<HTMLButtonElement>("[data-pace]").forEach((button) => {
      button.addEventListener("click", () => {
        this.setReadingPace(this.parseReadingPace(button.dataset.pace));
      });
    });
    panel.querySelectorAll<HTMLButtonElement>("[data-focus-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        const mode = this.parseFocusMode(button.dataset.focusMode);
        this.setFocusMode(mode, "panel");
      });
    });
    panel.querySelector<HTMLButtonElement>("[data-spacing-toggle]")?.addEventListener("click", () => {
      this.setGenerousSpacing(!this.generousSpacing);
    });
    panel.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.closePanel();
    });

    this.root.append(panel);
    this.updateFocusControls();
    panel.querySelector<HTMLElement>(".om-panel-close")?.focus();
  }

  private toggleLantern(): void {
    this.playInterfaceSound("select");
    this.setFocusMode(this.focusMode === "spotlight" ? "off" : "spotlight", "dock");
  }

  private toggleImages(): void {
    this.showImages = !this.showImages;
    this.playInterfaceSound(this.showImages ? "reveal" : "close");
    this.applyPrefsToRoot();
    this.updateImageControls();
    this.savePrefs();
    this.showToast(this.showImages ? COPY.imagesShownToast : COPY.imagesHiddenToast);
    this.scheduleActiveBlockUpdate();
  }

  private setFocusMode(mode: FocusMode, source: FocusChangeSource): void {
    const previousMode = this.focusMode;
    this.focusMode = mode;
    this.applyPrefsToRoot();
    this.updateFocusControls();
    this.savePrefs();
    this.scheduleActiveBlockUpdate();

    if (source !== "restore") {
      const message = this.focusToast(mode, previousMode);
      this.trackFocusChange(source);
      this.showToast(message);
      this.announce(message);
    }
  }

  private setGenerousSpacing(enabled: boolean): void {
    this.generousSpacing = enabled;
    this.applyPrefsToRoot();
    this.updateFocusControls();
    this.savePrefs();
    this.showToast(enabled ? COPY.spacingOnToast : COPY.spacingOffToast);
  }

  private parseFocusMode(value: string | undefined): FocusMode {
    return FOCUS_MODES.has(value as FocusMode) ? (value as FocusMode) : "off";
  }

  private parseReadingPace(value: string | undefined): ReadingPace {
    return READING_PACES.has(value as ReadingPace) ? (value as ReadingPace) : DEFAULT_READING_PACE;
  }

  private parsePagePromise(value: string | undefined): PagePromise {
    return PAGE_PROMISES.has(value as PagePromise) ? (value as PagePromise) : DEFAULT_PAGE_PROMISE;
  }

  private parsePleasureMode(value: string | undefined): PleasureMode {
    return PLEASURE_MODES.has(value as PleasureMode) ? (value as PleasureMode) : DEFAULT_PLEASURE_MODE;
  }

  private parseObservationTheme(value: string | undefined): ObservationTheme {
    return OBSERVATION_THEMES.has(value as ObservationTheme) ? (value as ObservationTheme) : "obsidian";
  }

  private parseTextSize(value: number | undefined, fallback = 1.18): number {
    return typeof value === "number" && Number.isFinite(value) ? Math.min(1.6, Math.max(1, value)) : fallback;
  }

  private setPagePromise(value: string | undefined): void {
    this.pagePromise = this.parsePagePromise(value);
    this.playInterfaceSound("select");
    this.updatePromiseControls();
    this.updateSceneStatus();
    this.savePrefs();
    const message = this.promiseToast(this.pagePromise);
    this.showToast(message);
    this.announce(message);
  }

  private setPleasureMode(value: string | undefined): void {
    this.pleasureMode = this.parsePleasureMode(value);
    this.applyPleasurePreset();
    this.playInterfaceSound("select");
    this.updatePleasureControls();
    this.updateFocusControls();
    this.updateSoundControls();
    this.updateSceneStatus();
    this.savePrefs();
    const message = this.pleasureToast(this.pleasureMode);
    this.showToast(message);
    this.announce(message);
  }

  private applyPleasurePreset(): void {
    const preset = PLEASURE_PRESETS[this.pleasureMode];
    this.readingPace = preset.pace;
    this.focusMode = preset.focusMode;
    this.generousSpacing = preset.generousSpacing;
    this.atmosphereTrackId = preset.trackId;
    this.observationTheme = preset.theme;
    this.applyPrefsToRoot();
    this.scheduleActiveBlockUpdate();
  }

  private setReadingPace(pace: ReadingPace): void {
    const preset = READING_PACE_PRESETS[pace];
    this.readingPace = pace;
    this.focusMode = preset.focusMode;
    this.generousSpacing = preset.generousSpacing;
    this.atmosphereTrackId = preset.trackId;
    this.textSizeRem = preset.fontSizeRem;
    this.playInterfaceSound("select");
    this.applyPrefsToRoot();
    this.updateFocusControls();
    this.updateSoundControls();
    this.savePrefs();
    this.scheduleActiveBlockUpdate();
    const message = this.paceToast(pace);
    this.showToast(message);
    this.announce(message);
  }

  private focusToast(mode: FocusMode, previousMode: FocusMode): string {
    if (mode === "spotlight") return COPY.lanternOnToast;
    if (mode === "off" && previousMode === "spotlight") return COPY.lanternOffToast;
    if (mode === "band") return COPY.bandToast;
    if (mode === "ruler") return COPY.rulerToast;
    return COPY.focusResetToast;
  }

  private paceToast(pace: ReadingPace): string {
    if (pace === "focus") return COPY.focusPaceToast;
    if (pace === "sprint") return COPY.sprintToast;
    if (pace === "rest") return COPY.restToast;
    return COPY.driftToast;
  }

  private promiseToast(promise: PagePromise): string {
    if (promise === "time") return COPY.promiseTimeSetToast;
    if (promise === "finish") return COPY.promiseFinishSetToast;
    return COPY.promiseSceneSetToast;
  }

  private pleasureToast(mode: PleasureMode): string {
    if (mode === "calm") return COPY.pleasureCalmToast;
    if (mode === "intensity") return COPY.pleasureIntensityToast;
    if (mode === "tenderness") return COPY.pleasureTendernessToast;
    return COPY.pleasureWonderToast;
  }

  private loadPrefs(): void {
    try {
      const prefs = JSON.parse(window.localStorage.getItem(PREFS_KEY) ?? "{}") as ReaderPrefs;
      this.readingPace = this.parseReadingPace(prefs.readingPace);
      this.pagePromise = this.parsePagePromise(prefs.pagePromise);
      this.pleasureMode = this.parsePleasureMode(prefs.pleasureMode);
      this.observationTheme =
        typeof prefs.observationTheme === "string"
          ? this.parseObservationTheme(prefs.observationTheme)
          : PLEASURE_PRESETS[this.pleasureMode].theme;
      this.textSizeRem = this.parseTextSize(prefs.textSizeRem, READING_PACE_PRESETS[this.readingPace].fontSizeRem);
      this.focusMode = this.parseFocusMode(prefs.focusMode);
      this.generousSpacing = Boolean(prefs.generousSpacing);
      this.showImages = Boolean(prefs.showImages);
      this.audioMuted = Boolean(prefs.audioMuted);
      this.atmosphereTrackId = this.parseAtmosphereTrackId(prefs.audioTrackId);
    } catch {
      this.readingPace = DEFAULT_READING_PACE;
      this.pagePromise = DEFAULT_PAGE_PROMISE;
      this.pleasureMode = DEFAULT_PLEASURE_MODE;
      this.observationTheme = PLEASURE_PRESETS[DEFAULT_PLEASURE_MODE].theme;
      this.textSizeRem = READING_PACE_PRESETS[DEFAULT_READING_PACE].fontSizeRem;
      this.focusMode = "off";
      this.generousSpacing = false;
      this.showImages = false;
      this.audioMuted = false;
      this.atmosphereTrackId = DEFAULT_READING_TRACK_ID;
    }
  }

  private savePrefs(): void {
    try {
      window.localStorage.setItem(
        PREFS_KEY,
        JSON.stringify({
          focusMode: this.focusMode,
          readingPace: this.readingPace,
          pagePromise: this.pagePromise,
          pleasureMode: this.pleasureMode,
          observationTheme: this.observationTheme,
          textSizeRem: this.textSizeRem,
          generousSpacing: this.generousSpacing,
          showImages: this.showImages,
          audioMuted: this.audioMuted,
          audioTrackId: this.atmosphereTrackId,
        } satisfies ReaderPrefs),
      );
    } catch {
      // Local storage can be unavailable in private contexts. The controls still work for this session.
    }
  }

  private applyPrefsToRoot(): void {
    this.root.dataset.omTheme = this.observationTheme;
    this.root.dataset.pleasureMode = this.pleasureMode;
    this.root.dataset.focusMode = this.focusMode;
    this.root.dataset.paceMode = this.readingPace;
    this.root.dataset.spacingMode = this.generousSpacing ? "on" : "off";
    this.root.dataset.imagesMode = this.showImages ? "on" : "off";
    this.root.dataset.audioMode = this.audioMuted ? "muted" : "on";
    this.root.dataset.readAloudMode = this.readAloudOn ? "on" : "off";
    this.root.dataset.audioTrackId = this.atmosphereTrackId;
    this.root.style.setProperty("--om-fs-body", `${this.textSizeRem.toFixed(2)}rem`);
    this.applyLanternClasses();
  }

  private hasImageBlocks(): boolean {
    return Boolean(
      this.manifest?.body?.some((block) => block.type === "image") ||
        this.sourceArticle?.querySelector("figure, img"),
    );
  }

  private updateImageControls(): void {
    const imagesButton = this.root.querySelector<HTMLButtonElement>("[data-action='images']");
    imagesButton?.setAttribute("aria-pressed", String(this.showImages));
    imagesButton?.setAttribute("aria-label", this.showImages ? COPY.imagesAriaOn : COPY.imagesAriaOff);

    this.root.querySelectorAll<HTMLElement>(".om-image-block").forEach((imageBlock) => {
      imageBlock.hidden = !this.showImages;
    });
  }

  private updateFocusControls(): void {
    const lanternOn = this.focusMode === "spotlight";
    const lantern = this.root.querySelector<HTMLButtonElement>("[data-action='lantern']");
    if (lantern) {
      lantern.setAttribute("aria-pressed", String(lanternOn));
      lantern.setAttribute("aria-label", lanternOn ? COPY.lanternAriaOn : COPY.lanternAriaOff);
    }

    const focusMore = this.root.querySelector<HTMLButtonElement>(".om-focus-more");
    const focusPanelOpen = Boolean(this.root.querySelector(".om-panel[data-panel-id='focus']"));
    focusMore?.setAttribute("aria-expanded", String(focusPanelOpen));
    focusMore?.setAttribute("aria-label", focusPanelOpen ? COPY.focusMoreCloseAria : COPY.focusMoreAria);

    const soundButton = this.root.querySelector<HTMLButtonElement>("[data-panel='sound']");
    const soundPanelOpen = Boolean(this.root.querySelector(".om-panel[data-panel-id='sound']"));
    soundButton?.setAttribute("aria-expanded", String(soundPanelOpen));
    soundButton?.setAttribute("aria-label", soundPanelOpen ? COPY.soundAriaOpen : COPY.soundAria);

    const textButton = this.root.querySelector<HTMLButtonElement>("[data-panel='display']");
    const textPanelOpen = Boolean(this.root.querySelector(".om-panel[data-panel-id='display']"));
    textButton?.setAttribute("aria-expanded", String(textPanelOpen));
    textButton?.setAttribute("aria-label", textPanelOpen ? COPY.textAriaOpen : COPY.textAria);

    this.root.querySelectorAll<HTMLButtonElement>("[data-focus-mode]").forEach((button) => {
      const selected = this.parseFocusMode(button.dataset.focusMode) === this.focusMode;
      button.setAttribute("aria-checked", String(selected));
    });

    this.root.querySelectorAll<HTMLButtonElement>("[data-pace]").forEach((button) => {
      const selected = this.parseReadingPace(button.dataset.pace) === this.readingPace;
      button.setAttribute("aria-checked", String(selected));
    });

    this.updatePromiseControls();
    this.updatePleasureControls();

    const spacingToggle = this.root.querySelector<HTMLButtonElement>("[data-spacing-toggle]");
    spacingToggle?.setAttribute("aria-pressed", String(this.generousSpacing));
    spacingToggle?.setAttribute("aria-label", this.generousSpacing ? COPY.spacingAriaOn : COPY.spacingAriaOff);
    this.updateSoundControls();
  }

  private updatePromiseControls(): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-promise]").forEach((button) => {
      const selected = this.parsePagePromise(button.dataset.promise) === this.pagePromise;
      button.setAttribute("aria-checked", String(selected));
    });
  }

  private updatePleasureControls(): void {
    this.root.querySelectorAll<HTMLButtonElement>("[data-pleasure]").forEach((button) => {
      const selected = this.parsePleasureMode(button.dataset.pleasure) === this.pleasureMode;
      button.setAttribute("aria-checked", String(selected));
    });
  }

  private updateSoundControls(): void {
    const readAloudAvailable = this.isReadAloudAvailable();
    const atmosphereButton = this.root.querySelector<HTMLButtonElement>("[data-audio-action='atmosphere']");
    const readAloudButton = this.root.querySelector<HTMLButtonElement>("[data-audio-action='read-aloud']");
    const muteButton = this.root.querySelector<HTMLButtonElement>("[data-audio-action='mute']");
    const status = this.root.querySelector<HTMLElement>("[data-read-aloud-status]");
    const description = this.root.querySelector<HTMLElement>("[data-sound-description]");

    atmosphereButton?.setAttribute("aria-pressed", String(this.atmosphereOn));
    atmosphereButton?.setAttribute(
      "aria-label",
      this.atmosphereOn ? COPY.atmosphereStopAria : `${COPY.atmosphereAria}: ${this.getAtmosphereTrack().label}`,
    );
    if (atmosphereButton) {
      atmosphereButton.textContent = this.atmosphereOn ? COPY.pauseMusic : COPY.playMusic;
    }

    if (readAloudButton) {
      readAloudButton.disabled = !readAloudAvailable;
      readAloudButton.setAttribute("aria-disabled", String(!readAloudAvailable));
      readAloudButton.setAttribute("aria-pressed", String(this.readAloudOn));
      readAloudButton.setAttribute(
        "aria-label",
        this.getReadAloudAriaLabel(readAloudAvailable),
      );
      readAloudButton.textContent = this.readAloudOn ? COPY.stopReading : COPY.readAloud;
    }

    muteButton?.setAttribute("aria-pressed", String(this.audioMuted));
    if (status) {
      status.textContent = this.getReadAloudStatus();
    }
    if (description) {
      description.textContent = this.getSoundPanelDescription();
    }

    this.root.querySelectorAll<HTMLButtonElement>("[data-audio-track]").forEach((button) => {
      button.setAttribute(
        "aria-checked",
        String(this.parseAtmosphereTrackId(button.dataset.audioTrack) === this.atmosphereTrackId),
      );
    });
  }

  private handleAudioAction(action: string | undefined): void {
    if (action === "atmosphere") {
      this.toggleAtmosphere();
      return;
    }

    if (action === "read-aloud") {
      this.toggleReadAloud();
      return;
    }

    if (action === "mute") {
      this.toggleMute();
    }
  }

  private getSoundPanelDescription(): string {
    if (this.readAloudOn) {
      return this.readAloudMode === "spoken-playback"
        ? COPY.readAloudPlaybackDescription
        : COPY.readAloudListeningDescription;
    }

    if (this.atmosphereOn || this.narrationOn) {
      return COPY.soundActive;
    }

    return COPY.soundReadyNoNarration;
  }

  private getReadAloudStatus(): string {
    if (!this.isReadAloudAvailable()) {
      return COPY.readAloudUnsupportedStatus;
    }

    if (this.readAloudOn) {
      return this.readAloudMode === "spoken-playback"
        ? COPY.readAloudPlaybackStatus
        : COPY.readAloudListeningStatus;
    }

    return this.canFollowVoice() ? COPY.readAloudIdleStatus : COPY.readAloudPlaybackIdleStatus;
  }

  private getReadAloudAriaLabel(readAloudAvailable = this.isReadAloudAvailable()): string {
    if (!readAloudAvailable) return COPY.readAloudUnavailableAria;
    if (this.readAloudOn) return COPY.readAloudStopAria;
    return this.canFollowVoice() ? COPY.readAloudAria : COPY.readAloudPlaybackAria;
  }

  private getSpeechRecognitionConstructor(): ReadAloudRecognitionConstructor | null {
    const speechWindow = window as Window & {
      SpeechRecognition?: ReadAloudRecognitionConstructor;
      webkitSpeechRecognition?: ReadAloudRecognitionConstructor;
    };

    return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
  }

  private isReadAloudAvailable(): boolean {
    return this.canFollowVoice() || this.canPlayReadAloud();
  }

  private canFollowVoice(): boolean {
    return Boolean(window.isSecureContext && this.getSpeechRecognitionConstructor());
  }

  private canPlayReadAloud(): boolean {
    return Boolean("speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
  }

  private toggleReadAloud(): void {
    if (this.readAloudOn) {
      this.stopReadAloud(true);
      return;
    }

    this.startReadAloud();
  }

  private startReadAloud(): void {
    const Recognition = this.getSpeechRecognitionConstructor();

    if (!window.isSecureContext || !Recognition) {
      if (this.canPlayReadAloud()) {
        this.startSpokenReadAloud();
        return;
      }

      this.playInterfaceSound("error");
      this.showToast(COPY.readAloudUnavailableToast);
      this.updateSoundControls();
      return;
    }

    this.stopReadAloud(false);

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = document.documentElement.lang || navigator.language || "en-US";
    recognition.onresult = (event) => this.handleReadAloudResult(event);
    recognition.onerror = (event) => this.handleReadAloudError(event);
    recognition.onend = () => this.handleReadAloudEnd(recognition);

    this.readAloudRecognition = recognition;
    this.readAloudStopping = false;
    this.readAloudOn = true;
    this.readAloudMode = "voice-follow";
    this.readAloudFinalTranscript = "";
    this.readAloudCursor = this.findNearestReadAloudSentenceIndex();
    this.applyPrefsToRoot();

    try {
      recognition.start();
      this.playInterfaceSound("success");
      this.showToast(COPY.readAloudOnToast);
    } catch {
      if (this.canPlayReadAloud()) {
        this.startSpokenReadAloud(COPY.readAloudFallbackToast);
        return;
      }

      this.readAloudOn = false;
      this.readAloudRecognition = null;
      this.readAloudMode = null;
      this.playInterfaceSound("error");
      this.showToast(COPY.readAloudUnavailableToast);
    }

    this.updateSoundControls();
  }

  private stopReadAloud(announce: boolean): void {
    const wasOn = this.readAloudOn;
    const recognition = this.readAloudRecognition;

    this.readAloudStopping = true;
    this.readAloudOn = false;
    this.readAloudMode = null;
    this.readAloudRecognition = null;
    this.readAloudUtterance = null;
    this.readAloudFinalTranscript = "";
    this.readAloudCursor = 0;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (recognition) {
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;
      try {
        recognition.stop();
      } catch {
        try {
          recognition.abort();
        } catch {
          // Some engines throw if recognition is stopped between events.
        }
      }
    }

    this.clearNarrationHighlight();
    this.applyPrefsToRoot();
    this.updateSoundControls();

    if (announce && wasOn) {
      this.playInterfaceSound("close");
      this.showToast(COPY.readAloudOffToast);
    }
  }

  private handleReadAloudEnd(recognition: ReadAloudRecognition): void {
    if (!this.readAloudOn || this.readAloudStopping || this.readAloudRecognition !== recognition) {
      this.readAloudStopping = false;
      this.updateSoundControls();
      return;
    }

    window.setTimeout(() => {
      if (!this.readAloudOn || this.readAloudRecognition !== recognition) return;
      try {
        recognition.start();
      } catch {
        this.readAloudOn = false;
        this.readAloudRecognition = null;
        this.readAloudMode = null;
        this.applyPrefsToRoot();
        this.updateSoundControls();
      }
    }, 240);
  }

  private handleReadAloudError(event: ReadAloudRecognitionErrorEvent): void {
    const error = event.error ?? "";
    if (error === "no-speech") {
      this.updateSoundControls();
      return;
    }

    if (this.canPlayReadAloud()) {
      this.startSpokenReadAloud(
        error === "not-allowed" || error === "service-not-allowed" || error === "audio-capture"
          ? COPY.readAloudMicFallbackToast
          : COPY.readAloudFallbackToast,
      );
      return;
    }

    this.readAloudStopping = true;
    this.readAloudOn = false;
    this.readAloudRecognition = null;
    this.readAloudMode = null;
    this.readAloudCursor = 0;
    this.clearNarrationHighlight();
    this.applyPrefsToRoot();
    this.updateSoundControls();
    this.playInterfaceSound("error");
    this.showToast(
      error === "not-allowed" || error === "service-not-allowed" || error === "audio-capture"
        ? COPY.readAloudMicBlockedToast
        : COPY.readAloudUnavailableToast,
    );
  }

  private handleReadAloudResult(event: ReadAloudRecognitionEvent): void {
    if (!this.readAloudOn) return;

    let finalTranscript = "";
    let interimTranscript = "";

    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      const transcript = result?.[0]?.transcript ?? "";
      if (!transcript.trim()) continue;

      if (result?.isFinal) {
        finalTranscript = `${finalTranscript} ${transcript}`;
      } else {
        interimTranscript = `${interimTranscript} ${transcript}`;
      }
    }

    if (finalTranscript.trim()) {
      this.readAloudFinalTranscript = this.trimReadAloudTranscript(
        `${this.readAloudFinalTranscript} ${finalTranscript}`,
      );
    }

    this.matchReadAloudTranscript(`${this.readAloudFinalTranscript} ${interimTranscript}`);
  }

  private startSpokenReadAloud(toastMessage: string = COPY.readAloudPlaybackOnToast): void {
    const sentences = this.getReadAloudSentences();
    if (!sentences.length) {
      this.playInterfaceSound("error");
      this.showToast(COPY.readAloudUnavailableToast);
      this.updateSoundControls();
      return;
    }

    this.stopReadAloud(false);
    this.readAloudStopping = false;
    this.readAloudOn = true;
    this.readAloudMode = "spoken-playback";
    this.readAloudCursor = this.findNearestReadAloudSentenceIndex();
    this.applyPrefsToRoot();
    this.updateSoundControls();
    this.playInterfaceSound("success");
    this.showToast(toastMessage);
    this.speakNextReadAloudSentence();
  }

  private speakNextReadAloudSentence(): void {
    if (!this.readAloudOn || this.readAloudMode !== "spoken-playback" || this.readAloudStopping) return;

    const sentences = this.getReadAloudSentences();
    const sentence = sentences[this.readAloudCursor];
    if (!sentence) {
      this.stopReadAloud(false);
      this.showToast(COPY.readAloudFinishedToast);
      return;
    }

    window.speechSynthesis.cancel();
    this.highlightReadAloudSentence(sentence);

    const utterance = new SpeechSynthesisUtterance(sentence.sentenceElement.textContent?.trim() || "");
    utterance.lang = document.documentElement.lang || "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 0.96;
    utterance.volume = this.audioMuted ? 0 : 1;
    utterance.onend = () => {
      if (!this.readAloudOn || this.readAloudMode !== "spoken-playback") return;
      this.speakNextReadAloudSentence();
    };
    utterance.onerror = () => {
      if (!this.readAloudOn || this.readAloudMode !== "spoken-playback") return;
      this.stopReadAloud(false);
      this.playInterfaceSound("error");
      this.showToast(COPY.readAloudUnavailableToast);
    };

    this.readAloudUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  private matchReadAloudTranscript(transcript: string): void {
    const transcriptTokens = this.tokenizeReadAloud(transcript).slice(-80);
    if (!transcriptTokens.length) return;

    const sentences = this.getReadAloudSentences();
    if (!sentences.length) return;

    const localStart = Math.min(Math.max(0, this.readAloudCursor), Math.max(0, sentences.length - 1));
    const localEnd = Math.min(sentences.length, localStart + 8);
    const localMatch = this.findBestReadAloudMatch(transcriptTokens, sentences, localStart, localEnd, 0.32);
    const fallbackMatch =
      localMatch ?? this.findBestReadAloudMatch(transcriptTokens, sentences, localStart, sentences.length, 0.56);

    if (!fallbackMatch) return;

    this.highlightReadAloudSentence(fallbackMatch);
  }

  private findBestReadAloudMatch(
    transcriptTokens: string[],
    sentences: ReadAloudSentence[],
    start: number,
    end: number,
    threshold: number,
  ): ReadAloudSentence | null {
    let best: { sentence: ReadAloudSentence; score: number; matches: number } | null = null;

    for (let index = start; index < end; index += 1) {
      const sentence = sentences[index];
      if (!sentence?.tokens.length) continue;

      const matches = this.countOrderedReadAloudMatches(transcriptTokens, sentence.tokens);
      const minComparable = Math.min(sentence.tokens.length, transcriptTokens.length);
      const requiredMatches = Math.min(4, Math.max(2, Math.ceil(minComparable * 0.45)));
      if (matches < requiredMatches) continue;

      const localCoverage = matches / Math.max(1, minComparable);
      const sentenceCoverage = matches / Math.max(1, sentence.tokens.length);
      const distancePenalty = Math.max(0, sentence.index - this.readAloudCursor) * 0.012;
      const score = localCoverage * 0.72 + sentenceCoverage * 0.28 - distancePenalty;

      if (score >= threshold && (!best || score > best.score)) {
        best = { sentence, score, matches };
      }
    }

    return best?.sentence ?? null;
  }

  private countOrderedReadAloudMatches(transcriptTokens: string[], sentenceTokens: string[]): number {
    let transcriptIndex = 0;
    let matches = 0;

    for (const sentenceToken of sentenceTokens) {
      while (transcriptIndex < transcriptTokens.length) {
        const transcriptToken = transcriptTokens[transcriptIndex];
        transcriptIndex += 1;
        if (transcriptToken && this.isReadAloudTokenMatch(transcriptToken, sentenceToken)) {
          matches += 1;
          break;
        }
      }
    }

    return matches;
  }

  private isReadAloudTokenMatch(spokenToken: string, writtenToken: string): boolean {
    if (spokenToken === writtenToken) return true;

    const spokenBase = spokenToken.replace(/s$/, "");
    const writtenBase = writtenToken.replace(/s$/, "");
    if (spokenBase.length > 3 && spokenBase === writtenBase) return true;

    return (
      spokenToken.length > 5 &&
      writtenToken.length > 5 &&
      (spokenToken.startsWith(writtenToken) || writtenToken.startsWith(spokenToken))
    );
  }

  private highlightReadAloudSentence(sentence: ReadAloudSentence): void {
    if (this.activeNarrationOid !== sentence.oid) {
      this.activeNarrationOid = sentence.oid;
      this.clearNarrationHighlight(false);
      sentence.sentenceElement.classList.add("is-spoken");
      sentence.blockElement.classList.add("is-narrating");
    }

    this.readAloudCursor = Math.max(this.readAloudCursor, sentence.index + 1);
    this.activeBlockId = sentence.blockElement.dataset.blockId ?? sentence.blockElement.id;
    this.applyLanternClasses();

    if (!this.isElementComfortablyVisible(sentence.blockElement)) {
      sentence.blockElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  private isElementComfortablyVisible(element: HTMLElement): boolean {
    const container = this.readingArticle;
    if (!container) return true;

    const rect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const inset = Math.min(96, containerRect.height * 0.18);
    return rect.top >= containerRect.top + inset && rect.bottom <= containerRect.bottom - inset;
  }

  private findNearestReadAloudSentenceIndex(): number {
    const sentences = this.getReadAloudSentences();
    if (!sentences.length) return 0;

    if (this.activeNarrationOid) {
      const activeSentence = sentences.find((sentence) => sentence.oid === this.activeNarrationOid);
      if (activeSentence) return activeSentence.index;
    }

    if (this.activeBlockId) {
      const activeSentence = sentences.find((sentence) => {
        return (
          sentence.blockElement.dataset.blockId === this.activeBlockId ||
          sentence.blockElement.id === this.activeBlockId
        );
      });
      if (activeSentence) return activeSentence.index;
    }

    return 0;
  }

  private getReadAloudSentences(): ReadAloudSentence[] {
    const sentences: ReadAloudSentence[] = [];
    let sentenceIndex = 0;

    for (const model of this.models) {
      if (model.type === "hr" || model.type === "image") continue;

      for (const sentence of model.sentences) {
        const sentenceElement = model.element.querySelector<HTMLElement>(`[data-oid="${CSS.escape(sentence.oid)}"]`);
        if (!sentenceElement) continue;

        const tokens = this.tokenizeReadAloud(sentence.text);
        if (!tokens.length) continue;

        sentences.push({
          index: sentenceIndex,
          oid: sentence.oid,
          tokens,
          sentenceElement,
          blockElement: model.element,
        });
        sentenceIndex += 1;
      }
    }

    return sentences;
  }

  private trimReadAloudTranscript(transcript: string): string {
    return this.tokenizeReadAloud(transcript).slice(-90).join(" ");
  }

  private tokenizeReadAloud(text: string): string[] {
    return (
      text
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/['’]/g, "")
        .match(/[a-z0-9]+/g) ?? []
    );
  }

  private parseAtmosphereTrackId(value: string | undefined): ReadingTrackId {
    return READING_TRACKS.some((track) => track.id === value) ? (value as ReadingTrackId) : DEFAULT_READING_TRACK_ID;
  }

  private getAtmosphereTrack() {
    return READING_TRACKS.find((track) => track.id === this.atmosphereTrackId) ?? READING_TRACKS[0];
  }

  private selectAtmosphereTrack(value: string | undefined): void {
    const nextTrackId = this.parseAtmosphereTrackId(value);
    const changed = nextTrackId !== this.atmosphereTrackId;
    this.atmosphereTrackId = nextTrackId;
    this.applyPrefsToRoot();
    this.savePrefs();

    const track = this.getAtmosphereTrack();

    if (changed || !this.atmosphereOn) {
      this.unmuteForPlayback();
      if (this.startAtmosphere()) {
        this.playInterfaceSound("success");
        this.showToast(`${track.label} playing.`);
      } else {
        this.playInterfaceSound("error");
        this.showToast(COPY.soundUnavailableToast);
      }
    } else {
      this.playInterfaceSound("select");
      this.showToast(`${track.label} already playing.`);
    }

    this.updateSoundControls();
  }

  private hasNarration(): boolean {
    return Boolean(this.manifest?.narration?.audio?.src && this.manifest.narration.cues.length);
  }

  private isSiteSoundEnabled(): boolean {
    try {
      return window.localStorage.getItem(SITE_SOUND_PREF_KEY) !== "off";
    } catch {
      return true;
    }
  }

  private ensureAudioContext(): AudioContext | null {
    if (!this.isSiteSoundEnabled()) {
      return null;
    }

    const audioWindow = window as Window & { webkitAudioContext?: typeof AudioContext };
    const AudioContextClass = window.AudioContext ?? audioWindow.webkitAudioContext;
    if (!AudioContextClass) {
      return null;
    }

    if (!this.audioContext) {
      this.audioContext = new AudioContextClass();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.audioMuted ? 0 : 0.16;
      this.masterGain.connect(this.audioContext.destination);
    }

    if (this.audioContext.state === "suspended") {
      void this.audioContext.resume();
    }

    return this.audioContext;
  }

  private playInterfaceSound(kind: "open" | "close" | "panel" | "select" | "reveal" | "success" | "error"): void {
    if (this.audioMuted) return;
    const context = this.ensureAudioContext();
    if (!context || !this.masterGain) return;

    const notes = {
      open: [
        [329.63, 0.16, 0, 659.25],
        [987.77, 0.2, 0.04],
      ],
      close: [[440, 0.14, 0, 220]],
      panel: [
        [493.88, 0.09, 0],
        [739.99, 0.12, 0.04],
      ],
      select: [[587.33, 0.09, 0]],
      reveal: [
        [392, 0.16, 0],
        [587.33, 0.18, 0.06],
        [880, 0.22, 0.12],
      ],
      success: [
        [523.25, 0.12, 0],
        [659.25, 0.16, 0.06],
        [987.77, 0.24, 0.13],
      ],
      error: [
        [220, 0.14, 0, 185],
        [164.81, 0.18, 0.08],
      ],
    } satisfies Record<string, Array<[number, number, number, number?]>>;

    for (const [frequency, duration, delay, endFrequency] of notes[kind]) {
      this.playTone(context, frequency, duration, delay, endFrequency);
    }
  }

  private playTone(
    context: AudioContext,
    frequency: number,
    duration: number,
    delay: number,
    endFrequency?: number,
  ): void {
    if (!this.masterGain) return;

    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    if (endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
    }

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.22, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(gain);
    gain.connect(this.masterGain);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  private toggleAtmosphere(): void {
    if (this.atmosphereOn) {
      this.stopAtmosphere();
      this.showToast(COPY.atmosphereOffToast);
      this.updateSoundControls();
      return;
    }

    this.unmuteForPlayback();
    if (this.startAtmosphere()) {
      this.playInterfaceSound("success");
      this.showToast(`${this.getAtmosphereTrack().label} playing.`);
    } else {
      this.playInterfaceSound("error");
      this.showToast(COPY.soundUnavailableToast);
    }

    this.updateSoundControls();
  }

  private startAtmosphere(): boolean {
    this.stopAtmosphere();
    this.atmosphereOn = true;

    const readingTrack = this.getAtmosphereTrack();
    if (readingTrack) {
      const audio = new Audio(readingTrack.src);
      this.atmosphereAudio = audio;
      audio.loop = true;
      audio.volume = this.gainDbToVolume(readingTrack.gainDb);
      audio.muted = this.audioMuted;
      void audio.play().catch(() => {
        if (this.atmosphereAudio !== audio) return;
        this.atmosphereOn = false;
        this.updateSoundControls();
        this.showToast(COPY.soundUnavailableToast);
      });
      return true;
    }

    if (this.manifest?.ambientTrack?.src) {
      const audio = new Audio(this.manifest.ambientTrack.src);
      this.atmosphereAudio = audio;
      audio.loop = this.manifest.ambientTrack.loop ?? true;
      audio.volume = this.gainDbToVolume(this.manifest.ambientTrack.gainDb ?? -18);
      audio.muted = this.audioMuted;
      void audio.play().catch(() => {
        if (this.atmosphereAudio !== audio) return;
        this.atmosphereOn = false;
        this.updateSoundControls();
        this.showToast(COPY.soundUnavailableToast);
      });
      return true;
    }

    const context = this.ensureAudioContext();
    if (!context || !this.masterGain) return false;

    this.atmosphereGain = context.createGain();
    this.atmosphereGain.gain.setValueAtTime(0.0001, context.currentTime);
    this.atmosphereGain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.8);
    this.atmosphereGain.connect(this.masterGain);

    for (const [frequency, type] of [
      [82.41, "sine"],
      [123.47, "triangle"],
      [246.94, "sine"],
    ] as Array<[number, OscillatorType]>) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      oscillator.detune.value = Math.random() * 8 - 4;
      gain.gain.value = frequency > 200 ? 0.035 : 0.06;
      oscillator.connect(gain);
      gain.connect(this.atmosphereGain);
      oscillator.start();
      this.atmosphereOscillators.push(oscillator);
    }

    this.atmosphereNoise = this.createLoopingNoise(context);
    return true;
  }

  private createLoopingNoise(context: AudioContext): AudioBufferSourceNode {
    if (!this.atmosphereGain) {
      throw new Error("Atmosphere gain must exist before noise is created.");
    }

    const duration = 2;
    const bufferSize = Math.floor(context.sampleRate * duration);
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < bufferSize; index += 1) {
      samples[index] = (Math.random() * 2 - 1) * 0.18;
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    filter.type = "lowpass";
    filter.frequency.value = 740;
    gain.gain.value = 0.025;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.atmosphereGain);
    source.start();
    return source;
  }

  private stopAtmosphere(): void {
    this.atmosphereOn = false;
    this.atmosphereAudio?.pause();
    this.atmosphereAudio = null;

    for (const oscillator of this.atmosphereOscillators) {
      try {
        oscillator.stop();
      } catch {
        // Oscillators may already be stopped during fast toggles.
      }
    }

    try {
      this.atmosphereNoise?.stop();
    } catch {
      // Noise may already be stopped during fast toggles.
    }

    this.atmosphereNoise = null;
    this.atmosphereOscillators = [];
    this.atmosphereGain?.disconnect();
    this.atmosphereGain = null;
  }

  private async toggleNarration(): Promise<void> {
    if (!this.hasNarration()) {
      this.playInterfaceSound("error");
      this.showToast(COPY.narrationUnavailableToast);
      this.updateSoundControls();
      return;
    }

    const narration = this.ensureNarrationAudio();
    if (!narration) return;

    if (this.narrationOn) {
      narration.pause();
      this.narrationOn = false;
      this.showToast(COPY.narrationPausedToast);
      this.updateSoundControls();
      return;
    }

    try {
      await narration.play();
      this.narrationOn = true;
      this.playInterfaceSound("success");
      this.showToast(COPY.narrationOnToast);
      this.syncNarrationCue();
    } catch {
      this.narrationOn = false;
      this.playInterfaceSound("error");
      this.showToast(COPY.soundUnavailableToast);
    }

    this.updateSoundControls();
  }

  private ensureNarrationAudio(): HTMLAudioElement | null {
    const narration = this.manifest?.narration;
    if (!narration?.audio.src) return null;

    if (this.narrationAudio?.src.endsWith(narration.audio.src)) {
      return this.narrationAudio;
    }

    this.narrationAudio?.pause();
    this.narrationAudio = new Audio(narration.audio.src);
    this.narrationAudio.preload = "metadata";
    this.narrationAudio.volume = this.gainDbToVolume(narration.audio.gainDb ?? -3);
    this.narrationAudio.addEventListener("timeupdate", () => this.syncNarrationCue());
    this.narrationAudio.addEventListener("ended", () => {
      this.narrationOn = false;
      this.clearNarrationHighlight();
      this.bus.emit("narration", { status: "ended" });
      this.updateSoundControls();
    });
    this.narrationAudio.addEventListener("pause", () => {
      if (!this.narrationAudio?.ended) {
        this.bus.emit("narration", { status: "paused", oid: this.activeNarrationOid ?? undefined });
      }
    });
    this.narrationAudio.addEventListener("play", () => {
      this.bus.emit("narration", { status: "playing", oid: this.activeNarrationOid ?? undefined });
    });

    return this.narrationAudio;
  }

  private syncNarrationCue(): void {
    const narration = this.manifest?.narration;
    const audio = this.narrationAudio;
    if (!narration || !audio) return;

    const currentMs = audio.currentTime * 1000;
    const cue = narration.cues.find(({ startMs, endMs }) => currentMs >= startMs && currentMs < endMs);
    if (!cue || cue.oid === this.activeNarrationOid) return;

    this.activeNarrationOid = cue.oid;
    this.clearNarrationHighlight(false);

    const sentence = this.root.querySelector<HTMLElement>(`[data-oid="${CSS.escape(cue.oid)}"]`);
    const block = sentence?.closest<HTMLElement>(".om-block") ?? this.models.find((model) => model.id === cue.oid)?.element;
    sentence?.classList.add("is-spoken");
    block?.classList.add("is-narrating");

    if (block) {
      this.activeBlockId = block.dataset.blockId ?? block.id;
      this.applyLanternClasses();
      block.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    this.bus.emit("narration", { status: "playing", oid: cue.oid });
  }

  private clearNarrationHighlight(clearActiveOid = true): void {
    this.root.querySelectorAll(".is-spoken").forEach((node) => node.classList.remove("is-spoken"));
    this.root.querySelectorAll(".is-narrating").forEach((node) => node.classList.remove("is-narrating"));
    if (clearActiveOid) {
      this.activeNarrationOid = null;
    }
  }

  private unmuteForPlayback(): void {
    if (!this.audioMuted) return;

    this.audioMuted = false;
    if (this.masterGain) {
      this.masterGain.gain.value = 0.16;
    }

    if (this.narrationAudio) {
      this.narrationAudio.muted = false;
    }

    if (this.atmosphereAudio) {
      this.atmosphereAudio.muted = false;
    }

    this.applyPrefsToRoot();
    this.savePrefs();
  }

  private toggleMute(): void {
    this.audioMuted = !this.audioMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.audioMuted ? 0 : 0.16;
    }

    if (this.narrationAudio) {
      this.narrationAudio.muted = this.audioMuted;
    }

    if (this.atmosphereAudio) {
      this.atmosphereAudio.muted = this.audioMuted;
    }

    this.applyPrefsToRoot();
    this.savePrefs();
    this.updateSoundControls();
    this.showToast(this.audioMuted ? COPY.mutedToast : COPY.unmutedToast);

    if (!this.audioMuted) {
      this.playInterfaceSound("open");
    }
  }

  private stopAllAudio(): void {
    this.stopReadAloud(false);
    this.stopAtmosphere();
    this.narrationAudio?.pause();
    this.narrationOn = false;
    this.clearNarrationHighlight();
    this.updateSoundControls();
  }

  private showRestStopCard(beat: SceneBeat): void {
    if (this.root.querySelector(".om-rest-card")) return;
    this.closePanel(false);
    this.closeResumeCard(false);
    this.root.querySelector(".om-lost-card")?.remove();

    const previousScene = Math.max(1, beat.index - 1);
    const promiseKept = this.pagePromise === "scene" && beat.index > this.promiseStartBeatIndex;
    const card = document.createElement("section");
    card.className = "om-rest-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "false");
    card.setAttribute("aria-label", COPY.restStopPanelAria);
    card.innerHTML = `
      <button class="om-panel-close" type="button" aria-label="${COPY.closePanelAria}">${COPY.close}</button>
      <p class="om-panel-kicker">${COPY.restStopKicker}</p>
      <h2>${COPY.restStopTitle}</h2>
      <p>
        ${COPY.restStopDescription}
        ${promiseKept ? " You kept your One Scene promise." : ""}
      </p>
      <blockquote>${this.escapeHtml(`Scene ${previousScene} complete. ${COPY.restStopNext} ${beat.label}`)}</blockquote>
      <div class="om-panel-actions">
        <button type="button" data-rest-action="continue">${COPY.restStopContinue}</button>
        <button type="button" data-rest-action="pause">${COPY.restStopPause}</button>
        <button type="button" data-rest-action="lost">${COPY.restStopLost}</button>
      </div>
    `;

    const close = () => {
      card.remove();
      this.readingArticle?.focus();
      this.scheduleActiveBlockUpdate();
    };

    card.querySelector<HTMLButtonElement>(".om-panel-close")?.addEventListener("click", close);
    card.querySelector<HTMLButtonElement>("[data-rest-action='continue']")?.addEventListener("click", close);
    card.querySelector<HTMLButtonElement>("[data-rest-action='pause']")?.addEventListener("click", () => {
      this.stopAllAudio();
      const pauseButton = card.querySelector<HTMLButtonElement>("[data-rest-action='pause']");
      if (pauseButton) {
        pauseButton.textContent = COPY.restStopPaused;
        pauseButton.disabled = true;
      }
      this.showToast(COPY.restStopPausedToast);
      this.announce(COPY.restStopPausedToast);
    });
    card.querySelector<HTMLButtonElement>("[data-rest-action='lost']")?.addEventListener("click", () => {
      card.remove();
      this.showLostCard();
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });

    this.root.append(card);
    card.querySelector<HTMLElement>("[data-rest-action='continue']")?.focus();
    this.showToast(COPY.restStopToast);
    this.announce(COPY.restStopToast);
  }

  private showLostCard(modelOverride?: BlockModel): void {
    this.root.querySelector(".om-lost-card")?.remove();
    this.root.querySelector(".om-rest-card")?.remove();
    this.closeResumeCard(false);
    this.closePanel(false);
    if (!modelOverride) this.updateActiveBlock();

    const model = modelOverride ?? this.getActiveReadableBlock();
    if (!model) {
      this.showToast(COPY.lostToast);
      return;
    }

    this.playInterfaceSound("panel");
    const card = document.createElement("section");
    card.className = "om-lost-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "false");
    card.setAttribute("aria-label", COPY.lostPanelAria);
    card.innerHTML = `
      <button class="om-panel-close" type="button" aria-label="${COPY.closePanelAria}">${COPY.close}</button>
      <p class="om-panel-kicker">${COPY.lostKicker}</p>
      <h2>${COPY.lostTitle}</h2>
      <p>${COPY.lostDescription}</p>
      <blockquote>${this.escapeHtml(this.getLostCue(model))}</blockquote>
      <div class="om-panel-actions">
        <button type="button" data-lost-action="continue">${COPY.lostContinue}</button>
        <button type="button" data-lost-action="ruler">${COPY.lostRuler}</button>
      </div>
    `;

    const returnToLine = () => {
      this.returnToLostBlock(model);
      card.remove();
    };

    card.querySelector<HTMLButtonElement>(".om-panel-close")?.addEventListener("click", () => card.remove());
    card.querySelector<HTMLButtonElement>("[data-lost-action='continue']")?.addEventListener("click", returnToLine);
    card.querySelector<HTMLButtonElement>("[data-lost-action='ruler']")?.addEventListener("click", () => {
      this.setFocusMode("ruler", "panel");
      returnToLine();
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Escape") card.remove();
    });

    this.root.append(card);
    card.querySelector<HTMLElement>("[data-lost-action='continue']")?.focus();
    this.markLostAnchor(model);
    this.announce(COPY.lostToast);
  }

  private maybeShowResumeCard(): void {
    const bookmark = this.loadResumeBookmark();
    if (!bookmark) return;

    const model = this.models.find((candidate) => candidate.id === bookmark.blockId);
    if (!model || model.type === "image" || model.type === "hr") return;

    const readableModels = this.getReadableModelsWithIndex();
    const readableIndex = readableModels.findIndex(({ model: readableModel }) => readableModel.id === bookmark.blockId);
    if (readableIndex < 2) return;

    this.showResumeCard(model, bookmark);
  }

  private showResumeCard(model: BlockModel, bookmark: ResumeBookmark): void {
    this.closeResumeCard(false);
    this.resumePromptActive = true;

    const card = document.createElement("section");
    card.className = "om-resume-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "false");
    card.setAttribute("aria-label", COPY.resumePanelAria);
    card.innerHTML = `
      <button class="om-panel-close" type="button" aria-label="${COPY.closePanelAria}">${COPY.close}</button>
      <p class="om-panel-kicker">${COPY.resumeKicker}</p>
      <h2>${COPY.resumeTitle}</h2>
      <p>${COPY.resumeDescription}</p>
      <blockquote>${this.escapeHtml(bookmark.cue || this.getLostCue(model))}</blockquote>
      <div class="om-panel-actions">
        <button type="button" data-resume-action="continue">${COPY.resumeContinue}</button>
        <button type="button" data-resume-action="start">${COPY.resumeStartOver}</button>
        <button type="button" data-resume-action="lost">${COPY.resumeLost}</button>
      </div>
    `;

    card.querySelector<HTMLButtonElement>(".om-panel-close")?.addEventListener("click", () => this.closeResumeCard());
    card.querySelector<HTMLButtonElement>("[data-resume-action='continue']")?.addEventListener("click", () => {
      this.resumePromptActive = false;
      this.returnToResumeBlock(model);
      card.remove();
    });
    card.querySelector<HTMLButtonElement>("[data-resume-action='start']")?.addEventListener("click", () => {
      this.resumePromptActive = false;
      this.clearResumeBookmark();
      this.readingArticle?.scrollTo({ top: 0, behavior: "smooth" });
      this.scheduleActiveBlockUpdate();
      card.remove();
      this.showToast(COPY.resumeToast);
    });
    card.querySelector<HTMLButtonElement>("[data-resume-action='lost']")?.addEventListener("click", () => {
      this.resumePromptActive = false;
      card.remove();
      this.activeBlockId = model.id;
      this.showLostCard(model);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.closeResumeCard();
    });

    this.root.append(card);
    card.querySelector<HTMLElement>("[data-resume-action='continue']")?.focus();
    this.announce(COPY.resumeToast);
  }

  private closeResumeCard(allowProgressSave = true): void {
    this.root.querySelector(".om-resume-card")?.remove();
    this.resumePromptActive = false;
    if (allowProgressSave) this.scheduleActiveBlockUpdate();
  }

  private returnToResumeBlock(model: BlockModel): void {
    this.scrollBlockIntoReadingView(model);
    this.readingArticle?.focus();
    this.markLostAnchor(model);
    this.saveResumeBookmark(model);
    this.showToast(COPY.resumeToast);
  }

  private getActiveReadableBlock(): BlockModel | null {
    const active = this.activeBlockId ? this.models.find((model) => model.id === this.activeBlockId) : null;
    if (active && active.type !== "image" && active.type !== "hr") return active;
    return this.models.find((model) => model.type !== "image" && model.type !== "hr") ?? null;
  }

  private getLostCue(model: BlockModel): string {
    const text = (model.element.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!text) return this.getTitle();
    const firstSentence = text.match(/[^.!?]+[.!?]/)?.[0]?.trim();
    const cue = firstSentence && firstSentence.length >= 24 ? firstSentence : text;
    return cue.length > 190 ? `${cue.slice(0, 187).trim()}...` : cue;
  }

  private returnToLostBlock(model: BlockModel): void {
    this.scrollBlockIntoReadingView(model);
    this.readingArticle?.focus();
    this.markLostAnchor(model);
    this.showToast(COPY.lostToast);
  }

  private scrollBlockIntoReadingView(model: BlockModel): void {
    if (!this.readingArticle) {
      model.element.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const articleRect = this.readingArticle.getBoundingClientRect();
    const blockRect = model.element.getBoundingClientRect();
    const top =
      this.readingArticle.scrollTop +
      blockRect.top -
      articleRect.top -
      this.readingArticle.clientHeight / 2 +
      blockRect.height / 2;
    this.readingArticle.scrollTop = Math.max(0, top);
    this.activeBlockId = model.id;
    this.applyLanternClasses();
    this.updateSceneStatus();
  }

  private markLostAnchor(model: BlockModel): void {
    this.root.querySelectorAll(".is-lost-anchor").forEach((node) => node.classList.remove("is-lost-anchor"));
    if (this.lostAnchorTimer !== null) {
      window.clearTimeout(this.lostAnchorTimer);
    }
    model.element.classList.add("is-lost-anchor");
    this.lostAnchorTimer = window.setTimeout(() => {
      model.element.classList.remove("is-lost-anchor");
      this.lostAnchorTimer = null;
    }, 4200);
  }

  private escapeHtml(value: string): string {
    return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }

  private gainDbToVolume(gainDb: number): number {
    return Math.min(1, Math.max(0, 10 ** (gainDb / 20)));
  }

  private startActiveBlockTracker(): void {
    this.stopActiveBlockTracker();
    if (!this.readingArticle) return;

    const schedule = () => this.scheduleActiveBlockUpdate();
    this.readingArticle.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    this.releaseActiveBlockTracker = () => {
      this.readingArticle?.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
    this.scheduleActiveBlockUpdate();
  }

  private stopActiveBlockTracker(): void {
    this.releaseActiveBlockTracker?.();
    this.releaseActiveBlockTracker = null;

    if (this.activeBlockFrame !== null) {
      window.cancelAnimationFrame(this.activeBlockFrame);
      this.activeBlockFrame = null;
    }

    this.activeBlockId = null;
    this.models.forEach(({ element }) => element.classList.remove("is-lit", "is-ruler", "om-dim"));
    this.root.querySelectorAll(".is-lost-anchor").forEach((node) => node.classList.remove("is-lost-anchor"));
  }

  private scheduleActiveBlockUpdate(): void {
    if (this.activeBlockFrame !== null) return;
    this.activeBlockFrame = window.requestAnimationFrame(() => {
      this.activeBlockFrame = null;
      this.updateActiveBlock();
    });
  }

  private startPromiseTimer(): void {
    this.stopPromiseTimer();
    this.promiseTimer = window.setInterval(() => this.updateSceneStatus(), 15000);
  }

  private stopPromiseTimer(): void {
    if (this.promiseTimer === null) return;
    window.clearInterval(this.promiseTimer);
    this.promiseTimer = null;
  }

  private updateActiveBlock(): void {
    if (!this.readingArticle || !this.models.length) return;

    const readingRect = this.readingArticle.getBoundingClientRect();
    const viewportCenter = readingRect.top + readingRect.height / 2;
    let nearest: BlockModel | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const model of this.models) {
      if (!this.readingArticle.contains(model.element)) continue;

      const rect = model.element.getBoundingClientRect();
      if (rect.height === 0 && rect.width === 0) continue;

      const blockCenter = rect.top + rect.height / 2;
      const distance = Math.abs(blockCenter - viewportCenter);
      if (distance < nearestDistance) {
        nearest = model;
        nearestDistance = distance;
      }
    }

    if (!nearest) return;
    this.activeBlockId = nearest.id;
    this.applyLanternClasses();
    this.updateSceneStatus();
    this.saveResumeBookmark(nearest);
    this.maybeShowRestStop();
  }

  private maybeShowRestStop(): void {
    const beat = this.getActiveSceneBeat();
    if (!beat || beat.index <= 1 || beat.total <= 1) return;

    const movedIntoNewScene = beat.index > this.lastRestBeatIndex;
    this.lastRestBeatIndex = Math.max(this.lastRestBeatIndex, beat.index);
    if (!movedIntoNewScene || this.shownRestBeatIndexes.has(beat.index)) return;
    if (this.resumePromptActive || this.root.querySelector(".om-resume-card, .om-lost-card, .om-rest-card, .om-panel")) return;

    this.shownRestBeatIndexes.add(beat.index);
    this.showRestStopCard(beat);
  }

  private createSceneBeats(): SceneBeat[] {
    const readableModels = this.getReadableModelsWithIndex();
    if (!readableModels.length) return [];

    const sceneStarts = (this.manifest?.scenes ?? [])
      .map((scene) => {
        const startIndex = this.models.findIndex((model) => model.id === scene.startBlockId);
        return startIndex >= 0 ? { startIndex, label: scene.label ?? this.sceneLabelFromId(scene.id) } : null;
      })
      .filter((scene): scene is { startIndex: number; label: string } => Boolean(scene))
      .sort((a, b) => a.startIndex - b.startIndex);

    const uniqueSceneStarts = sceneStarts.filter(
      (scene, index, scenes) => index === 0 || scene.startIndex !== scenes[index - 1]?.startIndex
    );

    if (uniqueSceneStarts.length >= 2) {
      const total = uniqueSceneStarts.length;
      return uniqueSceneStarts.map((scene, index) => ({
        index: index + 1,
        total,
        startIndex: scene.startIndex,
        label: scene.label || this.fallbackSceneLabel(index, total),
      }));
    }

    const readableCount = readableModels.length;
    const total = readableCount >= 16 ? 5 : readableCount >= 10 ? 4 : readableCount >= 5 ? 3 : 1;
    return Array.from({ length: total }, (_value, index) => {
      const readableIndex = Math.min(readableCount - 1, Math.floor((index / total) * readableCount));
      return {
        index: index + 1,
        total,
        startIndex: readableModels[readableIndex]?.index ?? 0,
        label: this.fallbackSceneLabel(index, total),
      };
    });
  }

  private getReadableModelsWithIndex(): Array<{ index: number; model: BlockModel }> {
    return this.models
      .map((model, index) => ({ index, model }))
      .filter(({ model }) => model.type !== "image" && model.type !== "hr");
  }

  private updateSceneStatus(): void {
    const sceneStatus = this.root.querySelector<HTMLElement>("[data-status-scene]");
    const promiseStatus = this.root.querySelector<HTMLElement>("[data-status-promise]");
    const pleasureStatus = this.root.querySelector<HTMLElement>("[data-status-pleasure]");
    if (!sceneStatus && !promiseStatus && !pleasureStatus) return;

    const beat = this.getActiveSceneBeat();
    if (!beat) {
      if (sceneStatus) sceneStatus.textContent = `${COPY.plateObservation} ${this.getObservationNumber()}`;
      if (promiseStatus) promiseStatus.textContent = this.getPromiseStatusText();
      if (pleasureStatus) pleasureStatus.textContent = this.getPleasureStatusText();
      return;
    }

    if (sceneStatus) {
      sceneStatus.textContent =
        beat.total > 1 ? `Scene ${beat.index} of ${beat.total} · ${beat.label}` : `Scene · ${beat.label}`;
    }
    if (promiseStatus) promiseStatus.textContent = this.getPromiseStatusText();
    if (pleasureStatus) pleasureStatus.textContent = this.getPleasureStatusText();
  }

  private getPromiseStatusText(): string {
    if (this.pagePromise === "time") return this.getTimePromiseStatusText();
    if (this.pagePromise === "finish") return this.getFinishPromiseStatusText();
    return this.getScenePromiseStatusText();
  }

  private getPleasureStatusText(): string {
    return PLEASURE_PRESETS[this.pleasureMode].status;
  }

  private getScenePromiseStatusText(): string {
    const beat = this.getActiveSceneBeat();
    if (!beat) return "Promise: read one scene";
    if (beat.index > this.promiseStartBeatIndex) return "Promise kept: one scene read";
    const currentBeat = this.sceneBeats.find((sceneBeat) => sceneBeat.index === beat.index);
    const nextBeat = this.sceneBeats.find((sceneBeat) => sceneBeat.index === beat.index + 1);
    if (!currentBeat || !nextBeat) return "Promise: finish this scene";

    const activeIndex = this.getActiveModelIndex();
    const sceneSpan = Math.max(1, nextBeat.startIndex - currentBeat.startIndex);
    const sceneProgress = Math.min(1, Math.max(0, (activeIndex - currentBeat.startIndex) / sceneSpan));
    if (sceneProgress >= 0.78) return "Promise: almost one scene";
    if (sceneProgress >= 0.45) return "Promise: halfway through one scene";
    return "Promise: read one scene";
  }

  private getTimePromiseStatusText(): string {
    if (!this.readingStartedAt) return "Promise: read five minutes";
    const elapsed = Date.now() - this.readingStartedAt;
    const remainingMs = PAGE_PROMISE_DURATION_MS - elapsed;
    if (remainingMs <= 0) return "Promise kept: five minutes read";
    const remainingMinutes = Math.max(1, Math.ceil(remainingMs / 60000));
    return `Promise: ${remainingMinutes} min left`;
  }

  private getFinishPromiseStatusText(): string {
    const readableModels = this.getReadableModelsWithIndex();
    if (!readableModels.length) return "Promise: finish this Observation";
    const activeIndex = this.getActiveModelIndex();
    const readablePosition = readableModels.findIndex(({ index }) => index >= activeIndex);
    const currentPosition = readablePosition >= 0 ? readablePosition + 1 : readableModels.length;
    const progress = currentPosition / readableModels.length;
    if (progress >= 0.97) return "Promise kept: at the ending";
    if (progress >= 0.78) return "Promise: final stretch";
    if (progress >= 0.48) return "Promise: halfway to the end";
    return "Promise: finish this Observation";
  }

  private getActiveModelIndex(): number {
    if (!this.activeBlockId) return this.getReadableModelsWithIndex()[0]?.index ?? 0;
    const activeIndex = this.models.findIndex((model) => model.id === this.activeBlockId);
    return activeIndex >= 0 ? activeIndex : this.getReadableModelsWithIndex()[0]?.index ?? 0;
  }

  private getActiveSceneBeat(): SceneBeat | null {
    if (!this.sceneBeats.length) return null;
    const fallbackIndex = this.getReadableModelsWithIndex()[0]?.index ?? 0;
    const activeIndex = this.activeBlockId
      ? Math.max(0, this.models.findIndex((model) => model.id === this.activeBlockId))
      : fallbackIndex;

    let activeBeat = this.sceneBeats[0];
    for (const beat of this.sceneBeats) {
      if (beat.startIndex <= activeIndex) activeBeat = beat;
    }
    return activeBeat;
  }

  private sceneLabelFromId(id: string): string {
    return id
      .replace(/^sc-/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  private fallbackSceneLabel(index: number, total: number): string {
    const labelsByCount: Record<number, string[]> = {
      1: ["The scene opens"],
      2: ["The scene opens", "The witness arrives"],
      3: ["The scene opens", "The turn arrives", "The final echo"],
      4: ["The scene opens", "The pressure gathers", "The turn arrives", "The final echo"],
      5: ["The scene opens", "The pressure gathers", "The turn arrives", "The meaning lands", "The final echo"],
    };
    return labelsByCount[total]?.[index] ?? `Beat ${index + 1}`;
  }

  private loadResumeBookmark(): ResumeBookmark | null {
    try {
      const raw = window.localStorage.getItem(this.getResumeStorageKey());
      if (!raw) return null;
      const bookmark = JSON.parse(raw) as Partial<ResumeBookmark>;
      if (typeof bookmark.blockId !== "string" || typeof bookmark.cue !== "string") return null;
      return {
        blockId: bookmark.blockId,
        cue: bookmark.cue,
        updatedAt: typeof bookmark.updatedAt === "number" ? bookmark.updatedAt : Date.now(),
      };
    } catch {
      return null;
    }
  }

  private saveResumeBookmark(model: BlockModel): void {
    if (this.resumePromptActive || model.type === "image" || model.type === "hr") return;

    try {
      window.localStorage.setItem(
        this.getResumeStorageKey(),
        JSON.stringify({
          blockId: model.id,
          cue: this.getLostCue(model),
          updatedAt: Date.now(),
        } satisfies ResumeBookmark),
      );
    } catch {
      // Resume is a convenience. Reading should never depend on storage being available.
    }
  }

  private clearResumeBookmark(): void {
    try {
      window.localStorage.removeItem(this.getResumeStorageKey());
    } catch {
      // Ignore unavailable storage.
    }
  }

  private getResumeStorageKey(): string {
    return `${RESUME_KEY_PREFIX}${encodeURIComponent(this.manifest?.id ?? this.getTitle())}`;
  }

  private applyLanternClasses(): void {
    const focusActive = this.focusMode !== "off" && Boolean(this.activeBlockId);
    const dimInactiveBlocks = this.focusMode === "spotlight" || this.focusMode === "band";
    const litIds = new Set<string>();

    if (focusActive && this.activeBlockId) {
      const activeIndex = this.models.findIndex((model) => model.id === this.activeBlockId);
      const active = this.models[activeIndex];
      const previous = this.models[activeIndex - 1];
      litIds.add(this.activeBlockId);

      if (active?.type === "p" && previous?.type === "h") {
        litIds.add(previous.id);
      }
    }

    for (const model of this.models) {
      const inReading = this.readingArticle?.contains(model.element) ?? false;
      if (!inReading) continue;

      const lit = focusActive && litIds.has(model.id);
      model.element.classList.toggle("is-lit", lit && this.focusMode !== "ruler");
      model.element.classList.toggle("is-ruler", lit && this.focusMode === "ruler");
      model.element.classList.toggle("om-dim", dimInactiveBlocks && !lit);
    }
  }

  private trackFocusChange(source: Exclude<FocusChangeSource, "restore">): void {
    const analyticsWindow = window as unknown as {
      ggAnalyticsConsent?: boolean;
      gtag?: (command: "event", name: string, params: Record<string, string>) => void;
    };

    if (analyticsWindow.ggAnalyticsConsent === true && typeof analyticsWindow.gtag === "function") {
      analyticsWindow.gtag("event", "om_focus_change", { mode: this.focusMode, source });
    }
  }

  private showToast(message: string): void {
    this.root.querySelector(".om-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "om-toast";
    toast.setAttribute("role", "status");
    toast.textContent = message;
    this.root.append(toast);
    window.setTimeout(() => toast.remove(), 2400);
  }

  private getTitle(): string {
    return this.manifest?.title ?? this.sourceArticle?.querySelector("h1")?.textContent ?? "Untitled Observation";
  }

  private getRealm(): string {
    return this.manifest?.realm ?? "The Mortals";
  }

  private getMagnitude(): string {
    return this.manifest?.magnitude ?? "Story";
  }

  private getReadingTime(): number {
    if (this.manifest?.readingTimeMin) {
      return this.manifest.readingTimeMin;
    }

    const attributeValue = Number.parseFloat(this.options.host.getAttribute("reading-time-min") ?? "");
    return Number.isFinite(attributeValue) && attributeValue > 0 ? attributeValue : 5;
  }

  private getObservationNumber(): string {
    return String(this.manifest?.number ?? 1).padStart(3, "0");
  }

  private emitError(message: string, fatal: boolean): void {
    this.bus.emit("error", { message, fatal });
    if (fatal) this.dispatch({ type: "ERROR", fatal });
  }

  private createStyleElement(): HTMLStyleElement {
    const style = document.createElement("style");
    style.textContent = COMPONENT_STYLES;
    return style;
  }

  private lockHostExperience(): void {
    document.documentElement.classList.add("observation-mode-active");
    this.options.host.setAttribute("data-om-open", "");

    if (this.scrollLock) return;

    const htmlStyle = document.documentElement.style;
    const bodyStyle = document.body.style;
    const scrollY = window.scrollY;

    this.scrollLock = {
      scrollY,
      htmlOverflow: htmlStyle.overflow,
      htmlOverscrollBehavior: htmlStyle.overscrollBehavior,
      bodyOverflow: bodyStyle.overflow,
      bodyPosition: bodyStyle.position,
      bodyTop: bodyStyle.top,
      bodyWidth: bodyStyle.width,
    };

    htmlStyle.overflow = "hidden";
    htmlStyle.overscrollBehavior = "none";
    bodyStyle.overflow = "hidden";
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = "100%";
  }

  private unlockHostExperience(): void {
    document.documentElement.classList.remove("observation-mode-active");
    this.options.host.removeAttribute("data-om-open");

    if (!this.scrollLock) return;

    const lock = this.scrollLock;
    this.scrollLock = null;
    const htmlStyle = document.documentElement.style;
    const bodyStyle = document.body.style;

    htmlStyle.overflow = lock.htmlOverflow;
    htmlStyle.overscrollBehavior = lock.htmlOverscrollBehavior;
    bodyStyle.overflow = lock.bodyOverflow;
    bodyStyle.position = lock.bodyPosition;
    bodyStyle.top = lock.bodyTop;
    bodyStyle.width = lock.bodyWidth;
    window.scrollTo(0, lock.scrollY);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }
}
