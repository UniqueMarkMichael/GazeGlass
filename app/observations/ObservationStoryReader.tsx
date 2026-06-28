"use client";

import { Fragment, useMemo, useState } from "react";
import { CopyLinkButton } from "../components/CopyLinkButton";
import { playGlassSound } from "../components/glassSound";

type StoryImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  afterParagraph: number;
  wide?: boolean;
};

type ObservationStoryReaderProps = {
  slug: string;
  story: string[];
  storyImages: StoryImage[];
  heroImage?: string;
  heroImageAlt?: string;
  readTimeLabel: string;
  magnitudeLabel: string;
  readingTimeMin: number;
  manifestSrc: string;
};

export function ObservationStoryReader({
  slug,
  story,
  storyImages,
  heroImage,
  heroImageAlt,
  readTimeLabel,
  magnitudeLabel,
  readingTimeMin,
  manifestSrc,
}: ObservationStoryReaderProps) {
  const hasStoryImages = storyImages.length > 0;
  const [showImages, setShowImages] = useState(() => Boolean(heroImage && !hasStoryImages));
  const imagesByParagraph = useMemo(() => {
    const grouped = new Map<number, StoryImage[]>();

    for (const image of storyImages) {
      const key = image.afterParagraph;
      grouped.set(key, [...(grouped.get(key) ?? []), image]);
    }

    return grouped;
  }, [storyImages]);
  const hasImages = hasStoryImages || Boolean(heroImage);

  return (
    <>
      <div className="story-actions" aria-label="Story actions">
        <span>{readTimeLabel}</span>
        <span>{magnitudeLabel}</span>
        <CopyLinkButton />
        {hasImages ? (
          <button
            className="story-image-toggle"
            type="button"
            aria-pressed={showImages}
            aria-label={showImages ? "Hide story images" : "Show story images"}
            onClick={() => {
              setShowImages((current) => !current);
              playGlassSound(showImages ? "close" : "reveal");
            }}
          >
            Images
          </button>
        ) : null}
      </div>

      {heroImage ? (
        <figure className="observation-figure" hidden={!showImages}>
          <img src={heroImage} alt={heroImageAlt ?? ""} />
        </figure>
      ) : null}

      <observation-mode
        manifest-src={manifestSrc}
        reading-time-min={readingTimeMin}
        data-flag-second-gaze="off"
        data-flag-change-lens="off"
      >
        <article className="story-body om-source">
          {story.map((paragraph, index) => {
            const paragraphNumber = index + 1;
            const images = showImages ? (imagesByParagraph.get(paragraphNumber) ?? []) : [];

            return (
              <Fragment key={`${slug}-${index}`}>
                <p>{paragraph}</p>
                {images.map((image) => (
                  <figure
                    className={`story-inline-figure${image.wide ? " story-inline-figure-wide" : ""}`}
                    key={image.id}
                  >
                    <img src={image.src} alt={image.alt} loading="lazy" />
                    <figcaption>{image.caption}</figcaption>
                  </figure>
                ))}
              </Fragment>
            );
          })}
        </article>
      </observation-mode>
    </>
  );
}
