"use client";

import { useEffect } from "react";

export function ObservationModeBoot() {
  useEffect(() => {
    void import("../../observation-mode/src/index");
  }, []);

  return null;
}
