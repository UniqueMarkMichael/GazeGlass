import Link from "next/link";

type PreludeExperienceProps = {
  title: string;
  sectionLabel: string;
  invitation: string;
  paragraphs: string[];
  poster: string;
  nextHref: string;
  nextLabel: string;
};

export function PreludeExperience({
  title,
  sectionLabel,
  invitation,
  paragraphs,
  poster,
  nextHref,
  nextLabel,
}: PreludeExperienceProps) {
  return (
    <main className="afom-reader afom-novel-mode" data-theme="night" data-font="literary" data-width="balanced" data-font-step="1">
      <header className="afom-reader-bar">
        <Link href="/novels/a-family-of-mortals" className="afom-reader-back"><span aria-hidden="true">←</span> A Family of Mortals</Link>
        <span className="afom-reader-progress">Before the Judgment</span>
      </header>

      <section className="afom-chapter-hero" aria-labelledby="prelude-title">
        <div className="afom-chapter-still" style={{ backgroundImage: `url('${poster}')` }} aria-hidden="true" />
        <div className="afom-chapter-veil" aria-hidden="true" />
        <div className="afom-chapter-titleblock">
          <p>A Family of Mortals</p><span>{sectionLabel}</span><h1 id="prelude-title">{title}</h1>
          <div className="afom-chapter-sigil" aria-hidden="true">◆</div>
          <p className="afom-chapter-invitation">{invitation}</p>
        </div>
      </section>

      <article className="afom-prose" aria-label={`${title} of A Family of Mortals`}>
        {paragraphs.map((paragraph, index) => (
          <div className="afom-prose-beat" key={index}>
            <p className={index === 0 ? "afom-dropcap" : undefined}>{paragraph}</p>
          </div>
        ))}
      </article>

      <footer className="afom-chapter-end">
        <span aria-hidden="true">✦</span><p>End of {title}</p>
        <Link className="afom-next-chapter" href={nextHref}>{nextLabel}</Link>
        <Link href="/novels/a-family-of-mortals">Return to the sealed account</Link>
      </footer>
    </main>
  );
}
