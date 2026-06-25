import type { MachineState, PanelId } from "./stateMachine";

export type OMEventName =
  | "statechange"
  | "progress"
  | "scenechange"
  | "narration"
  | "panelchange"
  | "preserve"
  | "complete"
  | "fragment"
  | "glossaryopen"
  | "error";

export type OMEventDetail = {
  statechange: { state: MachineState };
  progress: { pct: number; msInGlass: number };
  scenechange: { sceneId: string; mood: string };
  narration: { status: "idle" | "playing" | "paused" | "ended"; oid?: string };
  panelchange: { panelId: PanelId | null };
  preserve: { kind: "record" | "fragment" };
  complete: { msInGlass: number };
  fragment: { oids: string[] };
  glossaryopen: { key: string };
  error: { message: string; fatal: boolean };
};

export type OMEvent<T extends OMEventName = OMEventName> = CustomEvent<OMEventDetail[T]>;

export class EventBus {
  constructor(private readonly target: EventTarget) {}

  emit<T extends OMEventName>(name: T, detail: OMEventDetail[T]): void {
    this.target.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  on<T extends OMEventName>(name: T, cb: (event: OMEvent<T>) => void): () => void {
    const listener = (event: Event) => cb(event as OMEvent<T>);
    this.target.addEventListener(name, listener);
    return () => this.target.removeEventListener(name, listener);
  }
}
