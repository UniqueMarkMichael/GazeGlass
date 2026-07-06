import type { Metadata } from "next";
import { GlassMenu } from "../components/GlassMenu";
import { JsonLd } from "../components/JsonLd";

const assetBase = "/big-scale-betrayal/assets";

export const metadata: Metadata = {
  title: "Big Scale Betrayal",
  description:
    "Enter Big Scale Betrayal, the Gaze Glass prequel to A Family of Mortals: Heba, Kemet, divine judgment, crocodile guardians, and a gift that can read any heart but one.",
  alternates: {
    canonical: "/big-scale-betrayal",
  },
  openGraph: {
    title: "Big Scale Betrayal | Gaze Glass",
    description:
      "The scale is set. Let the betrayal begin. Witness Heba's first recorded chapter in the mythic archive of Gaze Glass.",
    url: "/big-scale-betrayal",
    images: [
      {
        url: `${assetBase}/cover.png`,
        width: 1536,
        height: 1024,
        alt: "Heba holding the golden scales of judgment in Kemet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Big Scale Betrayal | Gaze Glass",
    description:
      "A Gaze Glass prequel about Heba, the God of Order, Kemet, and the burden of seeing too clearly.",
    images: [`${assetBase}/cover.png`],
  },
};

const synopsisBeats = [
  {
    title: "The Mortal",
    text: "Seventeen-year-old Heba wants only to lift her family out of debt.",
    vow: "The God of Order wants something else entirely.",
  },
  {
    title: "The Gift",
    text: "Chosen to carry the weight of divine judgment, she is given the power to read the truth of any heart placed before her.",
    vow: "Any heart but one.",
  },
  {
    title: "The Theft",
    text: "When a sacred scroll vanishes from the oldest pyramid in Kemet, the royal family sends Heba into the palace under the guise of the prince's scribe.",
    vow: "The palace has already begun to lie.",
  },
  {
    title: "The Betrayal",
    text: "In a palace full of beautiful liars, the most dangerous thing she possesses is not her gift.",
    vow: "It is how much she has already lost her heart.",
  },
];

const chapterParagraphs = [
  "Copper bells lulled the fourteen-foot-long armored crocodile perched atop polished limestone stairs leading up to the royal library of Kemet, a forty-foot-tall pyramid made of sandstone.",
  "Wisps of white sandalwood incense, offerings to the gods, wafted out from the granite entranceway, forming loose loops above the royal guard's leathery head as their yellow eyes assessed sweaty travelers from distant lands scuttling in from shadowy alleyways like mice.",
  "Heba, daughter of a vegetable merchant, lifted a rubbery cabbage from a barrel made of woven dried grass and nodded to her mother, Amunet, a plump woman with an even larger headdress fashioned from goose feathers. Unlike her mother, Heba did not obsess over her beauty. She was content with her beige gown, long black braids, and unpainted dark skin.",
  "\"Look! Do you see what Matu's daughter looks like?\" Amunet asked, raising her tattooed finger swiftly. Heba's head remained still, but her eyes shifted to the right of the wooden stall she clasped with a tight grip.",
  "\"Nanu does not crush gemstones every morning for customers. She applies a shimmer above her eyes to gain the favor of Mekhab. She hopes he will be her first kiss,\" Heba replied.",
  "\"The doctor's son?\" Amunet asked. \"He's educated and handsome. You should kiss him!\"",
  "\"My first kiss will come after we've paid our debts. And I have no desire to think otherwise until that day comes,\" Heba said sternly.",
  "\"What if royalty courted you?\"",
  "\"I would - I would refuse.\"",
  "Amunet turned away from her daughter, hugged herself, and kissed the air loudly.",
  "\"Oh! Son of my king! Please kiss me! But I'll never accept your wealth or a crown!\"",
  "Heba's face became as hot as the scarlet sun above. \"Love doesn't fix everything. Love is - a - burden,\" she added.",
  "Amunet winked. Heba pulled her shoulders away from her ears. Then she furrowed her brows. \"I have weighed my options.\"",
  "Just then, a woman with hair as fair as moonlight, barely taller than the wooden stand, approached the cabbage cart. The crone adjusted her teal dress and held her wrinkly hand toward Amunet and Heba. A slab of jagged amethyst sparkled lavender, lilac, and white as it sipped sunlight.",
  "\"The spirits say otherwise,\" the crone warned, with a mischievous smile.",
  "Heba's lips parted at the sight of her milky eyes.",
  "\"They used to be as green as emeralds before -\" she started to say.",
  "\"I didn't mean to stare!\" Heba interrupted. \"And... what spirits?\"",
  "\"Are you an oracle?\" Amunet asked, just as Heba reached for the amethyst.",
  "A heartbeat later, a child no older than eight ran through the market. He dashed between people, pickpocketing them as street performers created melodies with wooden flutes. Before Heba could touch the woman's stone, a monstrous roar grabbed her ears.",
  "The young thief squeezed between two women, then dove under the cabbage cart. He crawled quickly, using his elbows and forearms to propel himself forward.",
  "\"When will that boy learn?\" Amunet asked, groaning. She smiled at Heba before covering the cart with a burlap sheet. \"That boy is going to get himself killed.\"",
  "\"Have you seen a boy come through here?\" the enraged man asked.",
  "\"You'll have to be more specific,\" Heba replied, batting her long lashes.",
  "Blood rushed to the man's face. He yelled profanities before reaching for the burlap covering. When the oracle grabbed his wrist, Amunet narrowed her eyes and smiled.",
  "\"You come here when we are closed and reach for our crops?\" Heba growled.",
  "\"We should report you to the guards!\" Amunet cried.",
  "The man broke free from the crone's grip, grunted, and spat on the ground before marching toward a fruit stall down the road. Seconds later, Heba knelt and sighed.",
  "\"Why did you take his money?\" Heba demanded.",
  "\"He has too much of it!\" the boy answered.",
  "Heba chuckled and motioned for the thief to come out.",
  "\"You need to worry about the royal guard,\" Heba said with a smile. \"Those crocodiles will eat you for lunch if you continue stealing.\"",
  "Amunet plucked a goose feather from her headpiece and extended it toward the woman with the amethyst as Heba offered her hand to the boy.",
  "\"What is your name... oracle?\" Amunet asked.",
  "\"I am called Namoot... lady of the valley,\" the oracle replied.",
  "At her name, Heba shifted her gaze to the oracle and forgot her grip; the boy fell back onto the ground and groaned.",
  "\"Oh! Sorry, Fashad,\" Heba apologized. \"Come. Let's have some soup.\"",
  "Namoot took the feather and threw it above her head. A gust of hot wind lifted it. The feather circled the sun five times before gliding back to Amunet.",
  "\"Five!\" Namoot said.",
  "Heba swatted dirt and dust off the boy's face, dipped an orange rag into a small clay pot filled with cool water, and narrowed her eyes.",
  "\"Do you think I'm a bad person?\" Fashad asked.",
  "Heba faced the boy and stroked his cheek. \"I cannot judge you.\"",
  "\"Why?\" the boy asked, an eyebrow raised.",
  "\"I'm only a merchant's daughter,\" Heba admitted, smiling. \"Destined to sell cabbage.\"",
];

const chapterMedia = [
  {
    after: 2,
    type: "video",
    src: `${assetBase}/chapter1.mp4`,
    caption: "The armored guardian of the royal library of Kemet, bells at its throat, incense at its brow.",
  },
  {
    after: 3,
    type: "image",
    src: `${assetBase}/heba-intro.png`,
    alt: "Heba carrying cabbages down the temple steps of Kemet",
    caption: "Heba, daughter of a vegetable merchant, before the gods finished naming her fate.",
  },
  {
    after: 20,
    type: "image",
    src: `${assetBase}/market.png`,
    alt: "Heba and a young thief near a cabbage stall in the market of Kemet",
    caption: "The market of Kemet, the hour before the chase.",
  },
  {
    after: 33,
    type: "video",
    src: `${assetBase}/feather.mp4`,
    caption: "A feather for the oracle, a hand for the boy.",
  },
  {
    after: 44,
    type: "video",
    src: `${assetBase}/chapter1-end.mp4`,
    caption: "Destined to sell cabbage, or so she believed.",
  },
];

const bigScaleBetrayalData = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "@id": "https://www.gazeglass.com/big-scale-betrayal/#work",
  url: "https://www.gazeglass.com/big-scale-betrayal",
  name: "Big Scale Betrayal",
  isPartOf: {
    "@id": "https://www.gazeglass.com/#website",
  },
  genre: ["Fantasy", "Mythic Fantasy", "Romantasy"],
  description:
    "A Gaze Glass prequel to A Family of Mortals about Heba, the God of Order, palace corruption, and divine judgment in Kemet.",
  image: `https://www.gazeglass.com${assetBase}/cover.png`,
};

function ChapterMedia({ after }: { after: number }) {
  const item = chapterMedia.find((entry) => entry.after === after);

  if (!item) {
    return null;
  }

  return (
    <figure className="bsb-story-figure">
      <div className="bsb-media-frame">
        {item.type === "video" ? (
          <video src={item.src} autoPlay muted loop playsInline preload="metadata" />
        ) : (
          <img src={item.src} alt={item.alt ?? ""} />
        )}
        <span>Witnessed</span>
      </div>
      <figcaption>{item.caption}</figcaption>
    </figure>
  );
}

export default function BigScaleBetrayalPage() {
  return (
    <main className="bsb-page">
      <JsonLd data={bigScaleBetrayalData} />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-spectrum-mark.svg" alt="" />
          <span className="brand-name">Gaze Glass</span>
        </a>
        <GlassMenu />
      </header>

      <section className="bsb-hero" id="big-scale-betrayal">
        <img src={`${assetBase}/cover.png`} alt="" />
        <div className="bsb-hero-copy">
          <p className="eyebrow">Prequel Chronicle</p>
          <h1>Big Scale Betrayal</h1>
          <p>The scale is set. Let the betrayal begin.</p>
          <div className="bsb-hero-actions" aria-label="Big Scale Betrayal sections">
            <a href="#bsb-letter">Open the letter</a>
            <a href="#bsb-chapter">Begin Chapter One</a>
          </div>
        </div>
      </section>

      <section className="bsb-synopsis" aria-label="Big Scale Betrayal synopsis">
        <div className="bsb-synopsis-lens">
          <img src={`${assetBase}/synopsis-bg.png`} alt="" />
          <div>
            <p className="eyebrow">The Looking Glass</p>
            <h2>A story of power, sacrifice, and the burden of seeing too clearly.</h2>
          </div>
        </div>
        <div className="bsb-beat-grid">
          {synopsisBeats.map((beat) => (
            <article key={beat.title}>
              <span>{beat.title}</span>
              <p>{beat.text}</p>
              <strong>{beat.vow}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="bsb-letter" id="bsb-letter" aria-label="A letter from the God of Wisdom">
        <div className="bsb-section-kicker">
          <span />
          <p>A Letter from the God of Wisdom</p>
          <span />
        </div>
        <figure className="bsb-wisdom-art">
          <img
            src={`${assetBase}/god-of-wisdom.png`}
            alt="The God of Wisdom conjuring a letter in golden light across aged parchment"
          />
        </figure>
        <div className="bsb-audio-card">
          <div>
            <p>Hear it read aloud</p>
            <span>The words, for mortal ears</span>
          </div>
          <audio controls preload="metadata" src={`${assetBase}/letter-of-wisdom.mp3`} />
        </div>
        <div className="bsb-letter-text">
          <p>Dear Mortal,</p>
          <p>
            Long ago, when sorcerers scryed with serpents and priestesses mended wounds with words, a young inventor in the kingdom of Kemet was given a gift she did not ask for and asked to make a choice she could not take back, bending time around tragedy.
          </p>
          <p>
            Her name was Heba. She was the daughter of a vegetable merchant, and she would have been content to live and die at her mother's stall, but the gods would not allow her. Blessed by the God of Order, Heba was chosen to uphold cosmic law, destined to be loved by the most powerful family, and fated to be feared by all.
          </p>
          <p>
            Come away, mortal, to a world forgotten thousands of feet under the scorching sand, and discover why Heba was forced to take a stand.
          </p>
          <p>Sincerely,</p>
          <p>The God of Wisdom</p>
        </div>
      </section>

      <section className="bsb-chapter-hero" id="bsb-chapter">
        <img src={`${assetBase}/hero.png`} alt="" />
        <div>
          <p className="eyebrow">Chapter One</p>
          <h2>Copper Bells and Crocodiles</h2>
          <p>Look through the glass, mortal. The guardian is watching.</p>
        </div>
      </section>

      <section className="bsb-reading" aria-label="Chapter One reading">
        <div className="bsb-reading-head">
          <span>01</span>
          <h2>The Guardian on the Steps</h2>
        </div>
        <article className="bsb-prose">
          {chapterParagraphs.map((paragraph, index) => (
            <div key={`${index}-${paragraph.slice(0, 20)}`}>
              <p className={index === 0 ? "bsb-drop" : undefined}>{paragraph}</p>
              <ChapterMedia after={index + 1} />
              {index === 11 ? (
                <blockquote>"Your inability to weigh your options is what burdens you, child."</blockquote>
              ) : null}
            </div>
          ))}
        </article>
      </section>

      <section className="bsb-threshold" aria-label="End of chapter one">
        <p className="eyebrow">End of Chapter One</p>
        <h2>Chapter Two: The Library Remembers</h2>
        <p>There are many lives yet to witness. The next is being recorded.</p>
        <a href="#big-scale-betrayal">Return to the steps</a>
      </section>

      <footer className="site-footer" aria-label="Gaze Glass ritual line">
        <span>Gods Watch.</span>
        <span>Mortals Pray.</span>
        <span>Spirits Remember.</span>
      </footer>
    </main>
  );
}
