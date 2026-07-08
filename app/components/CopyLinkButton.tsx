"use client";

import { useState } from "react";
import { playGlassSound } from "./glassSound";

type CopyLinkButtonProps = {
  onCopied?: () => void;
  onPressStart?: () => void;
};

export function CopyLinkButton({ onCopied, onPressStart }: CopyLinkButtonProps = {}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (!navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    onCopied?.();
    playGlassSound("copy");
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      className="copy-link-button"
      type="button"
      aria-label={copied ? "Page link copied" : "Copy page link"}
      onFocus={onPressStart}
      onClick={copyLink}
      onPointerDown={onPressStart}
    >
      <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
    </button>
  );
}
