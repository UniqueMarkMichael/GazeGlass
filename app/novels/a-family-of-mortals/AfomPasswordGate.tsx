"use client";

import { FormEvent, useState } from "react";

export function AfomPasswordGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isOpening, setIsOpening] = useState(false);

  async function unseal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsOpening(true);

    try {
      const response = await fetch("/api/afom-preview/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      if (!response.ok) {
        setError("The Glass does not recognize that word.");
        setIsOpening(false);
        return;
      }

      window.location.reload();
    } catch {
      setError("The seal could not be reached. Try again.");
      setIsOpening(false);
    }
  }

  return (
    <main className="afom-gate">
      <div className="afom-gate-art" aria-hidden="true" />
      <div className="afom-gate-veil" aria-hidden="true" />
      <a className="afom-gate-brand" href="/#home" aria-label="Return to Gaze Glass">
        <img src="/brand/gaze-glass-spectrum-mark.svg" alt="" />
        <span>Gaze Glass</span>
      </a>

      <section className="afom-gate-chamber" aria-labelledby="afom-gate-title">
        <p className="afom-gate-eyebrow">A sealed account</p>
        <div className="afom-gate-sigil" aria-hidden="true">◈</div>
        <h1 id="afom-gate-title">A Family of Mortals</h1>
        <p>The Shah family waits behind the Glass. Speak the private word to reveal their account.</p>

        <form onSubmit={unseal}>
          <label htmlFor="afom-password">Private word</label>
          <div className="afom-gate-input-row">
            <input
              id="afom-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              required
              aria-describedby={error ? "afom-gate-error" : "afom-gate-note"}
            />
            <button type="submit" disabled={isOpening}>
              {isOpening ? "Unsealing…" : "Unseal"}
            </button>
          </div>
          <p className="afom-gate-note" id="afom-gate-note">The private word is case-sensitive.</p>
          {error ? <p className="afom-gate-error" id="afom-gate-error" role="alert">{error}</p> : null}
        </form>
      </section>
    </main>
  );
}
