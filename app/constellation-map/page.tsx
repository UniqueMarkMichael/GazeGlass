import type { Metadata } from "next";
import { GlassMenu } from "../components/GlassMenu";
import { JsonLd } from "../components/JsonLd";
import { ConstellationMap } from "./ConstellationMap";

export const metadata: Metadata = {
  title: "Constellation Map",
  description:
    "Explore the living Gaze Glass constellation connecting gods, fox spirits, mortal Observations, sacred laws, and your personal Glass Naming result.",
  alternates: {
    canonical: "/constellation-map",
  },
  openGraph: {
    title: "Constellation Map | Gaze Glass",
    description:
      "A living map of the Gaze Glass story world: gods, spirits, Observations, laws, chronicles, and the path the Glass remembers.",
    url: "/constellation-map",
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
    title: "Constellation Map | Gaze Glass",
    description:
      "Follow the hidden lines between gods, spirits, Observations, laws, and your personal Glass Naming result.",
    images: ["/og/gaze-glass.png"],
  },
};

const constellationMapData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.gazeglass.com/constellation-map#webpage",
  url: "https://www.gazeglass.com/constellation-map",
  name: "Constellation Map",
  description:
    "An interactive map of the Gaze Glass story world connecting gods, fox spirits, mortal Observations, sacred laws, and the reader's remembered path.",
  isPartOf: {
    "@id": "https://www.gazeglass.com/#website",
  },
  about: ["Gaze Glass", "fantasy stories", "gods", "fox spirits", "mortal observations", "fantasy worldbuilding"],
};

export default function ConstellationMapPage() {
  return (
    <main className="constellation-page">
      <JsonLd data={constellationMapData} />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-spectrum-mark.svg" alt="" />
          <span className="brand-name">Gaze Glass</span>
        </a>
        <GlassMenu />
      </header>

      <section className="constellation-hero" aria-labelledby="constellation-title">
        <img className="constellation-hero-art" src="/brand/ritual-map-background.jpg" alt="" aria-hidden="true" />
        <div className="constellation-hero-copy reveal">
          <p className="eyebrow">The Constellation Map</p>
          <h1 id="constellation-title">See how the Glass connects every witnessed life.</h1>
          <p>
            Gods, fox spirits, mortal Observations, sacred laws, and the reader's own naming result gather into one
            living sky.
          </p>
        </div>
      </section>

      <ConstellationMap />

      <section className="constellation-coda reveal" aria-labelledby="constellation-coda-title">
        <div>
          <p className="eyebrow">Where the Map Leads</p>
          <h2 id="constellation-coda-title">Every line is a doorway.</h2>
        </div>
        <div className="constellation-coda-actions">
          <a className="text-link" href="/the-glass-names-you">
            Let the Glass name you
          </a>
          <a className="text-link" href="/observations/marcella">
            Begin with Marcella
          </a>
          <a className="text-link" href="/a-court-of-foxes">
            Enter A Court of Foxes
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
