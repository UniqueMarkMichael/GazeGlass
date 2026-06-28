"use client";

import { useState } from "react";
import { playGlassSound } from "./glassSound";

type Vision = {
  title: string;
  realm: string;
  signal: string;
  href: string;
  description: string;
};

const visions: Vision[] = [
  {
    title: "Marcella, Blessed by Justice",
    realm: "Mortal Vision",
    signal: "Justice",
    href: "/observations/marcella",
    description:
      "A creative worker asks to be witnessed after her labor is stolen and renamed.",
  },
  {
    title: "Walter, Blessed by War",
    realm: "Mortal Vision",
    signal: "War",
    href: "/observations/walter",
    description:
      "An old soldier protects the home that held his life by receiving a strategy sharper than strength.",
  },
  {
    title: "The God of Love",
    realm: "Divine Vision",
    signal: "Love",
    href: "/the-gods#the-god-of-love",
    description:
      "A gentle divinity whose blessings turn longing, beauty, and self-recognition into consequence.",
  },
  {
    title: "Saroka, Spirit of Fortune",
    realm: "Spirit Vision",
    signal: "Fortune",
    href: "/the-spirits#saroka",
    description:
      "A scarlet spirit who sits beside Fortune and snickers when panic mistakes itself for prophecy.",
  },
  {
    title: "The Law of Witness",
    realm: "Codex Vision",
    signal: "Law I",
    href: "/celestial-codex#witness",
    description:
      "Learn why nothing truly changes until it is seen without distortion.",
  },
  {
    title: "The Law of Return",
    realm: "Codex Vision",
    signal: "Law VII",
    href: "/celestial-codex#return",
    description:
      "Follow the force that brings every blessing, vow, and consequence back into orbit.",
  },
];

export function ReceiveVision() {
  const [vision, setVision] = useState<Vision | null>(null);
  const [isChoosing, setIsChoosing] = useState(false);

  function chooseVision() {
    if (isChoosing) {
      return;
    }

    setIsChoosing(true);
    playGlassSound("select");

    window.setTimeout(() => {
      setVision((current) => {
        const availableVisions = current
          ? visions.filter((item) => item.title !== current.title)
          : visions;

        return availableVisions[Math.floor(Math.random() * availableVisions.length)];
      });
      playGlassSound("reveal");
      setIsChoosing(false);
    }, 420);
  }

  return (
    <section className="vision-oracle reveal" aria-labelledby="vision-oracle-title">
      <div className="vision-oracle-copy">
        <p className="eyebrow">After the first witness</p>
        <h2 id="vision-oracle-title">Another vision awaits.</h2>
        <p>
          Once you have entered through Marcella, return here when you want the
          archive to surprise you. One tap opens another mortal, god, spirit, or
          sacred law already waiting in the record.
        </p>
      </div>

      <div className="vision-oracle-ritual">
        <button
          className={`vision-eye-button${isChoosing ? " is-choosing" : ""}`}
          type="button"
          onClick={chooseVision}
          aria-busy={isChoosing}
          aria-label="Receive a vision from the Glass"
        >
          <span className="vision-eye-shape" aria-hidden="true">
            <span />
          </span>
          <span className="vision-eye-text">
            <span>Receive a Vision</span>
            <small>{vision ? "Ask again" : "Let the Glass choose"}</small>
          </span>
        </button>

        <div
          className={`vision-result${vision ? " is-revealed" : ""}`}
          aria-live="polite"
        >
          {vision ? (
            <>
              <span>
                {vision.realm} / {vision.signal}
              </span>
              <h3>The Glass has chosen.</h3>
              <p className="vision-result-title">{vision.title}</p>
              <p>{vision.description}</p>
              <a className="text-link" href={vision.href}>
                Enter this vision
              </a>
            </>
          ) : (
            <>
              <span>Awaiting the Glass</span>
              <h3>No vision has opened yet.</h3>
              <p>Touch the eye when you are ready for the archive to choose the next path.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
