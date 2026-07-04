import type { Metadata } from "next";
import { GlassMenu } from "../components/GlassMenu";
import { JsonLd } from "../components/JsonLd";

export const metadata: Metadata = {
  title: "Seer",
  description:
    "Meet the Seer behind Gaze Glass, the keeper who witnesses gods, spirits, mortals, and the sacred stories that pass through the glass.",
  alternates: {
    canonical: "/the-seer",
  },
  openGraph: {
    title: "Seer | Gaze Glass",
    description:
      "The mythic about page for Gaze Glass: the keeper behind the glass, the work of witnessing, and the invitation to readers.",
    url: "/the-seer",
    images: [
      {
        url: "/seer/seer-and-marok.webp",
        width: 1024,
        height: 1024,
        alt: "The Seer and Marok observing a sacred glass orb",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seer | Gaze Glass",
    description:
      "Meet the keeper behind Gaze Glass, where gods, spirits, and mortals are witnessed through sacred story.",
    images: ["/seer/seer-and-marok.webp"],
  },
};

const seerPageData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://www.gazeglass.com/the-seer#webpage",
  url: "https://www.gazeglass.com/the-seer",
  name: "Seer | Gaze Glass",
  description:
    "The keeper behind Gaze Glass, a fantasy story world where gods, spirits, and mortals are witnessed through sacred observations.",
  isPartOf: {
    "@id": "https://www.gazeglass.com/#website",
  },
  about: {
    "@type": "Organization",
    name: "Gaze Glass",
    email: "behold@gazeglass.com",
  },
};

const work = [
  "The Seer observes divine pressure before it becomes prophecy.",
  "The Seer records mortal consequence after a blessing changes the room.",
  "The Seer keeps the spirits close, because they remember what power forgets.",
];

export default function TheSeer() {
  return (
    <main>
      <JsonLd data={seerPageData} />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-spectrum-mark.svg" alt="" />
          <span className="brand-name">Gaze Glass</span>
        </a>
        <GlassMenu />
      </header>

      <section className="mortal-hero seer-hero-page">
        <div className="stars" aria-hidden="true" />
        <figure className="mortal-portrait reveal">
          <img src="/seer/seer-and-marok.webp" alt="The Seer and Marok observing a sacred glass orb" />
        </figure>
        <div className="mortal-hero-copy reveal">
          <p className="eyebrow">The Keeper Behind the Glass</p>
          <h1>Seer</h1>
          <p>
            You came to watch the gods. The glass turned, and now it watches you.
            That is where every Gaze Glass story begins.
          </p>
        </div>
      </section>

      <section className="archive-threshold reveal" aria-label="The Seer's manifesto">
        <p className="eyebrow">The Work</p>
        <h2>The Archive Is Not Written. It Is Witnessed.</h2>
        <p>
          Gaze Glass translates what passes through the sacred instrument: gods as
          pressure, spirits as memory, mortals as consequence. The Seer keeps the
          record so readers can enter the myth without losing the thread.
        </p>
      </section>

      <section className="cosmology-note reveal">
        <p className="eyebrow">Seer Records</p>
        <h2>What Passes Through the Glass.</h2>
        <div>
          {work.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
        <a className="text-link return-link" href="/#the-seer-circle">
          Join the Circle
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
