import type { Metadata } from "next";
import { JsonLd } from "../components/JsonLd";
import { GlassMenu } from "../components/GlassMenu";

export const metadata: Metadata = {
  title: "The Mortals",
  description:
    "Read the mortal archive of Gaze Glass: Patricia awakened by Wisdom, Marcella blessed by Justice, Malika blessed by Love, Takeshi blessed by Fortune, and the fantasy stories changed by divine witness.",
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
    "Takeshi blessed by Fortune",
    "Patricia awakened by Wisdom",
  ],
  openGraph: {
    title: "The Mortals | Gaze Glass",
    description:
      "Enter the mortal archive: Patricia, Marcella, Malika, Takeshi, divine blessings, and the consequence of being witnessed.",
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
      "Patricia, Marcella, Malika, and Takeshi enter the mortal archive through divine blessings from Wisdom, Justice, Love, and Fortune.",
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

const takeshiObservations = [
  {
    label: "Before the Blessing",
    title: "The Launch No One Saw",
    text: "Takeshi built Untold Journey alone for three years. On launch night, the game entered the world with no audience, no momentum, and no proof that anyone would ever find it.",
    image: "/mortals/takeshi/launch-eve.png",
    note: "Verdict Note: Unseen work can still be worthy of a world.",
  },
  {
    label: "The Sacred Appeal",
    title: "One Chance Asked of Fortune",
    text: "After three years of work and zero downloads, Takeshi returned to a prayer he thought childhood had outgrown. He did not ask to be famous. He asked for one chance.",
    image: "/mortals/takeshi/zero-downloads.png",
    note: "Verdict Note: Fortune does not replace labor. Sometimes it only opens the door labor earned.",
  },
  {
    label: "The Intervention",
    title: "Saroka Scatters a Little Luck",
    text: "High above him, the God of Fortune watched. Saroka, the scarlet fox, carried the smallest possible blessing into the city, and one tired streamer clicked one last game.",
    image: "/mortals/takeshi/saroka-luck.png",
    note: "Verdict Note: A miracle can arrive disguised as one person deciding not to log off.",
  },
  {
    label: "The Cascade",
    title: "The World Finds the Game",
    text: "The first player stayed. Then she told everyone. By morning, the quiet work that no algorithm had noticed became a shared world thousands of people wanted to enter.",
    image: "/mortals/takeshi/world-playing.png",
    note: "Verdict Note: Luck is not the reward. What a mortal does with luck becomes the record.",
  },
  {
    label: "After Fortune",
    title: "A Game Becomes a Door",
    text: "Takeshi used what Fortune gave him to build places where more people could play. The blessing did not end at success. It became access.",
    image: "/mortals/takeshi/game-cafe.png",
    note: "Verdict Note: Fortune becomes sacred when it is shared.",
  },
];

const mortalCases = [
  {
    id: "patricia-case",
    number: "Observation 001",
    name: "Patricia",
    title: "Awakened by Wisdom",
    force: "Wisdom",
    image: "/mortals/patricia/wisdom-appears.png",
    summary:
      "A former financier asks what life is for and sees the wall between self and world dissolve.",
    evidence: "Renunciation, awakening, the Judgment, Rashid Shah.",
    href: "/observations",
  },
  {
    id: "marcella-case",
    number: "Mortal Case 001",
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
    number: "Mortal Case 002",
    name: "Malika",
    title: "Blessed by Love",
    force: "Love",
    image: "/mortals/malika/portrait.png",
    summary:
      "A future cosmetologist asks for help after control is disguised as devotion.",
    evidence: "Forbidden beauty, self-return, a mirror remade as freedom.",
    href: "#malika-case",
  },
  {
    id: "takeshi-case",
    number: "Mortal Case 003",
    name: "Takeshi",
    title: "Blessed by Fortune",
    force: "Fortune",
    image: "/mortals/takeshi/portrait.png",
    summary:
      "A solo game developer asks for one chance after three years of unseen work.",
    evidence: "Zero downloads, one streamer, a world suddenly playing.",
    href: "#takeshi-case",
  },
];

const mortalsPageData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.gazeglass.com/the-mortals#webpage",
  url: "https://www.gazeglass.com/the-mortals",
  name: "The Mortals | Gaze Glass",
  description:
    "Observed mortal case files from Gaze Glass, including Patricia awakened by Wisdom, Marcella blessed by Justice, Malika blessed by Love, and Takeshi blessed by Fortune.",
  isPartOf: {
    "@id": "https://www.gazeglass.com/#website",
  },
  about: ["fantasy stories", "mortal blessings", "divine justice", "divine love", "divine fortune", "mythic fantasy"],
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "CreativeWork",
        position: 1,
        name: "Patricia, Awakened by Wisdom",
        genre: ["Fantasy", "Mythic Fantasy"],
        description:
          "A Gaze Glass Observation about Patricia, a former financier awakened by the God of Wisdom.",
        character: {
          "@type": "Person",
          name: "Patricia",
          description: "A mortal awakened by the God of Wisdom after giving away the life she built.",
        },
      },
      {
        "@type": "CreativeWork",
        position: 2,
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
        position: 3,
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
      {
        "@type": "CreativeWork",
        position: 4,
        name: "Takeshi, Blessed by Fortune",
        genre: ["Fantasy", "Mythic Fantasy"],
        description:
          "A mortal case file about Takeshi, a solo game developer whose unseen work is touched by the God of Fortune.",
        character: {
          "@type": "Person",
          name: "Takeshi",
          description: "A mortal blessed by the God of Fortune after his game launches unseen.",
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
          <p className="eyebrow">Mortal Case 001</p>
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
          <p className="eyebrow">Mortal Case 002</p>
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

      <section className="case-threshold fortune-case reveal" id="takeshi-case" aria-label="Takeshi case file">
        <figure className="case-portrait">
          <img src="/mortals/takeshi/portrait.png" alt="Takeshi reflected in a red triangular sacred glass" />
        </figure>
        <div>
          <p className="eyebrow">Mortal Case 003</p>
          <h2>Takeshi, Blessed by Fortune.</h2>
          <p>
            A solo game developer spent three years building a world almost no one
            saw. When the launch disappeared into silence, he begged the God of
            Fortune for one chance. Saroka carried the answer.
          </p>
          <dl>
            <dt>Patron</dt>
            <dd>The God of Fortune</dd>
            <dt>Spirit Witness</dt>
            <dd>Saroka, the scarlet fox</dd>
            <dt>Blessing</dt>
            <dd>One impossible path from obscurity to discovery.</dd>
            <dt>Trial</dt>
            <dd>To turn sudden luck into access for others.</dd>
          </dl>
        </div>
      </section>

      <section className="mortal-observations" aria-label="Takeshi observations">
        {takeshiObservations.map((item, index) => (
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
