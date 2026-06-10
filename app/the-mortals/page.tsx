import type { Metadata } from "next";
import { JsonLd } from "../components/JsonLd";
import { GlassMenu } from "../components/GlassMenu";

export const metadata: Metadata = {
  title: "The Mortals",
  description:
    "Read the mortal case files of Gaze Glass: Marcella blessed by Justice, Malika blessed by Love, and the fantasy stories changed by divine witness.",
  alternates: {
    canonical: "/the-mortals",
  },
  keywords: [
    "fantasy mortal stories",
    "divine blessing fantasy",
    "fantasy short stories",
    "TikTok fantasy story",
    "Gaze Glass mortals",
    "Marcella blessed by Justice",
    "Malika blessed by Love",
  ],
  openGraph: {
    title: "The Mortals | Gaze Glass",
    description:
      "Enter the mortal archive: fantasy case files of Marcella, Malika, divine blessings, and the consequence of being witnessed.",
    url: "/the-mortals",
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
    title: "The Mortals | Gaze Glass",
    description:
      "Marcella and Malika enter the mortal archive through divine blessings from Justice and Love.",
    images: ["/og/gaze-glass-mortals.png"],
  },
};

const marcellaObservations = [
  {
    label: "Before the Blessing",
    title: "The Labor No One Saw",
    text: "Marcella kept the work moving. She helped the room, softened the panic, and carried ideas across the finish line while others learned to expect her generosity.",
    image: "/mortals/marcella/stolen-credit.webp",
    note: "Verdict Note: Unseen labor is still evidence.",
  },
  {
    label: "The Sacred Appeal",
    title: "A Prayer Beneath Fluorescent Light",
    text: "When her work was taken and renamed, Marcella did not ask for spectacle. She asked to be witnessed. That was enough for Justice to enter the record.",
    image: "/mortals/marcella/justice-prayer.webp",
    note: "Verdict Note: A quiet appeal can still move the court of gods.",
  },
  {
    label: "After the Verdict",
    title: "Credit Returned, Power Shared",
    text: "The blessing did not make Marcella smaller or crueler. It restored the truth, then revealed the kind of leader she had already been becoming.",
    image: "/mortals/marcella/promotion.webp",
    note: "Verdict Note: Justice did not make her louder. It made her impossible to misfile.",
  },
];

const malikaObservations = [
  {
    label: "Before the Blessing",
    title: "The Beauty She Was Forbidden",
    text: "Malika wanted to become a cosmetologist, but Ricardo treated her dream like evidence against her. He mistook control for love, and called her obedience peace.",
    image: "/mortals/malika/ricardo-control.png",
    note: "Verdict Note: Love that requires erasure is not love.",
  },
  {
    label: "The Sacred Appeal",
    title: "A Prayer She Thought She Had Outgrown",
    text: "Malika stopped praying at twelve. But when every ordinary door closed, she returned to the God of Love with one request: help her become herself again.",
    image: "/mortals/malika/prayer.png",
    note: "Verdict Note: A prayer can begin where a person finally refuses to disappear.",
  },
  {
    label: "The Blessing",
    title: "The Vial of Unapologetic Love",
    text: "The God of Love placed a single vial in Malika's hands. Whoever saw her next would love her without apology, but the first gaze the blessing changed was her own.",
    image: "/mortals/malika/blessing.png",
    note: "Verdict Note: The blessing did not make her desirable. It made her undeniable.",
  },
  {
    label: "After the Mirror",
    title: "Love Starts in the Mirror",
    text: "Malika left with one suitcase and one lipstick. The dream Ricardo threw away became the academy where she now teaches others to recognize themselves.",
    image: "/mortals/malika/academy.png",
    note: "Verdict Note: Freedom is not the end of love. It is the condition that makes love true.",
  },
];

const mortalCases = [
  {
    id: "marcella-case",
    number: "Observation 001",
    name: "Marcella",
    title: "Blessed by Justice",
    force: "Justice",
    image: "/mortals/marcella/portrait.webp",
    summary:
      "A creative worker asks to be witnessed after her labor is stolen and renamed.",
    evidence: "Stolen credit, hidden labor, restored authorship.",
    href: "#marcella-case",
  },
  {
    id: "malika-case",
    number: "Observation 002",
    name: "Malika",
    title: "Blessed by Love",
    force: "Love",
    image: "/mortals/malika/portrait.png",
    summary:
      "A future cosmetologist asks for help after control is disguised as devotion.",
    evidence: "Forbidden beauty, self-return, a mirror remade as freedom.",
    href: "#malika-case",
  },
];

const mortalsPageData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.gazeglass.com/the-mortals#webpage",
  url: "https://www.gazeglass.com/the-mortals",
  name: "The Mortals | Gaze Glass",
  description:
    "Observed mortal case files from Gaze Glass, including Marcella blessed by Justice and Malika blessed by Love.",
  isPartOf: {
    "@id": "https://www.gazeglass.com/#website",
  },
  about: ["fantasy stories", "mortal blessings", "divine justice", "divine love", "mythic fantasy"],
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "CreativeWork",
        position: 1,
        name: "Marcella, Blessed by Justice",
        genre: ["Fantasy", "Mythic Fantasy"],
        description:
          "A mortal case file about Marcella, a creative worker whose stolen labor is witnessed by the God of Justice.",
        character: {
          "@type": "Person",
          name: "Marcella",
          description: "A mortal blessed by the God of Justice after her work is stolen.",
        },
      },
      {
        "@type": "CreativeWork",
        position: 2,
        name: "Malika, Blessed by Love",
        genre: ["Fantasy", "Mythic Fantasy"],
        description:
          "A mortal case file about Malika, a future cosmetologist whose prayer to the God of Love returns her to herself.",
        character: {
          "@type": "Person",
          name: "Malika",
          description: "A mortal blessed by the God of Love after control nearly erases her dream.",
        },
      },
    ],
  },
};

export default function TheMortals() {
  return (
    <main>
      <JsonLd data={mortalsPageData} />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-mark-transparent.png" alt="" />
          Gaze Glass
        </a>
        <GlassMenu />
      </header>

      <section className="mortal-hero">
        <div className="stars" aria-hidden="true" />
        <div className="mortal-hero-copy reveal">
          <p className="eyebrow">The Mortal Archive</p>
          <h1>Divine Incidents, Human Lives.</h1>
          <p>
            These are not character profiles. They are witnessed incidents:
            ordinary mortals recorded at the moment a god answered, a spirit
            remembered, and a life changed shape.
          </p>
        </div>
        <div className="incident-index reveal" aria-label="Observed mortal incidents">
          {mortalCases.map((mortalCase) => (
            <a className="incident-card" href={mortalCase.href} key={mortalCase.id}>
              <figure>
                <img src={mortalCase.image} alt={`${mortalCase.name}, ${mortalCase.title}`} />
              </figure>
              <div>
                <span>{mortalCase.number}</span>
                <p>{mortalCase.force}</p>
                <h2>
                  {mortalCase.name}, <em>{mortalCase.title}</em>
                </h2>
                <small>{mortalCase.summary}</small>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="archive-threshold mortal-threshold reveal" aria-label="Mortal viewing threshold">
        <p className="eyebrow">How The Glass Records Mortals</p>
        <h2>The Viral Moment Is Only the Door.</h2>
        <p>
          TikTok may show the instant the blessing arrives. Here, the glass slows
          the moment down until wound, witness, choice, and consequence can be seen
          in the same reflection.
        </p>
        <p>
          Each incident is preserved as evidence: what happened before the prayer,
          what the god changed, and what the mortal chose after power entered the room.
        </p>
      </section>

      <section className="mortal-dossier reveal" id="marcella-case" aria-label="Marcella dossier">
        <div>
          <p className="eyebrow">Observation 001</p>
          <h2>Marcella, Blessed by Justice.</h2>
        </div>
        <dl>
          <dt>Incident</dt>
          <dd>The Case of Stolen Credit</dd>
          <dt>Patron</dt>
          <dd>The God of Justice</dd>
          <dt>Blessing</dt>
          <dd>The truth becomes impossible to misattribute.</dd>
          <dt>Trial</dt>
          <dd>To receive recognition without becoming the kind of power that wounded her.</dd>
        </dl>
      </section>

      <section className="mortal-observations" aria-label="Marcella observations">
        {marcellaObservations.map((item, index) => (
          <article className="mortal-observation reveal" key={item.title}>
            <figure>
              <img src={item.image} alt={`${item.title} artwork`} />
            </figure>
            <div>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p className="eyebrow">{item.label}</p>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <small>{item.note}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="case-threshold reveal" id="malika-case" aria-label="Malika case file">
        <figure className="case-portrait">
          <img src="/mortals/malika/portrait.png" alt="Malika reflected in a blue sacred mirror" />
        </figure>
        <div>
          <p className="eyebrow">Observation 002</p>
          <h2>Malika, Blessed by Love.</h2>
          <p>
            A future cosmetologist nearly surrendered her own reflection to a man
            who called possession love. The God of Love answered with a blessing
            that did not deliver Malika to another person. It returned her to herself.
          </p>
          <dl>
            <dt>Patron</dt>
            <dd>The God of Love</dd>
            <dt>Blessing</dt>
            <dd>Whoever sees her next loves her unapologetically.</dd>
            <dt>Trial</dt>
            <dd>To choose self-love before accepting anyone else&apos;s devotion.</dd>
          </dl>
        </div>
      </section>

      <section className="mortal-observations" aria-label="Malika observations">
        {malikaObservations.map((item, index) => (
          <article className="mortal-observation reveal" key={item.title}>
            <figure>
              <img src={item.image} alt={`${item.title} artwork`} />
            </figure>
            <div>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p className="eyebrow">{item.label}</p>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <small>{item.note}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="mortal-closing reveal">
        <p className="eyebrow">How The Glass Records Mortals</p>
        <h2>Not the Viral Version. The Consequence.</h2>
        <p>
          TikTok may show the moment the blessing arrives. The archive preserves
          what the blessing changes: the wound, the witness, the choice after power,
          and the life a mortal claims once the gods have answered.
        </p>
        <a className="text-link return-link" href="/#home">
          Return to the first glass
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
