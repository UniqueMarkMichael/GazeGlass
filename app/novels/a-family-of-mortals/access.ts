import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

export const AFOM_ACCESS_COOKIE = "afom_preview_access";

function previewPassword() {
  const password = process.env.AFOM_PREVIEW_PASSWORD;

  if (!password) {
    throw new Error("AFOM_PREVIEW_PASSWORD is not configured.");
  }

  return password;
}

export function isCorrectAfomPassword(candidate: string) {
  const expected = Buffer.from(previewPassword());
  const received = Buffer.from(candidate.trim());

  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function afomAccessToken() {
  return createHmac("sha256", previewPassword())
    .update("gaze-glass:afom-preview:v4")
    .digest("hex");
}

export function hasAfomAccess(cookieValue?: string) {
  if (!cookieValue) return false;

  const expected = Buffer.from(afomAccessToken());
  const received = Buffer.from(cookieValue);

  return expected.length === received.length && timingSafeEqual(expected, received);
}
