import { GlassMenu } from "./components/GlassMenu";

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
    text: "The dutiful fox who sits beside the God of Justice at every divine briefing, Kitsu embodies the quiet authority of a deity who once wore yellow diamond armor to a meeting just to survive a bad day. Where others posture, Kitsu watches — and in the space between accusation and verdict, the truth always finds its way to the light.",
  },
  {
    name: "Marok",
    role: "Assistant to the God of War",
    image: "/spirits/marok.webp",
    text: "A top graduate of the Academy of Fate and Destiny, Marok is the architect of Judgements — the brilliant, chaotic little fox who designs the trials that bring mortals to their knees while sneezing green fire and spinning in concentric circles. He serves one of the most feared forces in all dimensions, and does it with a wagging tail.",
  },
  {
    name: "Jem",
    role: "Assistant to the God of Beauty",
    image: "/spirits/jem.webp",
    text: "Jem moves through the divine courts wrapped in the warmth of a goddess who measures worth in ways mortals can't yet see, offering counsel that stings like a claw and heals like a kiss. In the presence of beauty that destroys and creates in the same breath, Jem has learned that the most sacred thing is knowing which one the moment calls for.",
  },
  {
    name: "Sindren",
    role: "Assistant to the God of Love",
    image: "/spirits/sindren.webp",
    text: "Cobalt-furred and unshakably composed, Sindren has watched enough divine briefings to know when a fox is lying about being petrified — and is polite enough to say so anyway. Perched beside the goddess of larimar, Sindren is proof that the gentlest god keeps the sharpest company.",
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

export default function Home() {
  return (
    <main>
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-mark-transparent.png" alt="" />
          Gaze Glass
        </a>
        <GlassMenu />
      </header>

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
          <p className="eyebrow">Look through the glass, into the divine</p>
          <h1>Peer Through the Glass.</h1>
          <p className="subhead">Every soul leaves a story behind.</p>
        </div>
        <a className="scroll-cue" href="#featured-gods" aria-label="Scroll to featured gods">
          Observe
        </a>
      </section>

      <section className="section intro reveal" aria-label="Gaze Glass introduction">
        <p>
          Within Gaze Glass, myth is not archived. It is witnessed. Each page is a lens
          turned toward a life still moving somewhere beyond ordinary sight.
        </p>
      </section>

      <section className="glass-threshold reveal" aria-label="Sacred glass threshold">
        <figure>
          <img src="/brand/sacred-mirror.webp" alt="A sacred golden mirror glowing inside a cosmic observatory" />
        </figure>
        <div>
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

      <section className="section split reveal" id="featured-gods">
        <div>
          <p className="eyebrow">Featured Gods</p>
          <h2>The Immortal Lives Are Not Still.</h2>
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
        <p className="eyebrow">Assistant of The Month</p>
        <h2>The Foxes Who Sit Beside Power.</h2>
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
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="observation reveal" id="the-mortals">
        <div className="observation-glass" aria-hidden="true" />
        <p className="eyebrow">Latest Observation</p>
        <h2>Marcella, Blessed by Justice.</h2>
        <p>
          A creative worker loses credit for the work she carried alone. In the
          hallway between humiliation and surrender, she asks Justice to witness.
        </p>
        <a href="/the-mortals">Enter the mortal archive</a>
      </section>

      <section className="section seer reveal" id="the-seer">
        <figure className="seer-plate">
          <img src="/seer/seer-and-marok.webp" alt="The Seer and Marok observing a sacred glass orb" />
        </figure>
        <div className="seer-copy">
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
          <a className="text-link" href="https://www.tiktok.com/@gazeglass" target="_blank" rel="noreferrer">
            Visit the living observations
          </a>
        </div>
      </section>

      <section className="signup reveal" id="the-seer-circle">
        <p className="eyebrow">The Seer Circle</p>
        <h2>Receive New Observations.</h2>
        <p>
          Enter the private circle for letters on gods, spirits, mortals, and the
          hidden cosmology behind Gaze Glass.
        </p>
        <form>
          <label htmlFor="email">Email address</label>
          <div>
            <input id="email" type="email" placeholder="you@example.com" />
            <button type="submit">Join the Circle</button>
          </div>
        </form>
      </section>

      <footer className="site-footer" aria-label="Gaze Glass ritual line">
        <span>Gods Watch.</span>
        <span>Mortals Pray.</span>
        <span>Spirits Remember.</span>
      </footer>
    </main>
  );
}
