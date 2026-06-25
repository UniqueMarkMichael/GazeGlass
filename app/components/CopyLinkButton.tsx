"use client";

import { useState } from "react";
import { playGlassSound } from "./glassSound";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (!navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    playGlassSound("copy");
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button className="copy-link-button" type="button" onClick={copyLink}>
      {copied ? "Link copied" : "Copy link"}
    </button>
  );
}
