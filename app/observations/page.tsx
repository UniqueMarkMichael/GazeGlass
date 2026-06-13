import type { Metadata } from "next";
import { GlassMenu } from "../components/GlassMenu";
import { JsonLd } from "../components/JsonLd";
import { SeerCircleForm } from "../components/SeerCircleForm";
import { ObservationsArchive } from "./ObservationsArchive";
import { featuredObservation, regionMeta } from "./data";

export const metadata: Metadata = {
  title: "Patricia, Awakened by Wisdom",
  description:
    "Read Patricia, Awakened by Wisdom, the first Gaze Glass Observation about a former financier, the God of Wisdom, enlightenment, and the coming Judgment.",
  alternates: {
    canonical: "/observations",
  },
  openGraph: {
    title: "Patricia, Awakened by Wisdom | Gaze Glass",
    description:
      "The first Gaze Glass Observation: a mortal encounter with the God of Wisdom and the wall between self and world dissolving.",
    url: "/observations",
    type: "article",
    images: [
      {
        url: "/mortals/patricia/wisdom-appears.png",
        width: 1024,
        height: 1536,
        alt: "Patricia seated on a city street as the God of Wisdom appears in celestial light",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patricia, Awakened by Wisdom | Gaze Glass",
    description:
      "Read the first Gaze Glass Observation, where Patricia is awakened by the God of Wisdom.",
    images: ["/mortals/patricia/wisdom-appears.png"],
  },
};

const observationsData = {
  "@context": "https://schema.org",
  "@type": "ShortStory",
  "@id": "https://www.gazeglass.com/observations/#story",
  url: "https://www.gazeglass.com/observations",
  name: featuredObservation.title,
  headline: featuredObservation.title,
  description: featuredObservation.seoDescription,
  genre: ["Fantasy", "Mythic Fantasy", "Short Story"],
  datePublished: featuredObservation.dateObserved,
  author: {
    "@type": "Organization",
    name: "Gaze Glass",
  },
  isPartOf: {
    "@type": "CreativeWorkSeries",
    name: "Gaze Glass Observations",
    url: "https://www.gazeglass.com/observations",
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
  const firstStoryPart = featuredObservation.story.slice(0, 6);
  const secondStoryPart = featuredObservation.story.slice(6, 12);
  const thirdStoryPart = featuredObservation.story.slice(12, 18);
  const finalStoryPart = featuredObservation.story.slice(18);

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

      <article className="patricia-observation" aria-label="Patricia, Awakened by Wisdom">
      <section className="patricia-hero" aria-label="Observation 001 entry">
        <div className="stars" aria-hidden="true" />
        <figure className="patricia-hero-art reveal">
          <img src="/mortals/patricia/wisdom-appears.png" alt={featuredObservation.imageAlt} />
        </figure>
        <div className="patricia-hero-copy reveal">
          <p className="eyebrow">Gaze Glass / Observation {featuredObservation.number}</p>
          <h1>{featuredObservation.title}.</h1>
          <p>{featuredObservation.excerpt}</p>
          <div className="story-actions" aria-label="Observation details">
            <span>{featuredObservation.association}</span>
            <span>{featuredObservation.readTime}</span>
            <span>{featuredObservation.regionLabel}</span>
          </div>
          <a className="text-link" href="#patricia-reading">
            Begin the Observation
          </a>
        </div>
      </section>

      <section className="patricia-reader" id="patricia-reading" aria-label="Read Patricia, Awakened by Wisdom">
        <aside className="patricia-ledger reveal" aria-label="Observation metadata">
          <span className="magnitude-mark magnitude-story" aria-hidden="true" />
          <dl>
            <dt>Archive</dt>
            <dd>The Mortal Archive</dd>
            <dt>Patron</dt>
            <dd>The God of Wisdom</dd>
            <dt>Blessing</dt>
            <dd>The false wall between self and world dissolves.</dd>
            <dt>Trial</dt>
            <dd>To carry universal oneness back into mortal action without abandoning the world.</dd>
          </dl>
        </aside>

        <div className="patricia-story-column">
          <header className="observation-story-header reveal">
            <p className="eyebrow">Before the Observation</p>
            <h2>The Seer Records What the Glass Reveals.</h2>
            <p>{featuredObservation.description}</p>
          </header>

          <div className="story-body patricia-story-body">
            {firstStoryPart.map((paragraph, index) => (
              <p className="reveal" key={`patricia-a-${index}`}>{paragraph}</p>
            ))}
          </div>

          <figure className="story-break-figure reveal">
            <img src="/mortals/patricia/office-crystal.png" alt="Patricia in her former office holding a crystal above a city of lit towers" />
            <figcaption>The life she built before the question opened.</figcaption>
          </figure>

          <div className="story-body patricia-story-body">
            {secondStoryPart.map((paragraph, index) => (
              <p className="reveal" key={`patricia-b-${index}`}>{paragraph}</p>
            ))}
          </div>

          <figure className="story-break-figure story-break-figure-wide reveal">
            <img src="/mortals/patricia/judgment-vision.png" alt="Patricia before the God of Wisdom as celestial scales weigh humanity" />
            <figcaption>The wall dissolves. The Judgment gathers.</figcaption>
          </figure>

          <div className="story-body patricia-story-body">
            {thirdStoryPart.map((paragraph, index) => (
              <p className="reveal" key={`patricia-c-${index}`}>{paragraph}</p>
            ))}
          </div>

          <figure className="story-break-figure reveal">
            <img src="/mortals/patricia/patricia-walking.png" alt="Patricia walking barefoot through a sunlit city after her encounter with Wisdom" />
            <figcaption>Meaning was not beyond the world. It was inside the whole.</figcaption>
          </figure>

          <div className="story-body patricia-story-body">
            {finalStoryPart.map((paragraph, index) => (
              <p className="reveal" key={`patricia-d-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="patricia-afterword reveal" aria-label="Continue after Patricia">
        <p className="eyebrow">The Glass Remains Open</p>
        <h2>Patricia is the first recorded mortal incident.</h2>
        <p>
          The archive will continue to gather the lives touched by gods, spirits,
          and consequences too large for ordinary sight.
        </p>
        <div>
          <a className="text-link" href="/#the-seer-circle">
            Join the Circle
          </a>
          <a className="text-link" href="/the-mortals">
            Enter the Mortal Archive
          </a>
        </div>
        <SeerCircleForm />
      </section>
      </article>

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
