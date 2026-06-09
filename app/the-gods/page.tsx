import type { Metadata } from "next";
import { GlassMenu } from "../components/GlassMenu";

export const metadata: Metadata = {
  title: "The Gods | Gaze Glass",
  description:
    "Enter the divine archive of Gaze Glass and witness gods whose lives still bend the mortal world.",
};

const gods = [
  {
    name: "The God of Love",
    domain: "Love",
    image: "/gods/love.webp",
    station: "A deity who believes love can reach a mortal even at the edge of chaos.",
    observation:
      "Crafted from larimar, with long curly white hair and gemstone-smooth skin, the God of Love is the only deity who believes love can pull a mortal back from the prickly, cold edge of chaos. Remember, do not cross her, because there's nothing worse than living with a broken heart.",
    note: "Love is treated as rescue, threat, and binding force all at once.",
  },
  {
    name: "The God of Fortune",
    domain: "Fortune",
    image: "/gods/fortune.webp",
    station: "A long-game strategist whose mismatched eyes have seen every possible outcome.",
    observation:
      "Dual-toned in copper, gold, and scarlet with mismatched eyes that have seen every possible outcome, the God of Fortune plays the long game — because luck has never been random. Fortune does not merely favor the bold; Fortune decides what bold even looks like.",
    note: "Fortune's favor is not chance. It is selection.",
  },
  {
    name: "The God of Beauty",
    domain: "Beauty",
    image: "/gods/beauty.webp",
    station: "A radiant, dangerous patron whose warmth disarms even War.",
    observation:
      "Ten arms. Midnight indigo skin. Sun-gold hair. The God of Beauty moves through every room like the ending of a prayer — honeyed voice, cold lips, and a warmth that disarms even the God of War. She believes that beauty is not decoration but survival, and she will prove it one mortal at a time.",
    note: "Beauty is survival, control, spectacle, and temptation.",
  },
  {
    name: "The God of War",
    domain: "War",
    image: "/gods/war.webp",
    station: "Born from divine betrayal and bound to the judgment of civilizations.",
    observation:
      "Born from the moment a Cardinal god was betrayed by the first mortals, the God of War decreed that every civilization in breach of cosmic law would face a harrowing judgment — annihilation or salvation. Cold, exacting, and forged from the light of the first flames, War loves to win any game or challenge.",
    note: "War turns cosmic law into trial, spectacle, and consequence.",
  },
  {
    name: "The God of Justice",
    domain: "Justice",
    image: "/gods/justice.webp",
    station: "The architect of the trials that force pledges to shed their egos.",
    observation:
      "Made of gold and clad in yellow diamond armor, the God of Justice designs the trials that strip pledges of their egos and determine what survives. Methodical where War is instinct, Justice is the architecture of the judgment itself — the unseen hand that builds the gauntlet everyone else must walk through.",
    note: "Justice builds the gauntlet; mortals reveal what survives inside them.",
  },
  {
    name: "The God of Story",
    domain: "Story",
    image: "/gods/story.webp",
    station: "Keeper of the record by which civilizations are remembered or forgotten.",
    observation:
      "Bald, built of black steel, with wings wide enough to swallow the light from every window, the God of Story runs the judgment briefings with sharp teeth and sharper questions. She is the keeper of every civilization's record — the one who decides which stories are worth telling and which worlds deserve to be remembered.",
    note: "Story is not ornament. Story is evidence.",
  },
  {
    name: "The God of Death",
    domain: "Death",
    image: "/gods/death.webp",
    station: "Receiver and guide of souls, weighing what every life tried to bury.",
    observation:
      "Every soul that has ever drawn breath will eventually arrive at my scales — not with fear, but with the weight of every choice they buried, every truth they refused to carry. The God of Death does not take the living. They receive and guide the sorting of souls.",
    note: "Death is sorting, witness, and passage rather than simple ending.",
  },
  {
    name: "The God of Wisdom",
    domain: "Wisdom",
    image: "/gods/wisdom.webp",
    station: "Keeper of the cosmic record and the novel's opening divine correspondent.",
    observation:
      "The keeper of the entire cosmic record, the God of Wisdom addresses mortals by name before the story has even begun. Where other gods govern through force or spectacle, Wisdom governs through knowing, and there is nothing it does not already know.",
    note: "Wisdom knows the archive before the witness arrives.",
  },
  {
    name: "The God of Mercy",
    domain: "Mercy",
    image: "/gods/mercy.webp",
    station: "Guardian of the sacred soul-jewel at the center of judgment.",
    observation:
      "The God of Mercy holds the sacred soul of every world in judgment — a jewel so precious that even Earth surrendered it willingly when the time came. Where other gods measure mortals by what they've done, Mercy measures them by what they're still capable of becoming — and those who find a shard of that light shall not die, but be reborn.",
    note: "Mercy is the possibility that survives judgment.",
  },
  {
    name: "The God of Chaos",
    domain: "Chaos",
    image: "/gods/chaos.webp",
    station: "The primordial origin from which creation itself was born.",
    observation:
      "Hooded, six-eyed, and enthroned in a cracked onyx castle at the edge of Oblivion, the God of Chaos is the oldest force in the cosmos — the primordial from which all creation was born, and the only deity capable of spontaneous creation. Absent from every judgment briefing for reasons no one will say aloud, Chaos does not command mortals; they waits for them to find their way to the void.",
    note: "Chaos waits at the edge of Oblivion, outside the ordinary order of judgment.",
  },
];

const rites = [
  "The Cardinal gods created Paradise, the Realm of the Dead, and Utopia.",
  "A pledge is an unbreakable contract between the divine and a chosen mortal.",
  "The Judgment asks whether a world deserves salvation, damnation, or rebirth.",
];

export default function TheGods() {
  return (
    <main>
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-mark-transparent.png" alt="" />
          Gaze Glass
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
          <p className="eyebrow">The Divine Archive</p>
          <h1>The Gods</h1>
          <p>
            These are not distant idols. They are living pressures upon the world,
            immense enough to be mistaken for weather, law, memory, or fate.
          </p>
        </div>
      </section>

      <section className="archive-threshold reveal" aria-label="Divine viewing threshold">
        <p className="eyebrow">Epic View</p>
        <h2>Gold Light Enters Darkness.</h2>
        <p>
          The Gods are viewed through the orb: immense, slow, and dangerous to
          simplify. Each record is a pressure reading from the divine weather.
        </p>
      </section>

      <section className="god-index reveal" aria-label="God index">
        <p className="eyebrow">Observed Pantheon</p>
        <div>
          {gods.map((god, index) => (
            <a key={god.name} href={`#${god.name.toLowerCase().replaceAll(" ", "-")}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {god.name}
            </a>
          ))}
        </div>
      </section>

      <section className="god-records" aria-label="God records">
        {gods.map((god, index) => (
          <article
            className="god-record reveal"
            id={god.name.toLowerCase().replaceAll(" ", "-")}
            key={god.name}
          >
            <div className="record-number">{String(index + 1).padStart(2, "0")}</div>
            <figure className="god-plate">
              <img src={god.image} alt={`${god.name} portrait`} />
            </figure>
            <div>
              <p className="eyebrow">God of {god.domain}</p>
              <h2>{god.name}</h2>
            </div>
            <div className="record-body">
              <p className="station">{god.station}</p>
              <p>{god.observation}</p>
              <dl>
                <dt>Archive Note</dt>
                <dd>{god.note}</dd>
              </dl>
            </div>
          </article>
        ))}
      </section>

      <section className="cosmology-note reveal">
        <p className="eyebrow">Rite of Classification</p>
        <h2>Divinity Is Filed by Consequence.</h2>
        <div>
          {rites.map((rite) => (
            <p key={rite}>{rite}</p>
          ))}
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
