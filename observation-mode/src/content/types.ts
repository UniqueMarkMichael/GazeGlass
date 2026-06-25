export type ObservationId = string;
export type Realm = "The Mortals" | "The Gods" | "The Spirits" | "The Codex";
export type Magnitude = "Story" | "Novella" | "Novel";
export type Deity = "Justice" | "Love" | "Beauty" | "War" | "Fortune" | "Story" | "Wisdom";

export interface ObservationManifest {
  schemaVersion: 1;
  id: ObservationId;
  number: number;
  title: string;
  realm: Realm;
  magnitude: Magnitude;
  deity: Deity | null;
  recordedBy: string;
  readingTimeMin: number;
  wordCount: number;
  contentNote?: string | null;
  body?: Block[];
  scenes: Scene[];
  glossary: GlossaryEntry[];
  narration?: NarrationManifest;
  ambientTrack?: AudioRef;
  keyQuotations?: string[];
  nextPaths?: NextPath[];
  secondGaze?: SecondGazeNote[];
  lenses?: Partial<Record<"mirror" | "orb" | "stained", LensLayer>>;
  chapters?: Chapter[];
}

export type Block =
  | { type: "p"; id: string; text: InlineText }
  | { type: "h"; id: string; level: 2 | 3; text: InlineText }
  | { type: "hr"; id: string }
  | { type: "blockquote"; id: string; text: InlineText }
  | { type: "fieldnote"; id: string; speaker?: string; text: InlineText };

export type InlineText = string;

export interface Scene {
  id: string;
  startBlockId: string;
  mood: Deity | "Neutral";
  accentOverride?: string;
  ambientCue?: AudioRef;
  lightOverride?: string;
}

export interface GlossaryEntry {
  key: string;
  title: string;
  kind: "god" | "spirit" | "mortal" | "law" | "term";
  blurb: string;
  portrait?: string;
  href?: string;
}

export interface NarrationManifest {
  audio: AudioRef;
  durationMs: number;
  cues: NarrationCue[];
  words?: WordCue[];
  voice?: string;
}

export interface NarrationCue {
  oid: string;
  startMs: number;
  endMs: number;
}

export interface WordCue {
  oid: string;
  wordIndex: number;
  startMs: number;
  endMs: number;
}

export interface AudioRef {
  src: string;
  format: "mp3" | "ogg" | "wav";
  loop?: boolean;
  gainDb?: number;
}

export interface NextPath {
  label: string;
  href: string;
  kind: "preserve" | "follow-deity" | "random" | "archive";
}

export interface Chapter {
  id: string;
  title: string;
  startBlockId: string;
}

export interface SecondGazeNote {
  oid: string;
  note: string;
}

export interface LensLayer {
  blocks: Block[];
}

export interface SentenceModel {
  oid: string;
  text: string;
}

export interface BlockModel {
  id: string;
  type: Block["type"];
  element: HTMLElement;
  sentences: SentenceModel[];
}
