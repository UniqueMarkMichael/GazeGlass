import type { Metadata } from "next";
import Link from "next/link";
import chapter from "./chapter-one.json";

export const metadata: Metadata = {
  title: "Chapter 1: Marok — A Family of Mortals",
  description: "Witness Chapter 1 of A Family of Mortals by Gaze Glass.",
  robots: { index: false, follow: false, nocache: true },
};

const images: Record<number, { src: string; alt: string; portrait?: boolean }> = {
  1: {
    src: "/novels/a-family-of-mortals/chapter-1/marok-floating-over-foxnip.png",
    alt: "Marok, a many-tailed green fox spirit, floats above luminous foxnip in the Realm of Paradise.",
  },
  15: {
    src: "/novels/a-family-of-mortals/chapter-1/marok-bows-to-war.png",
    alt: "Marok bows before the many-eyed primordial form of the God of War beside a mirror overlooking Earth.",
  },
  22: {
    src: "/novels/a-family-of-mortals/chapter-1/god-of-beauty-appears.png",
    alt: "The radiant, ten-armed God of Beauty appears among crystalline trees beneath an eclipsed sky.",
  },
  54: {
    src: "/novels/a-family-of-mortals/chapter-1/gods-kissing.png",
    alt: "The God of War and the many-armed God of Beauty kiss amid crimson and rose-colored divine energy.",
    portrait: true,
  },
  73: {
    src: "/novels/a-family-of-mortals/chapter-1/snakes-possessed.png",
    alt: "Two black cobras entwine outside a weathered farmhouse, glowing with crimson and violet divine possession.",
  },
};

export default function ChapterOnePage() {
  return (
    <main className="afom-reader">
      <header className="afom-reader-bar">
        <Link href="/novels/a-family-of-mortals" className="afom-reader-back">
          <span aria-hidden="true">←</span> A Family of Mortals
        </Link>
        <span className="afom-reader-progress">Chapter 1 of 77</span>
      </header>

      <section className="afom-chapter-hero" aria-labelledby="chapter-title">
        <video
          className="afom-chapter-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/novels/a-family-of-mortals/chapter-1/marok-floating-over-foxnip.png"
          aria-hidden="true"
        >
          <source src="/novels/a-family-of-mortals/chapter-1/hero.mp4" type="video/mp4" />
        </video>
        <div className="afom-chapter-veil" aria-hidden="true" />
        <div className="afom-chapter-titleblock">
          <p>A Family of Mortals</p>
          <span>Chapter One</span>
          <h1 id="chapter-title">Marok</h1>
          <div className="afom-chapter-sigil" aria-hidden="true">◆</div>
          <p className="afom-chapter-invitation">The Judgment begins in Paradise.</p>
        </div>
      </section>

      <article className="afom-prose" aria-label="Chapter 1: Marok">
        <p className="afom-dropcap">{chapter.paragraphs[0]}</p>
        {chapter.paragraphs.slice(1).map((paragraph, offset) => {
          const index = offset + 1;
          const image = images[index];
          return (
            <div className="afom-prose-beat" key={index}>
              {image && (
                <figure className={image.portrait ? "afom-story-image afom-story-image-portrait" : "afom-story-image"}>
                  <img src={image.src} alt={image.alt} loading="lazy" />
                </figure>
              )}
              <p>{paragraph}</p>
            </div>
          );
        })}
      </article>

      <footer className="afom-chapter-end">
        <span aria-hidden="true">✦</span>
        <p>End of Chapter One</p>
        <button type="button" disabled>Chapter Two · Coming to the pilot</button>
        <Link href="/novels/a-family-of-mortals">Return to the sealed account</Link>
      </footer>
    </main>
  );
}
