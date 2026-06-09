"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "success" | "invalid" | "duplicate";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SeerCircleForm() {
  const [email, setEmail] = useState("");
  const [savedEmail, setSavedEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");

  function submit(event: FormEvent<HTMLFormElement>) {
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

    setSavedEmail(normalizedEmail);
    setEmail("");
    setFormState("success");
  }

  const message = {
    idle: "Letters from the Seer only. Leave the circle anytime. No spam crosses the glass.",
    success: "The Seer has your name. Watch for the first letter — Marok carries it.",
    invalid: "The glass could not read that. Check the address and look again.",
    duplicate: "You are already within the circle. The next observation is on its way.",
  }[formState];

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
          onChange={(event) => {
            setEmail(event.target.value);
            if (formState === "invalid") {
              setFormState("idle");
            }
          }}
        />
        <button type="submit">Join the Circle</button>
      </div>
      <p className={`form-note ${formState}`} id="seer-circle-message" role="status">
        {message}
      </p>
    </form>
  );
}
