import { ObservationModeController } from "./controller/Controller";
import type { OMEvent, OMEventName } from "./controller/eventBus";
import type { MachineState } from "./controller/stateMachine";
import type { ObservationManifest } from "./content/types";

export class ObservationModeElement extends HTMLElement {
  private controller: ObservationModeController | null = null;
  private pendingManifest: ObservationManifest | null = null;

  static get observedAttributes() {
    return ["manifest-src"];
  }

  connectedCallback(): void {
    if (this.controller) return;
    this.controller = new ObservationModeController({ host: this, manifest: this.pendingManifest ?? undefined });
    this.controller.connect();
    void this.loadManifestFromAttribute();
  }

  disconnectedCallback(): void {
    this.controller?.disconnect();
    this.controller = null;
  }

  attributeChangedCallback(): void {
    if (this.isConnected) {
      void this.loadManifestFromAttribute();
    }
  }

  set manifest(manifest: ObservationManifest) {
    this.pendingManifest = manifest;
    this.controller?.setManifest(manifest);
  }

  getState(): MachineState {
    return this.controller?.getState() ?? "idle";
  }

  open(): Promise<void> {
    return this.controller?.open() ?? Promise.resolve();
  }

  exit(): Promise<void> {
    return this.controller?.exit() ?? Promise.resolve();
  }

  setManifest(manifest: ObservationManifest): void {
    this.manifest = manifest;
  }

  getReadingLog() {
    return { records: {}, totals: { completedCount: 0, totalMsInGlass: 0, longestSingleSessionMs: 0, finishStreak: 0, bestFinishStreak: 0 } };
  }

  on<T extends OMEventName>(event: T, cb: (event: OMEvent<T>) => void): () => void {
    return this.controller?.on(event, cb) ?? (() => {});
  }

  private async loadManifestFromAttribute(): Promise<void> {
    const manifestSrc = this.getAttribute("manifest-src");
    if (!manifestSrc) return;

    try {
      const response = await fetch(manifestSrc);
      if (!response.ok) {
        throw new Error(`Manifest request failed: ${response.status}`);
      }
      const manifest = (await response.json()) as ObservationManifest;
      this.setManifest(manifest);
    } catch (error) {
      console.warn("Observation Mode manifest failed to load. Plain article remains readable.", error);
    }
  }
}
