import { ObservationModeElement } from "./ObservationModeElement";
import type { OMEvent, OMEventName } from "./controller/eventBus";
import type { MachineState } from "./controller/stateMachine";
import type { ObservationManifest } from "./content/types";

export type { OMEvent, OMEventName, MachineState, ObservationManifest };
export { ObservationModeElement };

export interface ObservationModeAPI {
  open(): Promise<void>;
  exit(): Promise<void>;
  getState(): MachineState;
  setManifest(manifest: ObservationManifest): void;
  getReadingLog(): unknown;
  on<T extends OMEventName>(event: T, cb: (event: OMEvent<T>) => void): () => void;
}

declare global {
  interface HTMLElementTagNameMap {
    "observation-mode": ObservationModeElement;
  }
}

if (typeof window !== "undefined" && !customElements.get("observation-mode")) {
  customElements.define("observation-mode", ObservationModeElement);
}
