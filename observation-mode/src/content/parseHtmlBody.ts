import { segmentSentences } from "./segmentSentences";
import type { BlockModel } from "./types";

const BLOCK_SELECTOR = "p, h2, h3, blockquote, aside, hr";

function blockTypeFor(element: Element): BlockModel["type"] {
  const tagName = element.tagName.toLowerCase();
  if (tagName === "hr") return "hr";
  if (tagName === "h2" || tagName === "h3") return "h";
  if (tagName === "blockquote") return "blockquote";
  if (tagName === "aside") return "fieldnote";
  return "p";
}

function wrapTextSentences(element: HTMLElement, blockId: string): BlockModel {
  const text = element.textContent ?? "";
  const sentences = segmentSentences(text, blockId);
  element.replaceChildren();

  for (const sentence of sentences) {
    const span = document.createElement("span");
    span.className = "om-s";
    span.dataset.oid = sentence.oid;
    span.textContent = sentence.text;
    element.append(span);
  }

  return {
    id: blockId,
    type: blockTypeFor(element),
    element,
    sentences,
  };
}

export function parseHtmlBody(article: HTMLElement): BlockModel[] {
  const blocks = Array.from(article.querySelectorAll(BLOCK_SELECTOR)).filter((node) => {
    return node.parentElement === article || node.closest(".om-source") === article;
  });

  return blocks.map((block, index) => {
    const element = block as HTMLElement;
    const blockId = element.id || `b${index}`;
    element.id = blockId;
    element.classList.add("om-block");
    element.dataset.blockId = blockId;

    if (element.tagName.toLowerCase() === "hr") {
      return { id: blockId, type: "hr", element, sentences: [] };
    }

    return wrapTextSentences(element, blockId);
  });
}
