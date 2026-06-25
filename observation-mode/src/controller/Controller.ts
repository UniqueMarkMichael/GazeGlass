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
    this.renderEntryButton();
  }

  disconnect(): void {
    this.releaseTrap?.();
    this.releaseTrap = null;
  }

  getState(): MachineState {
    return this.state;
  }

  setManifest(manifest: ObservationManifest): void {
    this.manifest = manifest;
  }

  on<T extends OMEventName>(name: T, cb: (event: OMEvent<T>) => void): () => void {
    return this.bus.on(name, cb);
  }

  async open(): Promise<void> {
    if (this.state !== "idle") return;
    this.previousActiveElement = document.activeElement;
    this.dispatch({ type: "OPEN" });
    this.renderThreshold();
    this.root.classList.add("is-open");
    this.sourceArticle?.setAttribute("aria-hidden", "true");
    this.releaseTrap = trapFocus(this.root);
    this.root.focus();
    this.announce("Entering Observation Mode.");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    await this.delay(reducedMotion ? 0 : 650);
    if (this.isState("entering")) {
      this.dispatch({ type: "THRESHOLD_DONE" });
      this.renderWitnessing();
    }
  }

  async exit(): Promise<void> {
    if (this.state === "idle" || this.state === "exiting") return;
    this.closePanel(false);
    this.dispatch({ type: "EXIT" });
    this.root.classList.remove("is-open");
    this.sourceArticle?.removeAttribute("aria-hidden");
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
      if (announce) this.announce("Panel closed.");
    }
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
    if (this.entryMount.querySelector(".om-entry")) return;

    const button = document.createElement("button");
    button.className = "om-entry";
    button.type = "button";
    button.setAttribute("aria-label", COPY.openAria);
    button.innerHTML = `<strong>${COPY.open}</strong><span>Immersive reading · ${this.getReadingTime()} min</span>`;
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
          <button type="button" data-action="exit">${COPY.returnArchive}</button>
        </div>
      </div>
    `;

    plate.querySelector<HTMLButtonElement>("[data-action='skip']")?.addEventListener("click", () => {
      this.dispatch({ type: "THRESHOLD_DONE" });
      this.renderWitnessing();
    });
    plate.querySelector<HTMLButtonElement>("[data-action='exit']")?.addEventListener("click", () => void this.exit());
    this.root.append(plate);
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
        <button type="button" data-action="exit">${COPY.returnArchive}</button>
        <span class="om-status">${COPY.plateObservation} ${this.getObservationNumber()} · 0% witnessed</span>
        <button type="button" data-panel="sound" aria-label="Sound and narration settings">${COPY.hear}</button>
        <button type="button" data-panel="focus" aria-label="Reading focus aids">${COPY.focus}</button>
        <button type="button" data-panel="display" aria-label="Text appearance settings">${COPY.display}</button>
        <button type="button" data-action="preserve" aria-label="Save this Observation">${COPY.preserve}</button>
      </div>
    `;

    this.readingArticle = shell.querySelector<HTMLElement>(".om-reading");
    if (this.readingArticle && this.manifest?.body?.length) {
      this.models = renderBlocks(this.manifest.body, this.readingArticle, this.manifest.glossary);
    } else if (this.readingArticle && this.sourceArticle) {
      for (const node of Array.from(this.sourceArticle.children)) {
        this.readingArticle.append(node.cloneNode(true));
      }
    }

    shell.querySelector<HTMLButtonElement>("[data-action='exit']")?.addEventListener("click", () => void this.exit());
    shell.querySelector<HTMLButtonElement>("[data-action='preserve']")?.addEventListener("click", () => {
      this.bus.emit("preserve", { kind: "record" });
      this.showToast("Preserved.");
      this.announce("Preserved.");
    });
    shell.querySelectorAll<HTMLButtonElement>("[data-panel]").forEach((button) => {
      button.addEventListener("click", () => this.openPanel(button.dataset.panel as PanelId));
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
    this.readingArticle?.focus();
  }

  private renderPanel(panelId: PanelId): void {
    this.root.querySelector(".om-panel")?.remove();
    const panel = document.createElement("section");
    panel.className = "om-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");

    if (panelId === "sound") {
      panel.setAttribute("aria-label", "Sound and narration settings");
      panel.innerHTML = `
        <button class="om-panel-close" type="button" aria-label="Close panel">Close</button>
        <p class="om-panel-kicker">${COPY.hear}</p>
        <h2>Sound is paused until you turn it on.</h2>
        <p>Narration is not available for this record yet. The text remains the transcript, and no audio will play unless you choose it in a later build.</p>
        <div class="om-panel-actions">
          <button type="button" disabled>Atmosphere</button>
          <button type="button" disabled>Hear the Seer</button>
          <button type="button" disabled>Mute all</button>
        </div>
      `;
    } else if (panelId === "focus") {
      panel.setAttribute("aria-label", "Reading focus aids");
      panel.innerHTML = `
        <button class="om-panel-close" type="button" aria-label="Close panel">Close</button>
        <p class="om-panel-kicker">${COPY.focus}</p>
        <h2>Focus the Glass</h2>
        <p>Use a calmer reading rhythm while the full focus engine is being built.</p>
        <div class="om-panel-actions">
          <button type="button" data-focus-mode="off">Off</button>
          <button type="button" data-focus-mode="spacing">Generous spacing</button>
        </div>
      `;
    } else {
      panel.setAttribute("aria-label", "Text appearance settings");
      panel.innerHTML = `
        <button class="om-panel-close" type="button" aria-label="Close panel">Close</button>
        <p class="om-panel-kicker">${COPY.display}</p>
        <h2>Shape the Text</h2>
        <p>Change the atmosphere without moving the prose out of reach.</p>
        <div class="om-panel-actions">
          <button type="button" data-theme="obsidian">Obsidian</button>
          <button type="button" data-theme="parchment">Parchment</button>
          <button type="button" data-theme="moonlight">Moonlight</button>
          <button type="button" data-size="-1">A-</button>
          <button type="button" data-size="1">A+</button>
        </div>
      `;
    }

    panel.querySelector<HTMLButtonElement>(".om-panel-close")?.addEventListener("click", () => this.closePanel());
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
        const mode = button.dataset.focusMode ?? "off";
        this.root.dataset.focusMode = mode;
        this.showToast(mode === "spacing" ? "Generous spacing on." : "Focus reset.");
      });
    });
    panel.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.closePanel();
    });

    this.root.append(panel);
    panel.querySelector<HTMLElement>(".om-panel-close")?.focus();
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
    return this.manifest?.readingTimeMin ?? 5;
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

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }
}
