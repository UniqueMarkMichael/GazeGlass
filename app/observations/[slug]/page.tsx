import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "../../components/CopyLinkButton";
import { GlassMenu } from "../../components/GlassMenu";
import { JsonLd } from "../../components/JsonLd";
import { getObservation, getRelatedObservations, observations, regionMeta } from "../data";

type ObservationPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return observations.map((observation) => ({
    slug: observation.slug,
  }));
}

export async function generateMetadata({ params }: ObservationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const observation = getObservation(slug);

  if (!observation) {
    return {};
  }

  return {
    title: observation.seoTitle,
    description: observation.seoDescription,
    alternates: {
      canonical: `/observations/${observation.slug}`,
    },
    openGraph: {
      title: `${observation.title} | Gaze Glass`,
      description: observation.seoDescription,
      url: `/observations/${observation.slug}`,
      type: "article",
      images: observation.image
        ? [
            {
              url: observation.image,
              width: 1200,
              height: 1200,
              alt: observation.imageAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${observation.title} | Gaze Glass`,
      description: observation.seoDescription,
      images: observation.image ? [observation.image] : ["/og/gaze-glass.png"],
    },
  };
}

export default async function ObservationPage({ params }: ObservationPageProps) {
  const { slug } = await params;
  const observation = getObservation(slug);

  if (!observation) {
    notFound();
  }

  const related = getRelatedObservations(observation);
  const storyData = {
    "@context": "https://schema.org",
    "@type": "ShortStory",
    "@id": `https://www.gazeglass.com/observations/${observation.slug}/#story`,
    url: `https://www.gazeglass.com/observations/${observation.slug}`,
    name: observation.title,
    headline: observation.title,
    description: observation.seoDescription,
    genre: ["Fantasy", "Mythic Fantasy", "Flash Fiction"],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "Gaze Glass Observations",
      url: "https://www.gazeglass.com/observations",
    },
    datePublished: observation.dateObserved,
    author: {
      "@type": "Organization",
      name: "Gaze Glass",
    },
  };

  return (
    <main>
      <JsonLd data={storyData} />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-mark-transparent.png" alt="" />
          Gaze Glass
        </a>
        <GlassMenu />
      </header>

      <article className="observation-page">
        <a className="back-link" href="/observations">
          Back to Observations
        </a>
        <div className="observation-shell">
          <aside className="observation-sidebar" aria-label="Observation metadata">
            <span className={`magnitude-mark magnitude-${observation.magnitude}`} aria-hidden="true" />
            <dl>
              <dt>Magnitude</dt>
              <dd>{observation.magnitudeLabel}</dd>
              <dt>Region</dt>
              <dd>{regionMeta[observation.region].title}</dd>
              <dt>Associated With</dt>
              <dd>{observation.association}</dd>
              <dt>Recorded</dt>
              <dd>{observation.dateObserved}</dd>
            </dl>
          </aside>

          <div className="reading-column">
            <header className="observation-story-header">
              <p className="eyebrow">Observation {observation.number}</p>
              <h1>{observation.title}</h1>
              <p>{observation.description}</p>
              <div className="story-actions" aria-label="Story actions">
                <span>{observation.readTime}</span>
                <span>{observation.magnitudeLabel}</span>
                <CopyLinkButton />
              </div>
            </header>

            {observation.image ? (
              <figure className="observation-figure">
                <img src={observation.image} alt={observation.imageAlt} />
              </figure>
            ) : null}

            <div className="story-body">
              {observation.story.map((paragraph, index) => (
                <p key={`${observation.slug}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="related-panel" aria-label="More like this">
            <p className="eyebrow">More Like This</p>
            {related.map((item) => (
              <a href={`/observations/${item.slug}`} key={item.slug}>
                <span>{item.number}</span>
                <strong>{item.title}</strong>
                <em>{item.readTime}</em>
              </a>
            ))}
            <a className="text-link" href={`/observations/${observation.region}`}>
              View {regionMeta[observation.region].title}
            </a>
          </aside>
        </div>
      </article>

      <footer className="site-footer" aria-label="Gaze Glass ritual line">
        <span>Gods Watch.</span>
        <span>Mortals Pray.</span>
        <span>Spirits Remember.</span>
      </footer>
    </main>
  );
}
