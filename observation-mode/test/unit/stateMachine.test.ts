import { describe, expect, it } from "vitest";
import { transition } from "../../src/controller/stateMachine";

describe("stateMachine", () => {
  it("opens into entering and then witnessing", () => {
    expect(transition("idle", { type: "OPEN" })).toBe("entering");
    expect(transition("entering", { type: "THRESHOLD_DONE" })).toBe("witnessing");
  });

  it("routes panels back to witnessing", () => {
    expect(transition("witnessing", { type: "OPEN_PANEL", panelId: "display" })).toBe("panel");
    expect(transition("panel", { type: "CLOSE_PANEL" })).toBe("witnessing");
  });

  it("degrades fatal errors to idle", () => {
    expect(transition("witnessing", { type: "ERROR", fatal: true })).toBe("idle");
  });
});
