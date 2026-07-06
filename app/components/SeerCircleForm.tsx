"use client";

import { FormEvent, useState } from "react";
import { playGlassSound } from "./glassSound";
import { rememberSubscribedEmail } from "./subscriptionStorage";

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
      playGlassSound("error");
      return;
    }

    if (savedEmail === normalizedEmail) {
      setFormState("duplicate");
      playGlassSound("select");
      return;
    }

    setFormState("loading");
    setErrorMessage("");
    playGlassSound("travel");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail, source: "seer-circle" }),
      });

      const result = (await response.json()) as { message?: string };

      if (response.ok) {
        rememberSubscribedEmail(normalizedEmail);
        setSavedEmail(normalizedEmail);
        setEmail("");
        setFormState("success");
        playGlassSound("success");
        return;
      }

      if (response.status === 503) {
        setErrorMessage(result.message || "");
        setFormState("unconfigured");
        playGlassSound("error");
        return;
      }

      setErrorMessage(result.message || "");
      setFormState("error");
      playGlassSound("error");
    } catch {
      setErrorMessage("");
      setFormState("error");
      playGlassSound("error");
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

  const statusLabel = {
    idle: "Circle promise",
    loading: "Opening",
    success: "Name received",
    invalid: "Check the address",
    duplicate: "Already joined",
    error: "Try again",
    unconfigured: "Almost ready",
  }[formState];

  const isBusy = formState === "loading";
  const statusRole = formState === "invalid" || formState === "error" ? "alert" : "status";

  return (
    <form onSubmit={submit} noValidate data-state={formState}>
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
            if (formState !== "idle" && formState !== "loading") {
              setFormState("idle");
            }
          }}
        />
        <button type="submit" disabled={isBusy}>
          {isBusy ? "Opening the Glass" : "Join the Circle"}
        </button>
      </div>
      <p className={`form-note ${formState}`} id="seer-circle-message" role={statusRole} aria-live="polite">
        <span>{statusLabel}</span>
        {message}
      </p>
    </form>
  );
}
