import type { Metadata } from "next";
import { JsonLd } from "../components/JsonLd";
import { PressCopyButton } from "./PressCopyButton";
import { PRESS_ROUTE, pressGalleryContent } from "./pressGalleryContent";

const siteUrl = "https://www.gazeglass.com";
const pressUrl = `${siteUrl}${PRESS_ROUTE}`;

export const metadata: Metadata = {
  title: {
    absolute: pressGalleryContent.meta.title,
  },
  description: pressGalleryContent.meta.description,
  alternates: {
    canonical: pressUrl,
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: pressGalleryContent.meta.title,
    description: pressGalleryContent.meta.shortDescription,
    type: "website",
    url: pressUrl,
    siteName: "Gaze Glass",
    images: [
      {
        url: pressGalleryContent.meta.ogImage,
        width: 1200,
        height: 630,
        alt: "The Press Gallery for Gaze Glass.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pressGalleryContent.meta.title,
    description: pressGalleryContent.meta.shortDescription,
    images: [pressGalleryContent.meta.ogImage],
  },
};

const pressPageData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${pressUrl}#webpage`,
  url: pressUrl,
  name: pressGalleryContent.meta.title,
  description: pressGalleryContent.meta.description,
  isPartOf: {
    "@id": `${siteUrl}/#website`,
  },
  about: ["Gaze Glass", "press resources", "fantasy fiction", "storytech"],
};

function formatLastUpdated() {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function SectionHeader({
  id,
  kicker,
  title,
  description,
}: {
  id?: string;
  kicker?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="press-section-header">
      {kicker ? <p>{kicker}</p> : null}
      <h2 id={id}>{title}</h2>
      {description ? <span>{description}</span> : null}
    </div>
  );
}

function CopyBlock({ label, meta, text }: { label: string; meta?: string; text: string }) {
  const isPending = text.startsWith("[");

  return (
    <article className={`press-copy-block${isPending ? " is-pending" : ""}`}>
      <div className="press-copy-block-top">
        <div>
          <h3>{label}</h3>
          {meta ? <p>{meta}</p> : null}
        </div>
        {isPending ? (
          <span className="press-pending-pill">Pending</span>
        ) : (
          <PressCopyButton text={text} ariaLabel={`Copy ${label}`} />
        )}
      </div>
      <p>{text}</p>
    </article>
  );
}

function DownloadLinks({
  webSrc,
  printSrc,
  downloadName,
  title,
}: {
  webSrc?: string;
  printSrc?: string;
  downloadName: string;
  title: string;
}) {
  if (!webSrc && !printSrc) {
    return <span className="press-download-pending">Downloads pending final asset</span>;
  }

  return (
    <div className="press-download-links">
      {webSrc ? (
        <a href={webSrc} download={downloadName}>
          Download web {title}
        </a>
      ) : null}
      {printSrc ? (
        <a href={printSrc} download={downloadName.replace("-web", "-print")}>
          Download print-resolution {title}
        </a>
      ) : (
        <span>Print-resolution file pending</span>
      )}
    </div>
  );
}

export default function PressGalleryPage() {
  const lastUpdated = formatLastUpdated();
  const currentYear = new Date().getFullYear();

  return (
    <main className="press-gallery-page">
      <JsonLd data={pressPageData} />
      <header className="press-masthead">
        <img
          className="press-masthead-art"
          src={pressGalleryContent.masthead.keyArt.src}
          alt={pressGalleryContent.masthead.keyArt.alt}
          width="2172"
          height="724"
        />
        <div className="press-masthead-shade" aria-hidden="true" />
        <div className="press-masthead-content">
          <p className="press-logotype">{pressGalleryContent.masthead.logotype}</p>
          <p className="press-label">{pressGalleryContent.masthead.label}</p>
          <h1>The Press Gallery</h1>
          <p className="press-sanctioned-line">{pressGalleryContent.masthead.line}</p>
          <div className="press-masthead-meta">
            <span>Last updated: {lastUpdated}</span>
            <a href="#media-contact">{pressGalleryContent.masthead.mediaContactLabel}</a>
          </div>
        </div>
      </header>

      <section className="press-nutgraph" aria-label="Gaze Glass overview">
        <p>
          Gaze Glass is the pen name and storytech imprint of a New York writer building a
          single interconnected fantasy world across novels, interactive fiction, and the web.
          Its cosmology — <cite>Gods Watch, Mortals Pray, Spirits Remember</cite> — anchors a
          growing catalogue led by <cite>A Family of Mortals</cite>, an adult epic in which a
          broken family is drafted to execute humanity&apos;s final judgment, and one brother
          refuses.
        </p>
      </section>

      <section className="press-section" aria-labelledby="press-facts-title">
        <SectionHeader id="press-facts-title" kicker="01" title="At A Glance" description="Key facts for quick reference." />
        <dl className="press-fact-grid">
          {pressGalleryContent.facts.map((fact) => (
            <div key={fact.label} className={fact.value.startsWith("[") ? "is-pending" : undefined}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="press-section" aria-labelledby="press-works-title">
        <SectionHeader
          id="press-works-title"
          kicker="02"
          title="The Works"
          description="Catalogue overview for coverage, interviews, and backgrounders."
        />
        <div className="press-works-grid">
          {pressGalleryContent.works.map((work) => (
            <article className="press-work-card" key={work.title}>
              <div className="press-work-image">
                {"image" in work && work.image ? (
                  <img loading="lazy" src={work.image.src} alt={work.image.alt} />
                ) : (
                  <span>{work.coverAssetId} pending</span>
                )}
              </div>
              <div className="press-work-copy">
                <p>{work.shortTitle}</p>
                <h3>{work.title}</h3>
                <dl>
                  <div>
                    <dt>Category</dt>
                    <dd>{work.category}</dd>
                  </div>
                  {"length" in work ? (
                    <div>
                      <dt>Length</dt>
                      <dd>{work.length}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>Status</dt>
                    <dd>{work.status}</dd>
                  </div>
                  <div>
                    <dt>Rating</dt>
                    <dd>{work.rating}</dd>
                  </div>
                </dl>
                <p className="press-work-logline">
                  {"logline" in work ? work.logline : "tagline" in work ? work.tagline : "Logline pending."}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="press-section" aria-labelledby="press-angles-title">
        <SectionHeader
          id="press-angles-title"
          kicker="03"
          title="Story Angles"
          description="Ready-to-run entry points for features, interviews, and segment pitches."
        />
        <div className="press-angle-list">
          {pressGalleryContent.storyAngles.map((angle) => (
            <article key={angle.hook} className={angle.description.startsWith("[") ? "is-pending" : undefined}>
              <h3>{angle.hook}</h3>
              <p>{angle.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="press-section" aria-labelledby="press-boilerplate-title">
        <SectionHeader
          id="press-boilerplate-title"
          kicker="04"
          title="Boilerplate"
          description="Approved copy blocks for accurate pickup."
        />
        <div className="press-copy-grid">
          {pressGalleryContent.boilerplates.map((block) => (
            <CopyBlock
              key={block.label}
              label={block.label}
              meta={`${block.wordCount} words`}
              text={block.text}
            />
          ))}
        </div>
      </section>

      <section className="press-section press-founder" aria-labelledby="press-founder-title">
        <SectionHeader
          id="press-founder-title"
          kicker="05"
          title="Founder Bio"
          description="Bio copy will be completed after the real-name and headshot decision."
        />
        <div className="press-founder-layout">
          <aside className="press-founder-card">
            <div className="press-founder-image">
              <span>[MARK_HEADSHOT_SRC_TBD]</span>
            </div>
            <h3>{pressGalleryContent.founder.displayName}</h3>
            <p>{pressGalleryContent.founder.title}</p>
            <dl>
              <div>
                <dt>Pen name</dt>
                <dd>{pressGalleryContent.founder.penName}</dd>
              </div>
              <div>
                <dt>Real name</dt>
                <dd>{pressGalleryContent.founder.realName}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{pressGalleryContent.founder.location}</dd>
              </div>
            </dl>
          </aside>
          <div className="press-copy-grid">
            {pressGalleryContent.founder.bios.map((bio) => (
              <CopyBlock key={bio.label} label={bio.label} text={bio.text} />
            ))}
          </div>
        </div>
      </section>

      <section className="press-section" aria-labelledby="press-quotes-title">
        <SectionHeader
          id="press-quotes-title"
          kicker="06"
          title="Quotes You Can Lift"
          description="Pre-cleared quotes for stories, intros, and interview setup."
        />
        <div className="press-quote-grid">
          {pressGalleryContent.quotes.map((quote) => (
            <article className="press-quote-card" key={quote.quote}>
              <blockquote>“{quote.quote}”</blockquote>
              <div>
                <p>— {quote.attribution}</p>
                <PressCopyButton text={`"${quote.quote}" — ${quote.attribution}`} ariaLabel={`Copy quote: ${quote.quote}`} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="press-section" aria-labelledby="press-downloads-title">
        <SectionHeader
          id="press-downloads-title"
          kicker="07"
          title="Press Kit / Downloads"
          description="Individual assets are available as they are approved. Final kit zip is pending the remaining art."
        />
        <div className="press-downloads-hub">
          <div className="press-kit-callout">
            <div>
              <h3>Download full press kit (.zip)</h3>
              <p>{pressGalleryContent.pressKit.status}</p>
            </div>
            <span>Pending final assets</span>
          </div>
          <div className="press-download-grid">
            {pressGalleryContent.assets.map((asset) => {
              const thumbnailSrc = "thumbnailSrc" in asset ? asset.thumbnailSrc : undefined;
              const webSrc = "webSrc" in asset ? asset.webSrc : undefined;
              const printSrc = "printSrc" in asset ? asset.printSrc : undefined;
              const dimensions = "dimensions" in asset ? asset.dimensions : undefined;
              const format = "format" in asset ? asset.format : undefined;

              return (
                <article className="press-asset-card" key={asset.id}>
                  {thumbnailSrc ? (
                    <img loading="lazy" src={thumbnailSrc} alt={asset.alt} />
                  ) : (
                    <div className="press-asset-pending" aria-hidden="true">
                      <span>Pending</span>
                    </div>
                  )}
                  <div className="press-asset-copy">
                    <p>{asset.category}</p>
                    <h3>{asset.title}</h3>
                    <p>{asset.caption}</p>
                    <dl>
                      <div>
                        <dt>Credit</dt>
                        <dd>{asset.credit}</dd>
                      </div>
                      <div>
                        <dt>Usage</dt>
                        <dd>{asset.usage}</dd>
                      </div>
                      {dimensions ? (
                        <div>
                          <dt>Dimensions</dt>
                          <dd>{dimensions}</dd>
                        </div>
                      ) : null}
                      {format ? (
                        <div>
                          <dt>Format</dt>
                          <dd>{format}</dd>
                        </div>
                      ) : null}
                    </dl>
                    <DownloadLinks
                      webSrc={webSrc}
                      printSrc={printSrc}
                      downloadName={asset.downloadName}
                      title={asset.title}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="press-section press-contact" id="media-contact" aria-labelledby="media-contact-title">
        <SectionHeader id="media-contact-title" kicker="08" title={pressGalleryContent.contact.label} />
        <div className="press-contact-card">
          <div>
            <h3>{pressGalleryContent.contact.name}</h3>
            <a href={pressGalleryContent.contact.mailto}>{pressGalleryContent.contact.email}</a>
            <span>{pressGalleryContent.contact.mailboxNote}</span>
          </div>
          <p>{pressGalleryContent.contact.responseTime}</p>
          <p>{pressGalleryContent.contact.availability}</p>
        </div>
      </section>

      <section className="press-section" aria-labelledby="press-coverage-title">
        <SectionHeader id="press-coverage-title" kicker="09" title="Coverage" />
        <div className="press-empty-state">
          Coverage will be added here as placements publish.
        </div>
      </section>

      <section className="press-section" aria-labelledby="press-releases-title">
        <SectionHeader id="press-releases-title" kicker="10" title="News / Releases" />
        <div className="press-empty-state">
          News and releases will be posted here as they become available.
        </div>
      </section>

      <footer className="press-footer">
        <p>© {currentYear} Gaze Glass. Media contact: {pressGalleryContent.contact.email}.</p>
        <p>This page is unlisted — please do not publish the URL.</p>
      </footer>
    </main>
  );
}
