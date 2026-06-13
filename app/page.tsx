import type { Metadata } from "next";
import { JsonLd } from "./components/JsonLd";
import { GlassMenu } from "./components/GlassMenu";
import { SeerCircleForm } from "./components/SeerCircleForm";

export const metadata: Metadata = {
  title: "Gaze Glass | Fantasy Stories of Gods, Spirits, and Mortals",
  description:
    "Enter Gaze Glass, a mythic fantasy story world for readers who love gods, fox spirits, mortal blessings, sacred trials, and cinematic fantasy lore.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Gaze Glass | Fantasy Stories of Gods, Spirits, and Mortals",
    description:
      "A cinematic fantasy observatory where readers witness gods, fox spirits, mortal blessings, and sacred consequences.",
    url: "/",
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
    title: "Gaze Glass | Fantasy Stories of Gods, Spirits, and Mortals",
    description:
      "A mythic fantasy story world for readers who love gods, spirits, mortal blessings, and sacred trials.",
    images: ["/og/gaze-glass.png"],
  },
};

const homePageData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.gazeglass.com/#webpage",
  url: "https://www.gazeglass.com",
  name: "Gaze Glass",
  description:
    "A cinematic fantasy story world where readers witness gods, fox spirits, mortals, blessings, and sacred consequences.",
  isPartOf: {
    "@id": "https://www.gazeglass.com/#website",
  },
  about: [
    "fantasy stories",
    "mythic fantasy",
    "fantasy novels",
    "gods and mortals",
    "divine blessings",
    "fox spirits",
  ],
  mainEntity: {
    "@type": "CreativeWorkSeries",
    name: "Gaze Glass",
    genre: ["Fantasy", "Mythic Fantasy", "Speculative Fiction"],
    description:
      "A fantasy universe told through divine archives, mortal case files, spirits, and sacred observations.",
  },
};

const gods = [
  {
    name: "The God of Beauty",
    epithet: "Beauty as Divine Pressure",
    text: "Ten arms, midnight indigo skin, sun-gold hair, and a belief that beauty is not decoration but survival.",
    image: "/gods/beauty.webp",
  },
  {
    name: "The God of Story",
    epithet: "Memory Given Shape",
    text: "Keeper of every civilization's record, deciding which stories are worth telling and which worlds deserve memory.",
    image: "/gods/story.webp",
  },
];

const spirits = [
  {
    name: "Kitsu",
    role: "Assistant to the God of Justice",
    image: "/spirits/kitsu.webp",
    text: "The dutiful fox sits beside the God of Justice at every divine briefing. Kitsu does not posture. Kitsu watches, and in the space between accusation and verdict, truth finds its way to the light.",
    note: "Field Note: The quietest witness is often the one the room should fear.",
  },
  {
    name: "Marok",
    role: "Assistant to the God of War",
    image: "/spirits/marok.webp",
    text: "A top graduate of the Academy of Fate and Destiny, Marok designs the trials that bring mortals to their knees while sneezing green fire and spinning in concentric circles.",
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
    role: "Assistant to the God of Fortune",
    image: "/spirits/saroka.png",
    text: "Scarlet-furred with a cream chest, white-tipped tail, gold-dipped paws, and ember eyes, Saroka serves Fortune with a calm smile and a devious little snicker whenever mortals confuse panic for prophecy.",
    note: "Field Note: Luck has teeth, gold paws, and impeccable timing.",
  },
];

const sacredViews = [
  {
    name: "Epic View",
    vow: "Gods Watch.",
    symbol: "orb",
    text: "The celestial sphere reveals forces too large to call characters: law, hunger, mercy, beauty, and war moving at divine scale.",
  },
  {
    name: "Human View",
    vow: "Mortals Pray.",
    symbol: "mirror",
    text: "The mirror narrows the cosmos to one life at a time, where a blessing becomes consequence instead of spectacle.",
  },
  {
    name: "Sacred View",
    vow: "Spirits Remember.",
    symbol: "glass",
    text: "The stained glass catches what survives between worlds: vows, griefs, omens, and the presences that keep memory awake.",
  },
];

const chapters = [
  { number: "01", label: "The Seer Records", href: "#the-seer" },
  { number: "02", label: "The Glass Opens", href: "#glass-opens" },
  { number: "03", label: "Mortals Pray", href: "#the-mortals" },
  { number: "04", label: "Gods Watch", href: "#featured-gods" },
  { number: "05", label: "Spirits Remember", href: "#the-spirits" },
  { number: "06", label: "Behind the Glass", href: "#behind-the-glass" },
  { number: "07", label: "The Circle Listens", href: "#the-seer-circle" },
];

export default function Home() {
  return (
    <main>
      <JsonLd data={homePageData} />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-mark-transparent.png" alt="" />
          Gaze Glass
        </a>
        <GlassMenu />
      </header>

      <div className="opening-rite" aria-hidden="true">
        <span>Behold.</span>
        <span>The glass wakes.</span>
        <span>A soul appears.</span>
      </div>

      <aside className="chapter-rail" aria-label="Observatory chapters">
        {chapters.map((chapter) => (
          <a key={chapter.number} href={chapter.href}>
            <span>{chapter.number}</span>
            {chapter.label}
          </a>
        ))}
      </aside>

      <section className="welcome-plate" aria-label="Gaze Glass greeting">
        <img
          src="/brand/hello-mortal-banner.png"
          alt="Gaze Glass greeting that reads Hello, Mortal."
        />
        <a href="#home" aria-label="Enter Gaze Glass">
          Enter the glass
        </a>
      </section>

      <section className="hero" id="home">
        <div className="stars" aria-hidden="true" />
        <div className="sphere-wrap" aria-hidden="true">
          <div className="celestial-sphere">
            <span className="orbital orbital-one" />
            <span className="orbital orbital-two" />
            <span className="orbital orbital-three" />
            <span className="glass-core" />
          </div>
        </div>
        <div className="hero-copy reveal">
          <p className="eyebrow">Gaze into the glass</p>
          <h1>Every mortal soul leaves a story behind.</h1>
          <div className="hero-vow" aria-hidden="true">
            <span>Gods Watch.</span>
            <span>Mortals Pray.</span>
            <span>Spirits Remember.</span>
          </div>
        </div>
        <a className="scroll-cue" href="#the-mortals" aria-label="Meet the first mortal">
          Meet the first mortal
        </a>
      </section>

      <section className="glass-portal reveal" id="gaze-into-glass" aria-label="Gaze into the glass">
        <div className="glass-portal-stage">
          <img
            className="world-orb"
            src="/brand/world-orb.png"
            alt="A sacred glass orb revealing a golden city and stars inside"
          />
          <div className="glass-portal-copy" aria-hidden="true">
            <span>Gaze Into The Glass</span>
            <p>The first mortal incident comes into view.</p>
          </div>
        </div>
      </section>

      <section className="section seer-prologue reveal" id="the-seer" aria-label="The Seer introduces Gaze Glass">
        <span className="chapter-stamp">01 / The Seer Records</span>
        <p className="eyebrow">Before the Observation</p>
        <h2>The Seer Records What the Glass Reveals.</h2>
        <p>
          Gaze Glass is a fantasy universe told through divine observations: gods who
          shape fate, spirits who remember what mortals forget, and ordinary souls
          changed by impossible blessings.
        </p>
        <p>
          The Seer is your guide through the glass. Begin with one mortal life, then
          follow the light outward to the gods and spirits watching from beyond.
        </p>
        <a className="text-link" href="#the-mortals">
          Begin the observation
        </a>
      </section>

      <section className="glass-threshold reveal" id="glass-opens" aria-label="Sacred glass threshold">
        <figure>
          <img src="/brand/sacred-mirror.webp" alt="A sacred golden mirror glowing inside a cosmic observatory" />
        </figure>
        <div>
          <span className="chapter-stamp">02 / The Glass Opens</span>
          <p className="eyebrow">The Glass Opens</p>
          <h2>Observation Begins at the Threshold.</h2>
          <p>
            Gold light enters the dark, passes through the sacred glass, and returns as
            story: divine pressure, mortal choice, and memory bright enough to survive.
          </p>
        </div>
      </section>

      <section className="section experience-spine reveal" aria-label="The Gaze Glass viewing ritual">
        <div className="spine-intro">
          <p className="eyebrow">The Viewing Ritual</p>
          <h2>Three Ways the Glass Reveals a Life.</h2>
        </div>
        <div className="view-rituals">
          {sacredViews.map((view) => (
            <article key={view.name} className="view-ritual">
              <div className={`view-mark ${view.symbol}`} aria-hidden="true" />
              <p>{view.name}</p>
              <h3>{view.vow}</h3>
              <span>{view.text}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="observation reveal" id="the-mortals">
        <div className="observation-glass" aria-hidden="true" />
        <div className="observation-copy">
          <span className="chapter-stamp">03 / Mortals Pray</span>
          <p className="eyebrow">Latest Observation</p>
          <h2>Marcella, Blessed by Justice.</h2>
          <p>
            A creative worker loses credit for the work she carried alone. In the
            hallway between humiliation and surrender, she asks Justice to witness.
          </p>
          <p className="observation-note">Just witnessed: Malika, Blessed by Love.</p>
          <a href="/the-mortals">Enter the mortal archive</a>
        </div>
        <figure className="observation-portrait">
          <img src="/mortals/marcella/portrait.webp" alt="Marcella reflected in a sacred golden mirror" />
          <figcaption>Witnessed by Justice</figcaption>
        </figure>
      </section>

      <section className="section split reveal" id="featured-gods">
        <div>
          <span className="chapter-stamp">04 / Gods Watch</span>
          <p className="eyebrow">Featured Gods</p>
          <h2>The Gods Do Not Sleep.</h2>
        </div>
        <div className="quiet-list">
          {gods.map((god) => (
            <article key={god.name} className="lineage">
              <figure>
                <img src={god.image} alt={`${god.name} portrait`} />
              </figure>
              <div>
                <p>{god.epithet}</p>
                <h3>{god.name}</h3>
                <span>{god.text}</span>
              </div>
            </article>
          ))}
          <a className="text-link" href="/the-gods">
            Enter the divine archive
          </a>
        </div>
      </section>

      <section className="section spirits reveal" id="the-spirits">
        <span className="chapter-stamp">05 / Spirits Remember</span>
        <p className="eyebrow">The Court of Foxes</p>
        <h2>Those Who Sit Beside Power.</h2>
        <div className="spirit-grid">
          {spirits.map((spirit) => (
            <article className="spirit-record" key={spirit.name}>
              <figure>
                <img src={spirit.image} alt={`${spirit.name}, ${spirit.role}`} />
              </figure>
              <div>
                <p>{spirit.role}</p>
                <h3>{spirit.name}</h3>
                <span>{spirit.text}</span>
                <small>{spirit.note}</small>
              </div>
            </article>
          ))}
        </div>
        <a className="text-link" href="/the-spirits">
          Enter the spirit archive
        </a>
      </section>

      <section className="section seer reveal" id="behind-the-glass">
        <figure className="seer-plate">
          <img src="/seer/seer-and-marok.webp" alt="The Seer and Marok observing a sacred glass orb" />
        </figure>
        <div className="seer-copy">
          <span className="chapter-stamp">06 / Behind the Glass</span>
          <p className="eyebrow">The Seer</p>
          <h2>The Keeper Behind the Glass.</h2>
          <p>
            Gaze Glass observes the dance between mortals, spirits, and gods, then
            translates what passes through the sacred instrument into story.
          </p>
          <div className="seer-rites" aria-label="The Seer's work">
            <span>Observes divine pressure.</span>
            <span>Records mortal consequence.</span>
            <span>Sends prayers through Marok.</span>
          </div>
          <div className="seer-links">
            <a className="text-link" href="mailto:behold@gazeglass.com">
              Send a message through the glass
            </a>
            <a className="text-link" href="https://www.tiktok.com/@gazeglass" target="_blank" rel="noreferrer">
              Watch the stories unfold on TikTok
            </a>
          </div>
        </div>
      </section>

      <section className="signup reveal" id="the-seer-circle">
        <span className="chapter-stamp">07 / The Circle Listens</span>
        <p className="eyebrow">Join the Circle</p>
        <h2>Letters from the Seer.</h2>
        <p>
          Join the Seer&apos;s private circle for free. You&apos;ll receive letters and
          blessings from the gods, mortal observations from the spirits, and the
          cosmology behind the glass.
        </p>
        <p className="direct-prayer">
          For prayers, invitations, and earthly messages:
          <a href="mailto:behold@gazeglass.com">behold@gazeglass.com</a>
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
