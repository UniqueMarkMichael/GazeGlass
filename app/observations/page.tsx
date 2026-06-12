import type { Metadata } from "next";
import { GlassMenu } from "../components/GlassMenu";
import { JsonLd } from "../components/JsonLd";
import { SeerCircleForm } from "../components/SeerCircleForm";
import { ObservationsArchive } from "./ObservationsArchive";
import { featuredObservation, observations, regionMeta } from "./data";

export const metadata: Metadata = {
  title: "Observations",
  description:
    "Enter the Gaze Glass Observations archive, a mythic collection of short fantasy stories recorded through the Glass.",
  alternates: {
    canonical: "/observations",
  },
  openGraph: {
    title: "Observations | Gaze Glass",
    description:
      "Peer through the Glass and discover recorded fantasy stories of gods, spirits, and mortals.",
    url: "/observations",
    images: [
      {
        url: "/og/gaze-glass.png",
        width: 1672,
        height: 941,
        alt: "The Gaze Glass observatory opening into sacred stories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Observations | Gaze Glass",
    description:
      "A living archive of fantasy short stories witnessed through the sacred Glass.",
    images: ["/og/gaze-glass.png"],
  },
};

const observationsData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.gazeglass.com/observations/#webpage",
  url: "https://www.gazeglass.com/observations",
  name: "Observations",
  description:
    "A living archive of Gaze Glass fantasy short stories, flash fiction, and recorded fates.",
  isPartOf: {
    "@id": "https://www.gazeglass.com/#website",
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: observations.map((observation, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.gazeglass.com/observations/${observation.slug}`,
      name: observation.title,
    })),
  },
};

const regionCards = [
  {
    region: "gods" as const,
    href: "/observations/gods",
    instrument: "The Orb",
    label: "The Gods",
    symbol: "orb",
  },
  {
    region: "mortals" as const,
    href: "/observations/mortals",
    instrument: "The Mirror",
    label: "The Mortals",
    symbol: "mirror",
  },
  {
    region: "spirits" as const,
    href: "/observations/spirits",
    instrument: "The Stained Glass",
    label: "The Spirits",
    symbol: "glass",
  },
];

export default function ObservationsPage() {
  return (
    <main>
      <JsonLd data={observationsData} />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-mark-transparent.png" alt="" />
          Gaze Glass
        </a>
        <GlassMenu />
      </header>

      <section className="observations-hero" aria-label="Observations entry">
        <div className="stars" aria-hidden="true" />
        <div className="observatory-glass" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="observations-hero-copy reveal">
          <p className="eyebrow">The Observations Experience</p>
          <h1>Peer Through the Glass.</h1>
          <p>
            The Seer presents recorded fates: gods, spirits, mortals, and the
            moments the Glass refused to let vanish.
          </p>
          <a className="text-link" href="#newly-revealed">
            See what is newly revealed
          </a>
        </div>
        <aside className="sky-ledger" aria-label="Archive status">
          <span>Charted</span>
          <strong>3%</strong>
          <span>of the sky</span>
          <span>Observations recovered</span>
          <strong>{observations.length}</strong>
        </aside>
      </section>

      <section className="newly-revealed reveal" id="newly-revealed" aria-label="Newly revealed observation">
        <p className="eyebrow">Newly Revealed</p>
        <article>
          {featuredObservation.image ? (
            <img src={featuredObservation.image} alt={featuredObservation.imageAlt} />
          ) : null}
          <div>
            <span>{featuredObservation.number}</span>
            <h2>{featuredObservation.title}</h2>
            <p>{featuredObservation.description}</p>
            <p className="observation-meta-line">
              {featuredObservation.association} / {featuredObservation.readTime} / {featuredObservation.magnitudeLabel}
            </p>
            <a className="text-link" href={`/observations/${featuredObservation.slug}`}>
              Read the Observation
            </a>
          </div>
        </article>
      </section>

      <section className="instrument-grid reveal" aria-label="Explore the sky by instrument">
        <p className="eyebrow">Explore the Sky</p>
        <h2>Three lenses. Three realms.</h2>
        <div>
          {regionCards.map((card) => (
            <a className={`instrument-card instrument-${card.symbol}`} href={card.href} key={card.href}>
              <span aria-hidden="true" />
              <p>{card.instrument}</p>
              <h3>{card.label}</h3>
              <em>{regionMeta[card.region].subtitle}</em>
              <small>{regionMeta[card.region].description}</small>
            </a>
          ))}
        </div>
      </section>

      <ObservationsArchive />

      <section className="observations-circle reveal" aria-label="Receive future observations">
        <p className="eyebrow">The Circle Listens</p>
        <h2>Receive Future Observations.</h2>
        <p>
          Join the Seer's private circle for free. New records, blessings, and
          charted lights will arrive before the wider sky sees them.
        </p>
        <SeerCircleForm />
      </section>

      <footer className="site-footer" aria-label="Gaze Glass ritual line">
        <span>Gods Watch.</span>
        <span>Mortals Pray.</span>
        <span>Spirits Remember.</span>
      </footer>
    </main>
  );
}
