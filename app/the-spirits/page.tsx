import type { Metadata } from "next";
import { FieldNote } from "../components/FieldNote";
import { GlassMenu } from "../components/GlassMenu";
import { JsonLd } from "../components/JsonLd";
import { getCasesBySpirit, getObservationHref, type SpiritId } from "../observations/data";

export const metadata: Metadata = {
  title: "The Spirits",
  description:
    "Meet the fox spirits of Gaze Glass: Kitsu, Marok, Jem, Sindren, and Saroka, divine assistants who carry truth, judgment, beauty, love, and fortune through a mythic fantasy world.",
  alternates: {
    canonical: "/the-spirits",
  },
  keywords: [
    "fantasy fox spirits",
    "spirit companions fantasy",
    "mythic fantasy spirits",
    "divine assistants fantasy",
    "Gaze Glass spirits",
    "fox spirits in fantasy stories",
  ],
  openGraph: {
    title: "The Spirits | Gaze Glass",
    description:
      "Meet the fox spirits who sit beside divine power in Gaze Glass: Kitsu, Marok, Jem, Sindren, and Saroka.",
    url: "/the-spirits",
    images: [
      {
        url: "/og/gaze-glass.png",
        width: 1672,
        height: 941,
        alt: "The sacred glass of Gaze Glass opening into a mythic fantasy world",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Spirits | Gaze Glass",
    description:
      "Meet Kitsu, Marok, Jem, Sindren, and Saroka, the fox spirits who serve beside the gods of Gaze Glass.",
    images: ["/og/gaze-glass.png"],
  },
};

type SpiritRecord = {
  name: string;
  spiritId?: SpiritId;
  role: string;
  image: string;
  text: string;
  note: string;
};

const spirits: SpiritRecord[] = [
  {
    name: "Kitsu",
    spiritId: "kitsu",
    role: "Assistant to the God of Justice",
    image: "/spirits/kitsu.webp",
    text: "The dutiful fox who sits beside the God of Justice at every divine briefing. Where others posture, Kitsu watches, and in the space between accusation and verdict, truth finds its way to the light.",
    note: "Field Note: The quietest witness is often the one the room should fear.",
  },
  {
    name: "Marok",
    spiritId: "marok" as SpiritId,
    role: "Assistant to the God of War",
    image: "/spirits/marok.webp",
    text: "A top graduate of the Academy of Fate and Destiny, Marok designs the trials that bring mortals to their knees while keeping a fox's unnerving joy at the edge of judgment.",
    note: "Field Note: He designs the trials that break mortals, and wags his tail doing it.",
  },
  {
    name: "Jem",
    role: "Assistant to the God of Beauty",
    image: "/spirits/jem.webp",
    text: "Jem moves through the divine courts wrapped in the warmth of a goddess who measures worth in ways mortals cannot yet see, offering counsel that stings and heals.",
    note: "Field Note: Beauty can destroy or create. Jem knows which one the moment requires.",
  },
  {
    name: "Sindren",
    role: "Assistant to the God of Love",
    image: "/spirits/sindren.webp",
    text: "Cobalt-furred and unshakably composed, Sindren has watched enough divine briefings to know when fear is theater and when it is prophecy.",
    note: "Field Note: The gentlest god keeps the sharpest company.",
  },
  {
    name: "Saroka",
    spiritId: "saroka" as SpiritId,
    role: "Assistant to the God of Fortune",
    image: "/spirits/saroka.png",
    text: "Scarlet-furred with a cream chest, white-tipped tail, gold-dipped paws, and ember eyes, Saroka serves Fortune with a calm smile and a devious little snicker whenever mortals confuse panic for prophecy.",
    note: "Field Note: Luck has teeth, gold paws, and impeccable timing.",
  },
];

const spiritsPageData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.gazeglass.com/the-spirits#webpage",
  url: "https://www.gazeglass.com/the-spirits",
  name: "The Spirits | Gaze Glass",
  description:
    "A fantasy character archive of the fox spirits in Gaze Glass: Kitsu, Marok, Jem, Sindren, and Saroka.",
  isPartOf: {
    "@id": "https://www.gazeglass.com/#website",
  },
  about: ["fantasy fox spirits", "mythic fantasy", "divine assistants", "fantasy characters"],
  mainEntity: {
    "@type": "ItemList",
    name: "Gaze Glass Fox Spirits",
    itemListElement: spirits.map((spirit, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: spirit.name,
        description: spirit.role,
        image: `https://www.gazeglass.com${spirit.image}`,
      },
    })),
  },
};

export default function TheSpirits() {
  return (
    <main>
      <JsonLd data={spiritsPageData} />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-spectrum-mark.svg" alt="" />
          <span className="brand-name">Gaze Glass</span>
        </a>
        <GlassMenu />
      </header>

      <section className="archive-hero">
        <div className="stars" aria-hidden="true" />
        <div className="archive-lens" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="archive-hero-copy reveal">
          <p className="eyebrow">The Spirit Archive</p>
          <h1>The Spirits</h1>
          <p>
            The gods may carry the pressure of creation, but the spirits carry the
            whisper: counsel, witness, mischief, and memory at the edge of power.
          </p>
        </div>
      </section>

      <section className="archive-threshold reveal" aria-label="Spirit viewing threshold">
        <p className="eyebrow">Sacred View</p>
        <h2>The Foxes Remember What Power Forgets.</h2>
        <p>
          Each assistant is more than a companion. They are witnesses close enough
          to hear what the gods do not say aloud.
        </p>
      </section>

      <section className="section spirits reveal" aria-label="Fox spirit records">
        <p className="eyebrow">The Court of Foxes</p>
        <h2>Five Spirits Beside the Divine.</h2>
        <div className="spirit-grid">
          {spirits.map((spirit) => (
            <article className="spirit-record" id={spirit.name.toLowerCase()} key={spirit.name}>
              <figure>
                <img src={spirit.image} alt={`${spirit.name}, ${spirit.role}`} />
              </figure>
              <div>
                <p>{spirit.role}</p>
                <h3>{spirit.name}</h3>
                <span>{spirit.text}</span>
                <FieldNote>{spirit.note}</FieldNote>
                {spirit.spiritId ? (
                  <div className="record-cases spirit-cases" aria-label={`Observations involving ${spirit.name}`}>
                    <span>Observed Cases</span>
                    {getCasesBySpirit(spirit.spiritId).map((observation) => (
                      <a href={getObservationHref(observation)} key={observation.slug}>
                        {observation.title}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="archive-threshold reveal" aria-label="Return from the spirit archive">
        <p className="eyebrow">The Glass Remembers</p>
        <h2>Where the Gods Rule, the Spirits Notice.</h2>
        <p>
          New assistants and observed behaviors will be added as the archive opens.
          Until then, return to the first glass or enter another lens.
        </p>
        <div className="seer-links">
          <a className="text-link return-link" href="/the-gods">
            Enter the divine archive
          </a>
          <a className="text-link return-link" href="/observations/patricia">
            Read the first Observation
          </a>
          <a className="text-link return-link" href="/#home">
            Return to the first glass
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
