import type { Metadata } from "next";
import { GlassMenu } from "../components/GlassMenu";

export const metadata: Metadata = {
  title: "The Mortals | Gaze Glass",
  description:
    "Observed mortal case files from Gaze Glass: lives touched, tested, and transformed by divine blessing.",
};

const observations = [
  {
    label: "Before the Blessing",
    title: "The Labor No One Saw",
    text: "Marcella kept the work moving. She helped the room, softened the panic, and carried ideas across the finish line while others learned to expect her generosity.",
    image: "/mortals/marcella/stolen-credit.webp",
  },
  {
    label: "The Sacred Appeal",
    title: "A Prayer Beneath Fluorescent Light",
    text: "When her work was taken and renamed, Marcella did not ask for spectacle. She asked to be witnessed. That was enough for Justice to enter the record.",
    image: "/mortals/marcella/justice-prayer.webp",
  },
  {
    label: "After the Verdict",
    title: "Credit Returned, Power Shared",
    text: "The blessing did not make Marcella smaller or crueler. It restored the truth, then revealed the kind of leader she had already been becoming.",
    image: "/mortals/marcella/promotion.webp",
  },
];

export default function TheMortals() {
  return (
    <main>
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-mark-transparent.png" alt="" />
          Gaze Glass
        </a>
        <GlassMenu />
      </header>

      <section className="mortal-hero">
        <div className="stars" aria-hidden="true" />
        <figure className="mortal-portrait reveal">
          <img src="/mortals/marcella/portrait.webp" alt="Marcella reflected in a sacred gold mirror" />
        </figure>
        <div className="mortal-hero-copy reveal">
          <p className="eyebrow">The Mortal Archive</p>
          <h1>Marcella</h1>
          <p>
            Blessed by the God of Justice after her labor was stolen, her silence
            mistaken for consent, and her worth filed under another man&apos;s name.
          </p>
        </div>
      </section>

      <section className="mortal-dossier reveal" aria-label="Marcella dossier">
        <div>
          <p className="eyebrow">Observation 001</p>
          <h2>The Case of Stolen Credit.</h2>
        </div>
        <dl>
          <dt>Patron</dt>
          <dd>The God of Justice</dd>
          <dt>Blessing</dt>
          <dd>The truth becomes impossible to misattribute.</dd>
          <dt>Trial</dt>
          <dd>To receive recognition without becoming the kind of power that wounded her.</dd>
        </dl>
      </section>

      <section className="archive-threshold mortal-threshold reveal" aria-label="Mortal viewing threshold">
        <p className="eyebrow">Human View</p>
        <h2>The Mirror Refuses the Easy Version.</h2>
        <p>
          The mortal archive is not a repeat of the TikTok telling. Here, the
          glass slows the moment down until motive, wound, witness, and aftermath
          can be seen in the same reflection.
        </p>
      </section>

      <section className="mortal-observations" aria-label="Marcella observations">
        {observations.map((item, index) => (
          <article className="mortal-observation reveal" key={item.title}>
            <figure>
              <img src={item.image} alt={`${item.title} artwork`} />
            </figure>
            <div>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p className="eyebrow">{item.label}</p>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="mortal-closing reveal">
        <p className="eyebrow">How The Glass Records Mortals</p>
        <h2>Not the Viral Version. The Consequence.</h2>
        <p>
          TikTok may show the moment the blessing arrives. The archive preserves
          what the blessing changes: the wound, the witness, the choice after power.
        </p>
      </section>

      <footer className="site-footer" aria-label="Gaze Glass ritual line">
        <span>Gods Watch.</span>
        <span>Mortals Pray.</span>
        <span>Spirits Remember.</span>
      </footer>
    </main>
  );
}
