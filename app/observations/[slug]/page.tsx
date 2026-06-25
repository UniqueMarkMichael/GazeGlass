import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "../../components/CopyLinkButton";
import { GlassMenu } from "../../components/GlassMenu";
import { JsonLd } from "../../components/JsonLd";
import { ObservationModeBoot } from "../../components/ObservationModeBoot";
import {
  getNextObservation,
  getObservation,
  getObservationHref,
  getPreviousObservation,
  getRelatedObservations,
  godFilterLabels,
  observations,
  regionMeta,
  spiritFilterLabels,
} from "../data";

type ObservationPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return observations
    .filter((observation) => !observation.canonicalPath)
    .map((observation) => ({
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
      canonical: getObservationHref(observation),
    },
    openGraph: {
      title: `${observation.title} | Gaze Glass`,
      description: observation.seoDescription,
      url: getObservationHref(observation),
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
  const previousObservation = getPreviousObservation(observation.slug);
  const nextObservation = getNextObservation(observation.slug);
  const storyData = {
    "@context": "https://schema.org",
    "@type": "ShortStory",
    "@id": `https://www.gazeglass.com${getObservationHref(observation)}/#story`,
    url: `https://www.gazeglass.com${getObservationHref(observation)}`,
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
      <ObservationModeBoot />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="/#home" aria-label="Gaze Glass home">
          <img className="brand-mark" src="/brand/gaze-glass-logo-color.png" alt="" />
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
              <dd>
                <a href={`/the-gods#the-god-of-${observation.godId}`}>
                  {godFilterLabels[observation.godId]}
                </a>
              </dd>
              {observation.spiritWitnessIds.length ? (
                <>
                  <dt>Spirit Witness</dt>
                  <dd>
                    {observation.spiritWitnessIds.map((spiritId, index) => (
                      <span key={spiritId}>
                        <a href={`/the-spirits#${spiritId}`}>{spiritFilterLabels[spiritId]}</a>
                        {index < observation.spiritWitnessIds.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </dd>
                </>
              ) : null}
              <dt>Themes</dt>
              <dd>{observation.themeTags.join(", ")}</dd>
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

            <observation-mode
              manifest-src={`/observations/${observation.slug}/manifest.json`}
              data-flag-second-gaze="off"
              data-flag-change-lens="off"
            >
              <article className="story-body om-source">
                {observation.story.map((paragraph, index) => (
                  <p key={`${observation.slug}-${index}`}>{paragraph}</p>
                ))}
              </article>
            </observation-mode>

            <nav className="observation-path" aria-label="Observation reading path">
              <a href={previousObservation ? getObservationHref(previousObservation) : "/observations"}>
                <span>Previous</span>
                <strong>{previousObservation ? previousObservation.title : "Observation Archive"}</strong>
              </a>
              <a href={nextObservation ? getObservationHref(nextObservation) : "/observations"}>
                <span>{nextObservation ? "Next Observation" : "Latest Vision"}</span>
                <strong>{nextObservation ? nextObservation.title : "Browse the full archive"}</strong>
              </a>
            </nav>
          </div>

          <aside className="related-panel" aria-label="More like this">
            <p className="eyebrow">More Like This</p>
            {related.map((item) => (
              <a href={getObservationHref(item)} key={item.slug}>
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
