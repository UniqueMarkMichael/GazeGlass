export type MachineState = "idle" | "entering" | "witnessing" | "panel" | "sealing" | "exiting";
export type PanelId = "sound" | "focus" | "display";

export type MachineEvent =
  | { type: "OPEN" }
  | { type: "THRESHOLD_DONE" }
  | { type: "OPEN_PANEL"; panelId: PanelId }
  | { type: "CLOSE_PANEL" }
  | { type: "REACH_END" }
  | { type: "SEAL_DISMISS" }
  | { type: "EXIT" }
  | { type: "TEARDOWN_DONE" }
  | { type: "ERROR"; fatal: boolean };

export function transition(state: MachineState, event: MachineEvent): MachineState {
  if (event.type === "ERROR" && event.fatal) {
    return "idle";
  }

  switch (state) {
    case "idle":
      return event.type === "OPEN" ? "entering" : state;
    case "entering":
      if (event.type === "THRESHOLD_DONE") return "witnessing";
      if (event.type === "EXIT") return "exiting";
      return state;
    case "witnessing":
      if (event.type === "OPEN_PANEL") return "panel";
      if (event.type === "REACH_END") return "sealing";
      if (event.type === "EXIT") return "exiting";
      return state;
    case "panel":
      if (event.type === "CLOSE_PANEL") return "witnessing";
      if (event.type === "EXIT") return "exiting";
      return state;
    case "sealing":
      if (event.type === "SEAL_DISMISS") return "witnessing";
      if (event.type === "EXIT") return "exiting";
      return state;
    case "exiting":
      return event.type === "TEARDOWN_DONE" ? "idle" : state;
    default:
      return state;
  }
}
