import type { Metadata } from "next";
import Image from "next/image";
import { GlassMenu } from "../components/GlassMenu";
import { JsonLd } from "../components/JsonLd";
import { SeerCircleForm } from "../components/SeerCircleForm";

export const metadata: Metadata = {
  title: "Celestial Codex",
  description:
    "Enter the Celestial Codex and learn the laws behind mortal worlds: witness, consequence, surrender, pressure, memory, devotion, and return.",
  alternates: {
    canonical: "/celestial-codex",
  },
  openGraph: {
    title: "Celestial Codex | Gaze Glass",
    description:
      "A ceremonial reading experience from Gaze Glass, revealing the deeper order beneath gods, spirits, mortals, and observation.",
    url: "/celestial-codex",
    images: [
      {
        url: "/codex/sigil-law-witness.webp",
        width: 1672,
        height: 941,
        alt: "A golden sacred glass revealing the Law of Witness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Celestial Codex | Gaze Glass",
    description:
      "Learn the laws behind mortal worlds in the mythic archive of Gaze Glass.",
    images: ["/codex/sigil-law-witness.webp"],
  },
};

const codexLaws = [
  {
    id: "witness",
    roman: "I",
    phase: "Seen",
    title: "The Law of Witness",
    statement: "What is fully seen can no longer remain unchanged.",
    elaboration:
      "Witness is not attention. It is the holy pressure of being perceived without distortion. When a truth is seen completely, it cannot return to its hiding place unchanged.",
    fieldNote:
      "Marcella did not become free when Justice ruled in her favor. She became free in the hallway, when she asked to be seen.",
    image: "/codex/sigil-law-witness.webp",
    alt: "A gold-framed sacred glass revealing a lone figure beneath a radiant witnessing eye",
    linkHref: "/observations/marcella",
    linkLabel: "Seen in Marcella's observation",
  },
  {
    id: "consequence",
    roman: "II",
    phase: "Tested",
    title: "The Law of Consequence",
    statement: "Every gift carries the shape of what it will ask in return.",
    elaboration:
      "Nothing enters a life without rearranging the room around it. Blessing and burden are not opposites in the Glass; they are the two hands by which a mortal is moved toward meaning.",
    fieldNote:
      "Fortune's gifts arrive with Saroka's quiet snicker, not because fortune is unkind, but because the recipient rarely reads the fine print.",
    image: "/codex/sigil-law-consequence.webp",
    alt: "A celestial scale balancing a golden feather and a dark fruit beneath a radiant apple",
    linkHref: "/the-spirits#saroka",
    linkLabel: "Find Saroka among the spirits",
  },
  {
    id: "surrender",
    roman: "III",
    phase: "Released",
    title: "The Law of Surrender",
    statement: "The door that will not open by force opens when the soul stops striking it.",
    elaboration:
      "Surrender is not defeat. It is the moment the soul stops mistaking strain for devotion. Only then can the sealed threshold answer with something other than silence.",
    fieldNote:
      "Marok designs his trials not to destroy, but to locate the exact door the mortal cannot open by force alone.",
    image: "/codex/sigil-law-surrender.webp",
    alt: "A mortal before a luminous open doorway in a celestial city",
    linkHref: "/the-spirits",
    linkLabel: "Enter the spirits' archive",
  },
  {
    id: "pressure",
    roman: "IV",
    phase: "Clarified",
    title: "The Law of Pressure",
    statement: "Beauty is the pressure that makes the soul remember its original shape.",
    elaboration:
      "Beauty in the Codex is not softness. It is compression, refinement, and revelation. Under its force, what is false cracks; what is true becomes impossible to ignore.",
    fieldNote:
      "Jem knows which kind of beauty the moment requires before the mortal in question has finished asking.",
    image: "/codex/sigil-law-pressure.webp",
    alt: "A radiant crystal lotus suspended within celestial geometry",
    linkHref: "/the-spirits#jem",
    linkLabel: "Find Jem among the spirits",
  },
  {
    id: "memory",
    roman: "V",
    phase: "Preserved",
    title: "The Law of Memory",
    statement: "What survives a life is not what was performed, but what was most true.",
    elaboration:
      "Memory is the soul's refusal to be reduced to display. It keeps the unguarded moment, the private surrender, the thing a mortal did before anyone knew it mattered.",
    fieldNote:
      "The God of Story does not choose the grandest lives. The God of Story chooses the truest ones.",
    image: "/codex/sigil-law-memory.webp",
    alt: "Spiritlike figures carrying glowing memories toward a sacred archway",
    linkHref: "/the-gods#the-god-of-story",
    linkLabel: "Enter the God of Story's record",
  },
  {
    id: "devotion",
    roman: "VI",
    phase: "Held",
    title: "The Law of Devotion",
    statement: "What remains after reward disappears is the only devotion the gods can name.",
    elaboration:
      "Devotion is easiest to counterfeit when the altar answers quickly. The Codex names only what stays after proof, applause, and reward have withdrawn into the dark.",
    fieldNote:
      "There is a mortal who has prayed to Fortune for eleven years without answer. Fortune has never stopped watching. The waiting is the consecration.",
    image: "/codex/sigil-law-devotion.webp",
    alt: "A kneeling figure facing a glowing temple across a river of starlight",
    linkHref: "/observations/takeshi",
    linkLabel: "Witness Takeshi's case",
  },
  {
    id: "return",
    roman: "VII",
    phase: "Restored",
    title: "The Law of Return",
    statement: "Nothing surrendered into the Glass is lost; it returns transformed, wearing another face.",
    elaboration:
      "Return is rarely recognizable at first. The Glass gives nothing back unchanged, because what enters it has already become part of the larger story.",
    fieldNote:
      "Takeshi did not recognize what came back to him. That is the nature of Return. It does not announce itself. It simply appears, and something in the body knows before the mind does.",
    image: "/codex/sigil-law-return.webp",
    alt: "A golden river flowing from a glass sphere between sacred thresholds",
    linkHref: "/observations/takeshi",
    linkLabel: "Return to Takeshi's case",
  },
];

const codexPageData = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "@id": "https://www.gazeglass.com/celestial-codex#webpage",
  url: "https://www.gazeglass.com/celestial-codex",
  name: "Celestial Codex | Gaze Glass",
  description:
    "A ceremonial fantasy archive revealing the seven laws beneath the seen world of Gaze Glass.",
  isPartOf: {
    "@id": "https://www.gazeglass.com/#website",
  },
  genre: ["Fantasy", "Mythic Fiction", "Interactive Storytelling"],
  about: codexLaws.map((law) => ({
    "@type": "CreativeWork",
    name: law.title,
    description: law.statement,
  })),
};

export default function CelestialCodex() {
  return (
    <main className="codex-page">
      <JsonLd data={codexPageData} />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-spectrum-mark.svg" alt="" />
          <span className="brand-name">Gaze Glass</span>
        </a>
        <GlassMenu />
      </header>

      <section className="codex-hero" aria-labelledby="codex-title">
        <div className="stars" aria-hidden="true" />
        <div className="codex-hero-copy reveal">
          <p className="eyebrow">Celestial Codex</p>
          <h1 id="codex-title">Learn the laws behind mortal worlds.</h1>
          <div className="codex-invocation">
            <p>There are truths the Glass does not explain at first.</p>
            <p>It waits until the mortal has seen enough.</p>
            <p>
              Here, beyond gods, spirits, mortals, and observation, the deeper order begins
              to reveal itself.
            </p>
            <p>These are the laws the Seer has witnessed written into every life.</p>
          </div>
          <a className="text-link codex-begin" href="#witness">
            Begin the Codex
          </a>
        </div>

        <figure className="codex-hero-sigil reveal">
          <Image
            src="/codex/sigil-law-witness.webp"
            alt="A sacred glass revealing a figure beneath the Law of Witness"
            width={1672}
            height={941}
            priority
            sizes="(max-width: 820px) 92vw, 42vw"
          />
          <figcaption>Gods Watch. Mortals Pray. Spirits Remember. The Glass Reveals All.</figcaption>
        </figure>
      </section>

      <nav className="codex-progress reveal" aria-label="Seven laws of the Celestial Codex">
        {codexLaws.map((law) => (
          <a key={law.id} href={`#${law.id}`}>
            <span>{law.roman}</span>
            {law.title.replace("The Law of ", "")}
          </a>
        ))}
      </nav>

      <div className="codex-laws" aria-label="The seven celestial laws">
        {codexLaws.map((law, index) => (
          <section className="codex-law reveal" id={law.id} key={law.id} aria-labelledby={`${law.id}-title`}>
            <figure className="codex-law-sigil">
              <Image
                src={law.image}
                alt={law.alt}
                width={1672}
                height={941}
                sizes="(max-width: 900px) 92vw, 48vw"
              />
              <figcaption>{law.phase}</figcaption>
            </figure>

            <div className="codex-law-copy">
              <p className="codex-law-index">{String(index + 1).padStart(2, "0")} / {law.phase}</p>
              <p className="eyebrow">{law.roman} / {law.title}</p>
              <h2 id={`${law.id}-title`}>{law.statement}</h2>
              <p>{law.elaboration}</p>
              <blockquote>
                <span>Field Note</span>
                {law.fieldNote}
              </blockquote>
              <a className="text-link codex-related-link" href={law.linkHref}>
                {law.linkLabel}
              </a>
            </div>
          </section>
        ))}
      </div>

      <section className="codex-closing reveal" aria-label="The Codex continues">
        <p className="eyebrow">The Glass Remains Open</p>
        <h2>The Codex is not complete.</h2>
        <div>
          <p>No law is revealed before its hour.</p>
          <p>
            As new lives are witnessed, new truths will rise from the dark and take
            their place within the Glass.
          </p>
          <p>Return when the world has changed.</p>
          <p>Return when you have.</p>
        </div>
      </section>

      <section className="codex-circle signup reveal" id="codex-circle" aria-labelledby="codex-circle-title">
        <p className="eyebrow">Join the Circle</p>
        <h2 id="codex-circle-title">Join the Circle</h2>
        <p>
          Receive future laws, observations, and transmissions from the Glass. The Codex is
          still revealing itself.
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
