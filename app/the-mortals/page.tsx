import type { Metadata } from "next";
import { JsonLd } from "../components/JsonLd";
import { GlassMenu } from "../components/GlassMenu";

export const metadata: Metadata = {
  title: "The Mortals",
  description:
    "Read the mortal archive of Gaze Glass: Patricia awakened by Wisdom, Marcella blessed by Justice, Malika blessed by Love, Takeshi blessed by Fortune, Walter blessed by War, and the fantasy stories changed by divine witness.",
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
    "Walter blessed by War",
    "Patricia awakened by Wisdom",
  ],
  openGraph: {
    title: "The Mortals | Gaze Glass",
    description:
      "Enter the mortal archive: Patricia, Marcella, Malika, Takeshi, Walter, divine blessings, and the consequence of being witnessed.",
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
      "Patricia, Marcella, Malika, Takeshi, and Walter enter the mortal archive through divine blessings from Wisdom, Justice, Love, Fortune, and War.",
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

const walterObservations = [
  {
    label: "Before the Blessing",
    title: "The House That Held a Life",
    text: "For fifty years, Walter's house kept the measure of his children, his grief, and every ordinary morning that made a life sacred. Then a developer reduced it to a parcel number and taped a notice to the door.",
    image: "/mortals/walter/notice-to-vacate.png",
    note: "Verdict Note: A home is not empty because someone powerful calls it land.",
  },
  {
    label: "The Refusal",
    title: "One Old Man Against the Machine",
    text: "Walter refused to sell. Lawyers arrived with deadlines, signatures, and smiles sharp enough to cut through memory, but he would not trade the life in his walls for their polished version of progress.",
    image: "/mortals/walter/refused-to-sell.png",
    note: "Verdict Note: Refusal can be the first form of prayer.",
  },
  {
    label: "The Sacred Appeal",
    title: "Grant Me Glory",
    text: "Walter had not prayed since the war. That night, kneeling before medals he rarely touched, he asked the God of War for the only weapon he trusted: the strength to fight without becoming cruel.",
    image: "/mortals/walter/prayer-to-war.png",
    note: "Verdict Note: Glory is not always conquest. Sometimes it is endurance with a plan.",
  },
  {
    label: "The Divine Briefing",
    title: "Arm Him",
    text: "The God of War hated mortal weakness, until the mirror revealed a soldier still standing guard over the last thing he had sworn to protect. War did not pity Walter. War recognized him.",
    image: "/mortals/walter/arm-him.png",
    note: "Verdict Note: A god may answer when a mortal's wound resembles a battlefield.",
  },
  {
    label: "The Answer",
    title: "No Stronger. More Dangerous.",
    text: "War did not rebuild Walter's body. It entered the room as counsel, teeth, and fire, then placed the real weapon where Walter could reach it: his mind.",
    image: "/mortals/walter/war-blessing.png",
    note: "Verdict Note: The deadliest blessing can be clarity.",
  },
  {
    label: "The Blessing",
    title: "A Five-Star Mind",
    text: "Walter did not wake stronger. He woke strategic. Every threat became terrain, every document a map, every powerful man a piece that could be moved.",
    image: "/mortals/walter/five-star-general.png",
    note: "Verdict Note: War gave him no sword. War gave him command.",
  },
  {
    label: "The Strategy",
    title: "Every Empire Has a Weak Point",
    text: "Walter followed permits, ownership shells, public hearings, and money until the development stopped looking inevitable and started looking vulnerable.",
    image: "/mortals/walter/weak-point.png",
    note: "Verdict Note: The largest machines still depend on small cracks.",
  },
  {
    label: "The Army",
    title: "The Block Learns to Stand",
    text: "The developer believed Walter stood alone. Walter gave the neighborhood evidence, language, and a reason to gather. One old man became the place where courage organized itself.",
    image: "/mortals/walter/block-army.png",
    note: "Verdict Note: War multiplies when fear learns where to stand.",
  },
  {
    label: "The Witness",
    title: "You Cannot Bulldoze a Headline",
    text: "Walter called the press. Cameras arrived. The story that had been handled in rooms without witnesses became public, and the machine lost its most useful darkness.",
    image: "/mortals/walter/front-page.png",
    note: "Verdict Note: Strategy becomes power when the right eyes arrive.",
  },
  {
    label: "After War",
    title: "Checkmate",
    text: "The developer brought lawyers and money. Walter brought a plan three moves ahead. When the permit fell, the house remained, and the record named the victory correctly.",
    image: "/mortals/walter/checkmate.png",
    note: "Verdict Note: War is not the violence. War is the will to protect what must not be taken.",
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
    href: "/observations/patricia",
  },
  {
    id: "marcella-case",
    number: "Observation 002",
    name: "Marcella",
    title: "Blessed by Justice",
    force: "Justice",
    image: "/mortals/marcella/portrait.webp",
    summary:
      "A creative worker asks to be witnessed after her labor is stolen and renamed.",
    evidence: "Stolen credit, hidden labor, restored authorship.",
    href: "/observations/marcella",
  },
  {
    id: "malika-case",
    number: "Observation 003",
    name: "Malika",
    title: "Blessed by Love",
    force: "Love",
    image: "/mortals/malika/portrait.png",
    summary:
      "A future cosmetologist asks for help after control is disguised as devotion.",
    evidence: "Forbidden beauty, self-return, a mirror remade as freedom.",
    href: "/observations/malika",
  },
  {
    id: "takeshi-case",
    number: "Observation 004",
    name: "Takeshi",
    title: "Blessed by Fortune",
    force: "Fortune",
    image: "/mortals/takeshi/portrait.png",
    summary:
      "A solo game developer asks for one chance after three years of unseen work.",
    evidence: "Zero downloads, one streamer, a world suddenly playing.",
    href: "/observations/takeshi",
  },
  {
    id: "walter-case",
    number: "Observation 005",
    name: "Walter",
    title: "Blessed by War",
    force: "War",
    image: "/mortals/walter/portrait.png",
    summary:
      "An old soldier asks for glory when a developer tries to take the home that held his life.",
    evidence: "A notice to vacate, a neighborhood gathered, a permit defeated.",
    href: "/observations/walter",
  },
];

const mortalsPageData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.gazeglass.com/the-mortals#webpage",
  url: "https://www.gazeglass.com/the-mortals",
  name: "The Mortals | Gaze Glass",
  description:
    "Observed mortal case files from Gaze Glass, including Patricia awakened by Wisdom, Marcella blessed by Justice, Malika blessed by Love, Takeshi blessed by Fortune, and Walter blessed by War.",
  isPartOf: {
    "@id": "https://www.gazeglass.com/#website",
  },
  about: ["fantasy stories", "mortal blessings", "divine justice", "divine love", "divine fortune", "divine war", "mythic fantasy"],
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
      {
        "@type": "CreativeWork",
        position: 5,
        name: "Walter, Blessed by War",
        genre: ["Fantasy", "Mythic Fantasy"],
        description:
          "A mortal case file about Walter, an old soldier whose threatened home is answered by the God of War.",
        character: {
          "@type": "Person",
          name: "Walter",
          description: "A mortal blessed by the God of War when a developer tries to take his home.",
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
          <img className="brand-mark" src="/brand/gaze-glass-logo-color.png" alt="" />
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
          <p className="eyebrow">Observation 002</p>
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
          <p className="eyebrow">Observation 003</p>
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
          <p className="eyebrow">Observation 004</p>
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

      <section className="case-threshold war-case reveal" id="walter-case" aria-label="Walter case file">
        <figure className="case-portrait">
          <img src="/mortals/walter/portrait.png" alt="Walter reflected in a black and red sacred shield-glass" />
        </figure>
        <div>
          <p className="eyebrow">Observation 005</p>
          <h2>Walter, Blessed by War.</h2>
          <p>
            An old soldier was told the home that held his life had become
            someone else&apos;s opportunity. Walter did not pray for destruction.
            He asked for glory: the strategy to protect what the powerful had
            mistaken for something small.
          </p>
          <dl>
            <dt>Patron</dt>
            <dd>The God of War</dd>
            <dt>Spirit Witness</dt>
            <dd>Marok, architect of Judgments</dd>
            <dt>Blessing</dt>
            <dd>The mind of a five-star general.</dd>
            <dt>Trial</dt>
            <dd>To turn rage into strategy and defense into community.</dd>
          </dl>
        </div>
      </section>

      <section className="mortal-observations poster-observations" aria-label="Walter observations">
        {walterObservations.map((item, index) => (
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
