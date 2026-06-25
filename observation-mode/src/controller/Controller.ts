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

type ReaderPrefs = {
  focusMode?: FocusMode;
  generousSpacing?: boolean;
  showImages?: boolean;
  audioMuted?: boolean;
  audioTrackId?: ReadingTrackId;
};

const PREFS_KEY = "gg.om.prefs";
const SITE_SOUND_PREF_KEY = "gaze-glass.sound.v1";
const FOCUS_MODES = new Set<FocusMode>(["off", "spotlight", "band", "ruler"]);
const DEFAULT_READING_TRACK_ID: ReadingTrackId = "reading-mode";
const READING_TRACKS: Array<{
  id: ReadingTrackId;
  label: string;
  src: string;
  gainDb: number;
}> = [
  {
    id: "reading-mode",
    label: "Reading Mode",
    src: "/audio/focus/sacred-glass-reading-mode.mp3",
    gainDb: -8,
  },
  {
    id: "reading-room",
    label: "Reading Room",
    src: "/audio/focus/sacred-glass-reading-room.mp3",
    gainDb: -8,
  },
];

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
  private generousSpacing = false;
  private showImages = false;
  private activeBlockId: string | null = null;
  private activeBlockFrame: number | null = null;
  private releaseActiveBlockTracker: (() => void) | null = null;
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private atmosphereGain: GainNode | null = null;
  private atmosphereOscillators: OscillatorNode[] = [];
  private atmosphereNoise: AudioBufferSourceNode | null = null;
  private atmosphereAudio: HTMLAudioElement | null = null;
  private narrationAudio: HTMLAudioElement | null = null;
  private atmosphereOn = false;
  private narrationOn = false;
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
    plate.querySelector<HTMLButtonElement>("[data-action='exit']")?.addEventListener("click", () => void this.exit());
    plate.addEventListener("keydown", (event) => {
      if (event.key === "Escape") void this.exit();
    });
    this.root.append(plate);
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
        <span class="om-status">${COPY.plateObservation} ${this.getObservationNumber()} · 0% witnessed</span>
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

    shell.querySelector<HTMLButtonElement>("[data-action='exit']")?.addEventListener("click", () => void this.exit());
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
      const narrationAvailable = this.hasNarration();
      panel.setAttribute("aria-label", COPY.soundPanelAria);
      panel.innerHTML = `
        <button class="om-panel-close" type="button" aria-label="${COPY.closePanelAria}">${COPY.close}</button>
        <p class="om-panel-kicker">${COPY.sound}</p>
        <h2>${COPY.sound}</h2>
        <p>${this.getSoundPanelDescription()}</p>
        <p class="om-panel-field-label">${COPY.focusTrack}</p>
        <div class="om-panel-actions om-audio-track-options" role="radiogroup" aria-label="${COPY.focusTrackGroupAria}">
          ${READING_TRACKS.map(
            (track) =>
              `<button type="button" role="radio" data-audio-track="${track.id}" aria-checked="${track.id === this.atmosphereTrackId}" aria-label="${track.label} focus track">${track.label}</button>`,
          ).join("")}
        </div>
        <div class="om-panel-actions">
          <button type="button" data-audio-action="atmosphere" aria-label="${COPY.atmosphereAria}" aria-pressed="${this.atmosphereOn}">${COPY.atmosphere}</button>
          <button type="button" data-audio-action="narration" aria-label="${narrationAvailable ? COPY.narrationAria : COPY.narrationUnavailableAria}" aria-disabled="${!narrationAvailable}" aria-pressed="${this.narrationOn}">${COPY.narration}</button>
          <button type="button" data-audio-action="mute" aria-label="${COPY.muteAria}" aria-pressed="${this.audioMuted}">${COPY.mute}</button>
        </div>
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
        <div class="om-panel-actions">
          <button type="button" data-spacing-toggle aria-label="${COPY.spacingAriaOff}" aria-pressed="false">${COPY.spacing}</button>
        </div>
      `;
    } else {
      panel.setAttribute("aria-label", COPY.textAria);
      panel.innerHTML = `
        <button class="om-panel-close" type="button" aria-label="${COPY.closePanelAria}">${COPY.close}</button>
        <p class="om-panel-kicker">${COPY.text}</p>
        <h2>${COPY.text}</h2>
        <p>${COPY.textDescription}</p>
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
      `;
    }

    panel.querySelector<HTMLButtonElement>(".om-panel-close")?.addEventListener("click", () => this.closePanel());
    panel.querySelectorAll<HTMLButtonElement>("[data-audio-action]").forEach((button) => {
      button.addEventListener("click", () => this.handleAudioAction(button.dataset.audioAction));
    });
    panel.querySelectorAll<HTMLButtonElement>("[data-audio-track]").forEach((button) => {
      button.addEventListener("click", () => this.selectAtmosphereTrack(button.dataset.audioTrack));
    });
    panel.querySelectorAll<HTMLButtonElement>("[data-theme]").forEach((button) => {
      button.addEventListener("click", () => {
        this.root.dataset.omTheme = button.dataset.theme ?? "obsidian";
        this.showToast(`${button.textContent ?? "Theme"} selected.`);
      });
    });
    panel.querySelectorAll<HTMLButtonElement>("[data-size]").forEach((button) => {
      button.addEventListener("click", () => {
        const current = Number.parseFloat(this.root.style.getPropertyValue("--om-fs-body")) || 1.18;
        const direction = Number.parseInt(button.dataset.size ?? "0", 10);
        const next = Math.min(1.6, Math.max(1, current + direction * 0.08));
        this.root.style.setProperty("--om-fs-body", `${next.toFixed(2)}rem`);
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

  private focusToast(mode: FocusMode, previousMode: FocusMode): string {
    if (mode === "spotlight") return COPY.lanternOnToast;
    if (mode === "off" && previousMode === "spotlight") return COPY.lanternOffToast;
    if (mode === "band") return COPY.bandToast;
    if (mode === "ruler") return COPY.rulerToast;
    return COPY.focusResetToast;
  }

  private loadPrefs(): void {
    try {
      const prefs = JSON.parse(window.localStorage.getItem(PREFS_KEY) ?? "{}") as ReaderPrefs;
      this.focusMode = this.parseFocusMode(prefs.focusMode);
      this.generousSpacing = Boolean(prefs.generousSpacing);
      this.showImages = Boolean(prefs.showImages);
      this.audioMuted = Boolean(prefs.audioMuted);
      this.atmosphereTrackId = this.parseAtmosphereTrackId(prefs.audioTrackId);
    } catch {
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
    this.root.dataset.focusMode = this.focusMode;
    this.root.dataset.spacingMode = this.generousSpacing ? "on" : "off";
    this.root.dataset.imagesMode = this.showImages ? "on" : "off";
    this.root.dataset.audioMode = this.audioMuted ? "muted" : "on";
    this.root.dataset.audioTrackId = this.atmosphereTrackId;
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

    const spacingToggle = this.root.querySelector<HTMLButtonElement>("[data-spacing-toggle]");
    spacingToggle?.setAttribute("aria-pressed", String(this.generousSpacing));
    spacingToggle?.setAttribute("aria-label", this.generousSpacing ? COPY.spacingAriaOn : COPY.spacingAriaOff);
    this.updateSoundControls();
  }

  private updateSoundControls(): void {
    const narrationAvailable = this.hasNarration();
    const atmosphereButton = this.root.querySelector<HTMLButtonElement>("[data-audio-action='atmosphere']");
    const narrationButton = this.root.querySelector<HTMLButtonElement>("[data-audio-action='narration']");
    const muteButton = this.root.querySelector<HTMLButtonElement>("[data-audio-action='mute']");

    atmosphereButton?.setAttribute("aria-pressed", String(this.atmosphereOn));
    atmosphereButton?.setAttribute(
      "aria-label",
      this.atmosphereOn ? COPY.atmosphereStopAria : `${COPY.atmosphereAria}: ${this.getAtmosphereTrack().label}`,
    );

    if (narrationButton) {
      narrationButton.setAttribute("aria-disabled", String(!narrationAvailable));
      narrationButton.setAttribute("aria-pressed", String(this.narrationOn));
      narrationButton.setAttribute(
        "aria-label",
        narrationAvailable ? COPY.narrationAria : COPY.narrationUnavailableAria,
      );
    }

    muteButton?.setAttribute("aria-pressed", String(this.audioMuted));

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

    if (action === "narration") {
      void this.toggleNarration();
      return;
    }

    if (action === "mute") {
      this.toggleMute();
    }
  }

  private getSoundPanelDescription(): string {
    if (this.hasNarration()) {
      return this.atmosphereOn || this.narrationOn ? COPY.soundActive : COPY.soundReady;
    }

    return COPY.soundReadyNoNarration;
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

    if (changed && this.atmosphereOn) {
      this.stopAtmosphere();
      if (this.startAtmosphere()) {
        this.playInterfaceSound("success");
        this.showToast(`${track.label} playing.`);
      }
    } else {
      this.playInterfaceSound("select");
      this.showToast(`${track.label} selected.`);
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
    const context = this.ensureAudioContext();
    if (!context || !this.masterGain) return false;

    this.stopAtmosphere();
    this.atmosphereOn = true;

    const readingTrack = this.getAtmosphereTrack();
    if (readingTrack) {
      this.atmosphereAudio = new Audio(readingTrack.src);
      this.atmosphereAudio.loop = true;
      this.atmosphereAudio.volume = this.gainDbToVolume(readingTrack.gainDb);
      void this.atmosphereAudio.play().catch(() => {
        this.atmosphereOn = false;
        this.updateSoundControls();
        this.showToast(COPY.soundUnavailableToast);
      });
      return true;
    }

    if (this.manifest?.ambientTrack?.src) {
      this.atmosphereAudio = new Audio(this.manifest.ambientTrack.src);
      this.atmosphereAudio.loop = this.manifest.ambientTrack.loop ?? true;
      this.atmosphereAudio.volume = this.gainDbToVolume(this.manifest.ambientTrack.gainDb ?? -18);
      void this.atmosphereAudio.play().catch(() => {
        this.atmosphereOn = false;
        this.updateSoundControls();
        this.showToast(COPY.soundUnavailableToast);
      });
      return true;
    }

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

  private toggleMute(): void {
    this.audioMuted = !this.audioMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.audioMuted ? 0 : 0.16;
    }

    if (this.narrationAudio) {
      this.narrationAudio.muted = this.audioMuted;
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
    this.stopAtmosphere();
    this.narrationAudio?.pause();
    this.narrationOn = false;
    this.clearNarrationHighlight();
    this.updateSoundControls();
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
    this.models.forEach(({ element }) => element.classList.remove("is-lit", "om-dim"));
  }

  private scheduleActiveBlockUpdate(): void {
    if (this.activeBlockFrame !== null) return;
    this.activeBlockFrame = window.requestAnimationFrame(() => {
      this.activeBlockFrame = null;
      this.updateActiveBlock();
    });
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
  }

  private applyLanternClasses(): void {
    const lanternActive = this.focusMode === "spotlight" && Boolean(this.activeBlockId);
    const litIds = new Set<string>();

    if (lanternActive && this.activeBlockId) {
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

      const lit = lanternActive && litIds.has(model.id);
      model.element.classList.toggle("is-lit", lit);
      model.element.classList.toggle("om-dim", lanternActive && !lit);
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
