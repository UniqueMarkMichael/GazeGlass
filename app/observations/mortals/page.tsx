import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { GlassMenu } from "../../components/GlassMenu";
import { JsonLd } from "../../components/JsonLd";
import {
  formatObservationReadTime,
  getObservationHref,
  getRegionObservations,
  regionMeta,
} from "../data";

export const metadata: Metadata = {
  title: "Mortal Observations",
  description:
    "Enter the Mirror and read Gaze Glass fantasy short stories about mortal prayers, divine blessings, choices, and lives changed by sacred attention.",
  alternates: {
    canonical: "/observations/mortals",
  },
  openGraph: {
    title: "Mortal Observations | Gaze Glass",
    description:
      "Read the mortal records of Gaze Glass: Patricia, Marcella, Malika, Takeshi, Walter, divine blessings, and the consequence of being witnessed.",
    url: "/observations/mortals",
    images: [
      {
        url: "/og/gaze-glass-mortals.png",
        width: 1774,
        height: 887,
        alt: "A mortal entering the sacred fantasy world of Gaze Glass",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortal Observations | Gaze Glass",
    description:
      "Patricia, Marcella, Malika, Takeshi, and Walter enter the archive through divine blessings from Wisdom, Justice, Love, Fortune, and War.",
    images: ["/og/gaze-glass-mortals.png"],
  },
};

const mortalRecords = getRegionObservations("mortals");

const mortalArchiveData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.gazeglass.com/observations/mortals/#webpage",
  url: "https://www.gazeglass.com/observations/mortals",
  name: "Mortal Observations | Gaze Glass",
  description:
    "Observed mortal case files from Gaze Glass, including prayers, blessings, divine witnesses, and the consequences that follow.",
  isPartOf: {
    "@id": "https://www.gazeglass.com/observations/#webpage",
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: mortalRecords.map((record, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "ShortStory",
        name: record.title,
        url: `https://www.gazeglass.com${getObservationHref(record)}`,
        description: record.seoDescription,
        image: record.image ? `https://www.gazeglass.com${record.image}` : undefined,
      },
    })),
  },
};

function getMortalName(title: string) {
  return title.split(",")[0] ?? title;
}

function getBlessingTitle(title: string) {
  return title.split(",").slice(1).join(",").trim() || title;
}

export default function MortalObservationsPage() {
  const meta = regionMeta.mortals;

  return (
    <main>
      <JsonLd data={mortalArchiveData} />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-spectrum-mark.svg" alt="" />
          <span className="brand-name">Gaze Glass</span>
        </a>
        <GlassMenu />
      </header>

      <section className="mortal-hero">
        <div className="stars" aria-hidden="true" />
        <div className="mortal-hero-copy reveal">
          <a className="back-link" href="/observations">
            Back to the Observation Archive
          </a>
          <p className="eyebrow">{meta.instrument}</p>
          <h1>Mortal Observations</h1>
          <p>
            These are not separate character profiles. They are witnessed incidents:
            ordinary mortals recorded at the moment a god answered, a spirit
            remembered, and a life changed shape.
          </p>
        </div>
        <div className="incident-index reveal" aria-label="Observed mortal incidents">
          {mortalRecords.map((record) => (
            <a className="incident-card" href={getObservationHref(record)} key={record.slug}>
              {record.image ? (
                <figure>
                  <img src={record.image} alt={record.imageAlt ?? record.title} />
                </figure>
              ) : null}
              <div>
                <span>Observation {record.number}</span>
                <p>{record.association}</p>
                <h2>
                  {getMortalName(record.title)}, <em>{getBlessingTitle(record.title)}</em>
                </h2>
                <small>{record.description}</small>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="archive-threshold mortal-threshold reveal" aria-label="How the Glass records mortals">
        <p className="eyebrow">How The Glass Records Mortals</p>
        <h2>The Viral Moment Is Only the Door.</h2>
        <p>
          TikTok may show the instant the blessing arrives. Here, the glass slows
          the moment down until wound, witness, choice, and consequence can be seen
          in the same reflection.
        </p>
        <p>
          Each mortal record is preserved as evidence: what happened before the
          prayer, what the god changed, and what the mortal chose after power
          entered the room.
        </p>
      </section>

      <section className="region-constellation reveal" aria-label="Mortal observation constellation">
        <div className="constellation-map" aria-hidden="true">
          {mortalRecords.map((record, index) => (
            <span className={`magnitude-${record.magnitude}`} key={record.slug} style={{ "--i": index } as CSSProperties} />
          ))}
        </div>
        <div>
          <p className="eyebrow">Witnessed in this region</p>
          <h2>{mortalRecords.length} lives witnessed.</h2>
          <p>{meta.subtitle} New mortal lives open here as they are witnessed.</p>
        </div>
      </section>

      <section className="region-records reveal" aria-label="Mortal observation records">
        {mortalRecords.map((record) => (
          <a className="region-record" href={getObservationHref(record)} key={record.slug}>
            <span className={`magnitude-mark magnitude-${record.magnitude}`} aria-hidden="true" />
            <span>{record.number}</span>
            <strong>{record.title}</strong>
            <em>{record.association}</em>
            <small>
              {formatObservationReadTime(record)} / {record.themeTags.slice(0, 2).join(" · ")}
            </small>
          </a>
        ))}
      </section>

      <section className="mortal-closing reveal">
        <p className="eyebrow">Not the Viral Version</p>
        <h2>The Consequence.</h2>
        <p>
          The archive preserves what the blessing changes: the wound, the witness,
          the choice after power, and the life a mortal claims once the gods have
          answered.
        </p>
        <a className="text-link return-link" href="/observations">
          Return to all Observations
        </a>
      </section>

      <footer className="site-footer" aria-label="Gaze Glass ritual line">
        <span>Gods Watch.</span>
        <span>Mortals Pray.</span>
        <span>Spirits Remember.</span>
      </footer>
    </main>
  );
}
