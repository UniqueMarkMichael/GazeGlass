import type { Metadata } from "next";
import { GlassMenu } from "../../components/GlassMenu";

export const metadata: Metadata = {
  title: "A Family of Mortals — Private Preview",
  description:
    "A private preview of A Family of Mortals, the first Gaze Glass novel.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

const sampleContents = [
  { marker: "SYN", title: "Synopsis", detail: "Open" },
  { marker: "PRO", title: "Prologue", detail: "Open" },
  { marker: "01", title: "Chapter One", detail: "Marok", href: "/novels/a-family-of-mortals/read/chapter-1" },
  { marker: "02", title: "Chapter Two", detail: "Sahil", status: "In production" },
  { marker: "03", title: "Chapter Three", detail: "Rashid", status: "In production" },
  { marker: "04", title: "Chapter Four", detail: "Rashid", status: "In production" },
  { marker: "05", title: "Chapter Five", detail: "Jermaine", status: "In production" },
];

export default function FamilyOfMortalsPreviewPage() {
  return (
    <main className="afom-page">
      <header className="site-header afom-site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-spectrum-mark.svg" alt="" />
          <span className="brand-name">Gaze Glass</span>
        </a>
        <GlassMenu />
      </header>

      <section className="afom-hero" aria-labelledby="afom-title">
        <picture className="afom-hero-picture">
          <source media="(max-width: 760px)" srcSet="/novels/a-family-of-mortals/cover.png" />
          <img
            className="afom-hero-art"
            src="/novels/a-family-of-mortals/hero.png"
            alt="A Family of Mortals by Gaze Glass, showing the Shah family beneath a celestial mechanism as divine power gathers around them"
          />
        </picture>
        <div className="afom-hero-shade" aria-hidden="true" />
        <h1 className="afom-visually-hidden" id="afom-title">A Family of Mortals</h1>
        <div className="afom-preview-mark" aria-label="This page is an unlisted private preview">
          Private Preview
        </div>
      </section>

      <section className="afom-product" aria-labelledby="afom-premise-title">
        <div className="afom-cover-wrap">
          <div className="afom-cover-halo" aria-hidden="true" />
          <img
            className="afom-cover"
            src="/novels/a-family-of-mortals/cover.png"
            alt="Cover of A Family of Mortals, showing the Shah family framed by gold celestial geometry"
          />
        </div>

        <div className="afom-product-copy">
          <p className="afom-kicker">A sealed account</p>
          <h2 id="afom-premise-title">When gods judge a world, they begin with a family.</h2>
          <p>
            When the gods become vexed by civilizations, they do not send fire or flood—they
            choose corruptible families. Earth&apos;s dysfunctional Shah family is offered divine
            power and one impossible charge: determine whether humanity deserves to survive.
          </p>
          <p>
            Rashid, the family&apos;s black sheep, sees what the others do not. Humanity may be
            broken, but it is still worth saving. To defend it, he must stand against the people
            whose faces he has known all his life—and the darkness growing inside himself.
          </p>

          <div className="afom-actions" aria-label="Novel actions">
            <a className="afom-button afom-button-secondary" href="/novels/a-family-of-mortals/read/chapter-1">
              Read Chapter One
            </a>
            <button
              className="afom-button afom-button-primary"
              type="button"
              aria-describedby="afom-preview-note"
              disabled
            >
              Unseal — $20
            </button>
          </div>
          <p className="afom-preview-note" id="afom-preview-note">
            Checkout is closed while this private preview is being prepared.
          </p>
        </div>
      </section>

      <section className="afom-sample" id="sample" aria-labelledby="afom-sample-title">
        <div className="afom-sample-heading">
          <p className="afom-kicker">The glass opens freely</p>
          <h2 id="afom-sample-title">Witness the beginning.</h2>
          <p>
            Enter the account without a key. The synopsis, prologue, and first five chapters
            will remain open to every reader.
          </p>
        </div>
        <ol className="afom-sample-list">
          {sampleContents.map((item) => (
            <li key={item.title} className={item.href ? "is-available" : undefined}>
              {item.href ? (
                <a href={item.href} aria-label={`Enter ${item.title}: ${item.detail}`}>
                  <span>{item.marker}</span>
                  <strong>{item.title}</strong>
                  <em>{item.detail}<small>Enter chapter</small></em>
                </a>
              ) : (
                <>
                  <span>{item.marker}</span>
                  <strong>{item.title}</strong>
                  <em>{item.detail}{item.status ? <small>{item.status}</small> : null}</em>
                </>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="afom-promise" aria-labelledby="afom-promise-title">
        <p className="afom-kicker">One door. One work. One key.</p>
        <h2 id="afom-promise-title">The story is the destination.</h2>
        <p>
          No account. No subscription. One purchase unseals the complete novel across your
          personal devices, while reading progress remains private to each one.
        </p>
        <div className="afom-promise-details" aria-label="Purchase details">
          <span>Complete digital novel</span>
          <span>Secure email key</span>
          <span>Observation Mode reader</span>
        </div>
      </section>

      <footer className="afom-footer">
        <a href="/#home">Return to Gaze Glass</a>
        <p>Unlisted working preview · Not yet available for purchase</p>
      </footer>
    </main>
  );
}
