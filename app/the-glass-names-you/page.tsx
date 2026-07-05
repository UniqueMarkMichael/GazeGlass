import type { Metadata } from "next";
import { GlassMenu } from "../components/GlassMenu";
import { JsonLd } from "../components/JsonLd";
import { GlassNamingQuiz } from "./GlassNamingQuiz";

export const metadata: Metadata = {
  title: "Glass Names You",
  description:
    "Take the Gaze Glass quiz and be matched with a deity, a fox spirit, and a story path through the archive.",
  alternates: {
    canonical: "/the-glass-names-you",
  },
  openGraph: {
    title: "Glass Names You | Gaze Glass",
    description:
      "Answer a short ritual quiz and discover which deity watches you, which fox spirit witnesses you, and where the Glass sends you next.",
    url: "/the-glass-names-you",
    images: [
      {
        url: "/og/gaze-glass.png",
        width: 1672,
        height: 941,
        alt: "A sacred mirror opening into the fantasy world of Gaze Glass",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glass Names You | Gaze Glass",
    description:
      "Let the Glass match you with a deity, a fox spirit, and your next Gaze Glass story path.",
    images: ["/og/gaze-glass.png"],
  },
};

const glassNamingData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.gazeglass.com/the-glass-names-you#webpage",
  url: "https://www.gazeglass.com/the-glass-names-you",
  name: "Glass Names You | Gaze Glass",
  description:
    "An interactive Gaze Glass quiz matching readers with a deity, a fox spirit, and a recommended story path.",
  isPartOf: {
    "@id": "https://www.gazeglass.com/#website",
  },
  about: ["fantasy quiz", "mythic fantasy gods", "fox spirits", "Gaze Glass"],
};

export default function GlassNamesYouPage() {
  return (
    <main>
      <JsonLd data={glassNamingData} />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-spectrum-mark.svg" alt="" />
          <span className="brand-name">Gaze Glass</span>
        </a>
        <GlassMenu />
      </header>

      <section className="naming-hero" aria-label="Glass naming ritual">
        <div className="stars" aria-hidden="true" />
        <div className="naming-hero-copy reveal">
          <p className="eyebrow">Personal Witness</p>
          <h1>Let the Glass Name Your Witness.</h1>
          <p>
            Answer seven questions. The Glass will match you with the deity shaping
            your pressure, the fox spirit who would notice what others miss, and the
            first path waiting in the archive.
          </p>
          <a className="text-link" href="#glass-naming-quiz">
            Begin the naming rite
          </a>
        </div>
        <figure className="naming-hero-art">
          <img src="/brand/sacred-mirror.webp" alt="A sacred golden mirror opening with celestial light" />
        </figure>
      </section>

      <GlassNamingQuiz />

      <section className="archive-threshold naming-afterword reveal" aria-label="After the Glass names you">
        <p className="eyebrow">The Record Remains</p>
        <h2>Every Match Opens a Door.</h2>
        <p>
          Your result is not a verdict. It is a lens: a way to enter the gods,
          the fox spirits, and the mortal lives already waiting to be witnessed.
        </p>
        <div className="seer-links">
          <a className="text-link return-link" href="/the-gods">
            Enter Gods
          </a>
          <a className="text-link return-link" href="/the-spirits">
            Enter Spirits
          </a>
          <a className="text-link return-link" href="/observations">
            Enter Observations
          </a>
        </div>
      </section>

      <footer className="site-footer" aria-label="Gaze Glass ritual line">
        <span>Gods Watch.</span>
        <span>Mortals Pray.</span>
        <span>Spirits Remember.</span>
      </footer>
    </main>
  );
}
