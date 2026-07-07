"use client";

import { useState } from "react";

export function OpeningRite() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <button
      className="opening-rite"
      type="button"
      aria-label="Skip opening ritual"
      onClick={() => setIsDismissed(true)}
    >
      <span aria-hidden="true">Behold.</span>
      <span aria-hidden="true">The glass wakes.</span>
      <span aria-hidden="true">A soul appears.</span>
    </button>
  );
}
