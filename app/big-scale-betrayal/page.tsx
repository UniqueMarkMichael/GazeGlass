import type { Metadata } from "next";
import { GlassMenu } from "../components/GlassMenu";
import { JsonLd } from "../components/JsonLd";
import { BigScaleBetrayalReader } from "./BigScaleBetrayalReader";

const assetBase = "/big-scale-betrayal/assets";

export const metadata: Metadata = {
  title: "Big Scale Betrayal",
  description:
    "Enter Big Scale Betrayal, the Gaze Glass prequel to A Family of Mortals: Heba, Kemet, divine judgment, crocodile guardians, and a gift that can read any heart but one.",
  alternates: {
    canonical: "/big-scale-betrayal",
  },
  openGraph: {
    title: "Big Scale Betrayal | Gaze Glass",
    description:
      "The scale is set. Let the betrayal begin. Witness Heba's first recorded chapter in the mythic archive of Gaze Glass.",
    url: "/big-scale-betrayal",
    images: [
      {
        url: `${assetBase}/cover.png`,
        width: 1536,
        height: 1024,
        alt: "Heba holding the golden scales of judgment in Kemet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Big Scale Betrayal | Gaze Glass",
    description:
      "A Gaze Glass prequel about Heba, the God of Order, Kemet, and the burden of seeing too clearly.",
    images: [`${assetBase}/cover.png`],
  },
};

const synopsisBeats = [
  {
    title: "The Mortal",
    text: "Seventeen-year-old Heba wants only to lift her family out of debt.",
    vow: "The God of Order wants something else entirely.",
  },
  {
    title: "The Gift",
    text: "Chosen to carry the weight of divine judgment, she is given the power to read the truth of any heart placed before her.",
    vow: "Any heart but one.",
  },
  {
    title: "The Theft",
    text: "When a sacred scroll vanishes from the oldest pyramid in Kemet, the royal family sends Heba into the palace under the guise of the prince's scribe.",
    vow: "The palace has already begun to lie.",
  },
  {
    title: "The Betrayal",
    text: "In a palace full of beautiful liars, the most dangerous thing she possesses is not her gift.",
    vow: "It is how much she has already lost her heart.",
  },
];

const bigScaleBetrayalData = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "@id": "https://www.gazeglass.com/big-scale-betrayal/#work",
  url: "https://www.gazeglass.com/big-scale-betrayal",
  name: "Big Scale Betrayal",
  isPartOf: {
    "@id": "https://www.gazeglass.com/#website",
  },
  genre: ["Fantasy", "Mythic Fantasy", "Romantasy"],
  description:
    "A Gaze Glass prequel to A Family of Mortals about Heba, the God of Order, palace corruption, and divine judgment in Kemet.",
  image: `https://www.gazeglass.com${assetBase}/cover.png`,
};

export default function BigScaleBetrayalPage() {
  return (
    <main className="bsb-page">
      <JsonLd data={bigScaleBetrayalData} />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-spectrum-mark.svg" alt="" />
          <span className="brand-name">Gaze Glass</span>
        </a>
        <GlassMenu />
      </header>

      <section className="bsb-hero" id="big-scale-betrayal">
        <img src={`${assetBase}/cover.png`} alt="" />
        <div className="bsb-hero-copy">
          <p className="eyebrow">Prequel Chronicle</p>
          <h1>Big Scale Betrayal</h1>
          <p>The scale is set. Let the betrayal begin.</p>
          <div className="bsb-hero-actions" aria-label="Big Scale Betrayal sections">
            <a href="#bsb-letter">Open the letter</a>
            <a href="#bsb-chapters">Begin Chapter One</a>
          </div>
        </div>
      </section>

      <section className="bsb-synopsis" aria-label="Big Scale Betrayal synopsis">
        <div className="bsb-synopsis-lens">
          <img src={`${assetBase}/synopsis-bg.png`} alt="" />
          <div>
            <p className="eyebrow">The Looking Glass</p>
            <h2>A story of power, sacrifice, and the burden of seeing too clearly.</h2>
          </div>
        </div>
        <div className="bsb-beat-grid">
          {synopsisBeats.map((beat) => (
            <article key={beat.title}>
              <span>{beat.title}</span>
              <p>{beat.text}</p>
              <strong>{beat.vow}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="bsb-letter" id="bsb-letter" aria-label="A letter from the God of Wisdom">
        <div className="bsb-section-kicker">
          <span />
          <p>A Letter from the God of Wisdom</p>
          <span />
        </div>
        <figure className="bsb-wisdom-art">
          <img
            src={`${assetBase}/god-of-wisdom.png`}
            alt="The God of Wisdom conjuring a letter in golden light across aged parchment"
          />
        </figure>
        <div className="bsb-audio-card">
          <div>
            <p>Hear it read aloud</p>
            <span>The words, for mortal ears</span>
          </div>
          <audio controls preload="metadata" src={`${assetBase}/letter-of-wisdom.mp3`} />
        </div>
        <div className="bsb-letter-text">
          <p>Dear Mortal,</p>
          <p>
            Long ago, when sorcerers scryed with serpents and priestesses mended wounds with words, a young inventor in the kingdom of Kemet was given a gift she did not ask for and asked to make a choice she could not take back, bending time around tragedy.
          </p>
          <p>
            Her name was Heba. She was the daughter of a vegetable merchant, and she would have been content to live and die at her mother's stall, but the gods would not allow her. Blessed by the God of Order, Heba was chosen to uphold cosmic law, destined to be loved by the most powerful family, and fated to be feared by all.
          </p>
          <p>
            Come away, mortal, to a world forgotten thousands of feet under the scorching sand, and discover why Heba was forced to take a stand.
          </p>
          <p>Sincerely,</p>
          <p>The God of Wisdom</p>
        </div>
      </section>

      <section className="bsb-chapter-hero" id="bsb-chapters">
        <img src={`${assetBase}/hero.png`} alt="" />
        <div>
          <p className="eyebrow">Reader Record</p>
          <h2>Chapters One Through Sixteen</h2>
          <p>Look through the glass, mortal. The guardian is watching.</p>
        </div>
      </section>

      <BigScaleBetrayalReader />

      <footer className="site-footer" aria-label="Gaze Glass ritual line">
        <span>Gods Watch.</span>
        <span>Mortals Pray.</span>
        <span>Spirits Remember.</span>
      </footer>
    </main>
  );
}
