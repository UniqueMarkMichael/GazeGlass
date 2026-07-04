import type { Metadata } from "next";
import { GlassMenu } from "../components/GlassMenu";
import { JsonLd } from "../components/JsonLd";
import { ObservationsArchive } from "./ObservationsArchive";
import { getObservationHref, observations, regionMeta, startHereObservation } from "./data";

export const metadata: Metadata = {
  title: "Observations",
  description:
    "Enter the Gaze Glass Observation archive: short fantasy stories of mortals, gods, spirits, blessings, and sacred consequences.",
  alternates: {
    canonical: "/observations",
  },
  openGraph: {
    title: "Observations | Gaze Glass",
    description:
      "Read the Gaze Glass archive of short fantasy Observations, where gods answer mortals and every blessing leaves consequence behind.",
    url: "/observations",
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
    title: "Observations | Gaze Glass",
    description:
      "Read short fantasy Observations from Gaze Glass: mortals, gods, spirits, blessings, and sacred consequences.",
    images: ["/og/gaze-glass.png"],
  },
};

const observationsData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.gazeglass.com/observations/#webpage",
  url: "https://www.gazeglass.com/observations",
  name: "Observations | Gaze Glass",
  description:
    "The Gaze Glass archive of short fantasy Observations, where gods, spirits, and mortals are witnessed through sacred story.",
  isPartOf: {
    "@id": "https://www.gazeglass.com/#website",
  },
  mainEntity: {
    "@type": "ItemList",
    name: "Gaze Glass Observations",
    itemListElement: observations.map((observation, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "ShortStory",
        name: observation.title,
        url: `https://www.gazeglass.com${getObservationHref(observation)}`,
        description: observation.seoDescription,
        image: observation.image ? `https://www.gazeglass.com${observation.image}` : undefined,
      },
    })),
  },
};

const regionCards = [
  {
    region: "gods" as const,
    href: "/observations/gods",
    instrument: "The Orb",
    label: "Gods",
    symbol: "orb",
  },
  {
    region: "mortals" as const,
    href: "/observations/mortals",
    instrument: "The Mirror",
    label: "Mortals",
    symbol: "mirror",
  },
  {
    region: "spirits" as const,
    href: "/observations/spirits",
    instrument: "The Stained Glass",
    label: "Spirits",
    symbol: "glass",
  },
];

const marcellaMirrorPanels = Array.from({ length: 9 }, (_value, index) => ({
  src: `/mortals/marcella/mirror-story/panel-${index + 1}.jpg`,
  alt: "",
}));

export default function ObservationsPage() {
  return (
    <main>
      <JsonLd data={observationsData} />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-spectrum-mark.svg" alt="" />
          <span className="brand-name">Gaze Glass</span>
        </a>
        <GlassMenu />
      </header>

      <section className="observations-hero" aria-label="Gaze Glass observations archive">
        <div className="stars" aria-hidden="true" />
        <div className="observations-hero-copy reveal">
          <p className="eyebrow">The Observation Archive</p>
          <h1>Every Witnessed Life Finds Its Record.</h1>
          <p>
            Observations are short fantasy stories from Gaze Glass: a mortal wound,
            a divine answer, and the consequence that follows once the glass has seen.
          </p>
          <a className="text-link" href={getObservationHref(startHereObservation)}>
            New here? Start with this Observation
          </a>
          <a
            className="observation-start-mirror"
            href={getObservationHref(startHereObservation)}
            aria-label="Begin with Marcella's mirrored observation"
          >
            <div className="marcella-mirror" role="img" aria-label="The Glass opens Marcella's mirrored record">
              <div className="marcella-mirror-images" aria-hidden="true">
                {marcellaMirrorPanels.map((panel, index) => (
                  <img
                    alt={panel.alt}
                    className={`marcella-mirror-panel panel-${index + 1}`}
                    key={panel.src}
                    loading={index === 0 ? "eager" : "lazy"}
                    src={panel.src}
                  />
                ))}
              </div>
            </div>
          </a>
        </div>
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

      <footer className="site-footer" aria-label="Gaze Glass ritual line">
        <span>Gods Watch.</span>
        <span>Mortals Pray.</span>
        <span>Spirits Remember.</span>
      </footer>
    </main>
  );
}
