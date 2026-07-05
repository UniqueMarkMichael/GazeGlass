"use client";

import { useEffect, useRef, useState } from "react";

type PressCopyButtonProps = {
  text: string;
  label?: string;
  ariaLabel?: string;
};

function fallbackCopy(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.top = "-1000px";
  textArea.style.left = "-1000px";
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textArea);
  }
}

export function PressCopyButton({ text, label = "Copy", ariaLabel }: PressCopyButtonProps) {
  const [status, setStatus] = useState(label);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  async function copyText() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
      setStatus("Copied");
    } catch {
      fallbackCopy(text);
      setStatus("Copied");
    }

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => setStatus(label), 2000);
  }

  return (
    <button className="press-copy-button" type="button" aria-label={ariaLabel ?? label} onClick={copyText}>
      <span aria-live="polite">{status}</span>
    </button>
  );
}
