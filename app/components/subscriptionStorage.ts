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
    window.localStorage.getItem(EMAIL_SUBMITTED_KEY) === "true" ||
    Boolean(window.localStorage.getItem(SUBSCRIBED_EMAIL_KEY))
  );
}

export function rememberSubscribedEmail(email: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(EMAIL_SUBMITTED_KEY, "true");
  window.localStorage.setItem(SUBSCRIBED_EMAIL_KEY, email);
  window.localStorage.setItem(SUBSCRIBED_AT_KEY, String(Date.now()));
  window.dispatchEvent(new CustomEvent(EMAIL_CAPTURED_EVENT, { detail: { email } }));
}
