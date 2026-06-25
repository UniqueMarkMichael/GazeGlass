import { segmentSentences } from "./segmentSentences";
import type { Block, BlockModel, GlossaryEntry } from "./types";

function renderInlineText(text: string, glossary: GlossaryEntry[]): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const glossaryKeys = new Set(glossary.map((entry) => entry.key));
  const markerPattern = /\[\[([a-zA-Z0-9_-]+)\|([^\]]+)]]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = markerPattern.exec(text)) !== null) {
    const [raw, key, surface] = match;
    fragment.append(document.createTextNode(text.slice(lastIndex, match.index)));

    if (key && surface && glossaryKeys.has(key)) {
      const button = document.createElement("button");
      button.className = "om-term";
      button.type = "button";
      button.dataset.key = key;
      button.textContent = surface;
      fragment.append(button);
    } else {
      fragment.append(document.createTextNode(surface ?? raw));
    }

    lastIndex = match.index + raw.length;
  }

  fragment.append(document.createTextNode(text.slice(lastIndex)));
  return fragment;
}

function appendSentences(element: HTMLElement, text: string, blockId: string, glossary: GlossaryEntry[]): BlockModel {
  const sentences = segmentSentences(text, blockId);

  for (const sentence of sentences) {
    const span = document.createElement("span");
    span.className = "om-s";
    span.dataset.oid = sentence.oid;
    span.append(renderInlineText(sentence.text, glossary));
    element.append(span);
  }

  return {
    id: blockId,
    type: "p",
    element,
    sentences,
  };
}

export function renderBlocks(blocks: Block[], target: HTMLElement, glossary: GlossaryEntry[] = []): BlockModel[] {
  const models: BlockModel[] = [];
  target.replaceChildren();

  for (const block of blocks) {
    if (block.type === "image") {
      const element = document.createElement("figure");
      element.id = block.id;
      element.className = `om-block om-image-block${block.wide ? " om-image-block-wide" : ""}`;
      element.dataset.blockId = block.id;

      const image = document.createElement("img");
      image.src = block.src;
      image.alt = block.alt;
      image.loading = "lazy";
      element.append(image);

      if (block.caption) {
        const caption = document.createElement("figcaption");
        caption.textContent = block.caption;
        element.append(caption);
      }

      target.append(element);
      models.push({ id: block.id, type: block.type, element, sentences: [] });
      continue;
    }

    if (block.type === "hr") {
      const element = document.createElement("hr");
      element.id = block.id;
      element.className = "om-block";
      element.dataset.blockId = block.id;
      target.append(element);
      models.push({ id: block.id, type: block.type, element, sentences: [] });
      continue;
    }

    const element =
      block.type === "h"
        ? document.createElement(`h${block.level}`)
        : block.type === "blockquote"
          ? document.createElement("blockquote")
          : block.type === "fieldnote"
            ? document.createElement("aside")
            : document.createElement("p");

    element.id = block.id;
    element.className = "om-block";
    element.dataset.blockId = block.id;

    if (block.type === "fieldnote") {
      element.setAttribute("aria-label", block.speaker ? `Field note from ${block.speaker}` : "Field note");
    }

    const model = appendSentences(element, block.text, block.id, glossary);
    models.push({ ...model, type: block.type });
    target.append(element);
  }

  return models;
}
