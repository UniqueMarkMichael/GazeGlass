import type { SentenceModel } from "./types";

const ABBREVIATIONS = new Set(["Mr.", "Mrs.", "Ms.", "Dr.", "St.", "vs.", "etc.", "e.g.", "i.e."]);

function isBoundary(text: string, index: number): boolean {
  const char = text[index];
  if (!char || !".!?…".includes(char)) {
    return false;
  }

  const prefix = text.slice(0, index + 1);
  const wordMatch = prefix.match(/(?:^|\s)(\S+)$/);
  const token = wordMatch?.[1] ?? "";
  const previous = text[index - 1] ?? "";
  const next = text[index + 1] ?? "";

  if (char === "." && ABBREVIATIONS.has(token)) {
    return false;
  }

  if (char === "." && /\d/.test(previous) && /\d/.test(next)) {
    return false;
  }

  if (char === "." && /^[A-Z]\.$/.test(token)) {
    return false;
  }

  if (char === "…" && next && !/\s/.test(next)) {
    return false;
  }

  const rest = text.slice(index + 1);
  if (!rest.trim()) {
    return true;
  }

  return /^\s+["“‘']?[A-Z]/.test(rest);
}

export function segmentSentences(text: string, blockId: string): SentenceModel[] {
  const sentences: SentenceModel[] = [];
  let start = 0;

  for (let index = 0; index < text.length; index += 1) {
    if (!isBoundary(text, index)) {
      continue;
    }

    let end = index + 1;
    while (end < text.length && /\s/.test(text[end] ?? "")) {
      end += 1;
    }

    const sentenceText = text.slice(start, end);
    if (sentenceText.trim()) {
      sentences.push({
        oid: `${blockId}-s${String(sentences.length).padStart(2, "0")}`,
        text: sentenceText,
      });
    }
    start = end;
  }

  const tail = text.slice(start);
  if (tail.trim()) {
    sentences.push({
      oid: `${blockId}-s${String(sentences.length).padStart(2, "0")}`,
      text: tail,
    });
  }

  return sentences;
}
