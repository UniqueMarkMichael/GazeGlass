"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "loading" | "success" | "invalid" | "duplicate" | "error" | "unconfigured";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SeerCircleForm() {
  const [email, setEmail] = useState("");
  const [savedEmail, setSavedEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) {
      setFormState("invalid");
      return;
    }

    if (savedEmail === normalizedEmail) {
      setFormState("duplicate");
      return;
    }

    setFormState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const result = (await response.json()) as { message?: string };

      if (response.ok) {
        setSavedEmail(normalizedEmail);
        setEmail("");
        setFormState("success");
        return;
      }

      if (response.status === 503) {
        setErrorMessage(result.message || "");
        setFormState("unconfigured");
        return;
      }

      setErrorMessage(result.message || "");
      setFormState("error");
    } catch {
      setErrorMessage("");
      setFormState("error");
    }
  }

  const message = {
    idle: "Letters from the Seer only. Leave the circle anytime. No spam crosses the glass.",
    loading: "The glass is carrying your name to the Seer.",
    success: "The Seer has your name. Watch for the first letter — Marok carries it.",
    invalid: "The glass could not read that. Check the address and look again.",
    duplicate: "You are already within the circle. The next observation is on its way.",
    error:
      errorMessage ||
      "The glass clouded before the name could be recorded. Please try again in a moment.",
    unconfigured:
      errorMessage ||
      "The Circle is ready, but Mailchimp still needs to be connected in Vercel.",
  }[formState];

  const isBusy = formState === "loading";

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="email">Email address</label>
      <div>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          aria-describedby="seer-circle-message"
          aria-invalid={formState === "invalid"}
          disabled={isBusy}
          onChange={(event) => {
            setEmail(event.target.value);
            if (formState === "invalid" || formState === "error" || formState === "unconfigured") {
              setFormState("idle");
            }
          }}
        />
        <button type="submit" disabled={isBusy}>
          {isBusy ? "Opening the Glass" : "Join the Circle"}
        </button>
      </div>
      <p className={`form-note ${formState}`} id="seer-circle-message" role="status">
        {message}
      </p>
    </form>
  );
}
