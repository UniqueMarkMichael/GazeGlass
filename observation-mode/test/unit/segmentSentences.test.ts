import { describe, expect, it } from "vitest";
import { segmentSentences } from "../../src/content/segmentSentences";

describe("segmentSentences", () => {
  it("creates deterministic sentence ids", () => {
    expect(segmentSentences("One. Two!", "b3")).toEqual([
      { oid: "b3-s00", text: "One. " },
      { oid: "b3-s01", text: "Two!" },
    ]);
  });

  it("does not split common abbreviations or decimals", () => {
    expect(segmentSentences("Dr. Smith paid 3.14 coins. Then he left.", "b0")).toEqual([
      { oid: "b0-s00", text: "Dr. Smith paid 3.14 coins. " },
      { oid: "b0-s01", text: "Then he left." },
    ]);
  });

  it("keeps glossary markers inside sentence text", () => {
    expect(segmentSentences("[[justice|Justice]] arrived. Marcella breathed.", "b1")).toEqual([
      { oid: "b1-s00", text: "[[justice|Justice]] arrived. " },
      { oid: "b1-s01", text: "Marcella breathed." },
    ]);
  });
});
