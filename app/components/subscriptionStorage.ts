import { getBrowserStorageItem, setBrowserStorageItem } from "./browserStorage";

export const EMAIL_SUBMITTED_KEY = "gaze-glass.email-submitted.v1";
export const SUBSCRIBED_EMAIL_KEY = "gaze-glass.subscribed-email.v1";
export const SUBSCRIBED_AT_KEY = "gaze-glass.subscribed-at.v1";
export const EMAIL_CAPTURED_EVENT = "gaze-glass:email-captured";

function isBrowser() {
  return typeof window !== "undefined";
}

export function hasSubmittedEmail() {
  if (!isBrowser()) {
    return false;
  }

  return (
    getBrowserStorageItem(EMAIL_SUBMITTED_KEY) === "true" ||
    Boolean(getBrowserStorageItem(SUBSCRIBED_EMAIL_KEY))
  );
}

export function rememberSubscribedEmail(email: string) {
  if (!isBrowser()) {
    return;
  }

  setBrowserStorageItem(EMAIL_SUBMITTED_KEY, "true");
  setBrowserStorageItem(SUBSCRIBED_EMAIL_KEY, email);
  setBrowserStorageItem(SUBSCRIBED_AT_KEY, String(Date.now()));
  window.dispatchEvent(new CustomEvent(EMAIL_CAPTURED_EVENT, { detail: { email } }));
}
