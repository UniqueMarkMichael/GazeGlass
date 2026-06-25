import { NextResponse } from "next/server";
import type { ObservationStoryImage } from "../../data";
import {
  getNextObservation,
  getObservation,
  getObservationHref,
  godFilterLabels,
  observations,
} from "../../data";

type ManifestRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

const deityById = {
  wisdom: "Wisdom",
  justice: "Justice",
  love: "Love",
  fortune: "Fortune",
  war: "War",
} as const;

function imageBlock(image: ObservationStoryImage) {
  return {
    type: "image" as const,
    id: `img-${image.id}`,
    src: image.src,
    alt: image.alt,
    caption: image.caption,
    wide: image.wide,
  };
}

export function generateStaticParams() {
  return observations.map((observation) => ({
    slug: observation.slug,
  }));
}

export async function GET(_request: Request, { params }: ManifestRouteProps) {
  const { slug } = await params;
  const observation = getObservation(slug);

  if (!observation) {
    return NextResponse.json({ message: "Observation not found" }, { status: 404 });
  }

  const nextObservation = getNextObservation(observation.slug);
  const imagesByParagraph = new Map<number, ObservationStoryImage[]>();
  for (const image of observation.storyImages ?? []) {
    const key = image.afterParagraph;
    imagesByParagraph.set(key, [...(imagesByParagraph.get(key) ?? []), image]);
  }
  const body = observation.story.flatMap((paragraph, index) => [
    {
      type: "p" as const,
      id: `b${index}`,
      text: paragraph,
    },
    ...(imagesByParagraph.get(index + 1) ?? []).map(imageBlock),
  ]);
  const wordCount = observation.story.join(" ").split(/\s+/).filter(Boolean).length;
  const deity = deityById[observation.godId];

  return NextResponse.json({
    schemaVersion: 1,
    id: `obs-${observation.number}`,
    number: Number.parseInt(observation.number, 10),
    title: observation.title,
    realm: observation.regionLabel,
    magnitude: "Story",
    deity,
    recordedBy: "The Seer",
    readingTimeMin: observation.readingTimeMin,
    wordCount,
    contentNote: null,
    body,
    scenes: [
      { id: "sc-opening", startBlockId: "b0", mood: "Neutral" },
      {
        id: "sc-witness",
        startBlockId: body[Math.max(0, Math.floor(body.length / 2))]?.id ?? "b0",
        mood: deity,
      },
    ],
    glossary: [
      {
        key: observation.godId,
        title: godFilterLabels[observation.godId],
        kind: "god",
        blurb: `${godFilterLabels[observation.godId]} is the divine force associated with this Observation.`,
        href: `/the-gods#the-god-of-${observation.godId}`,
      },
    ],
    keyQuotations: [],
    nextPaths: [
      { label: `Follow ${deity}`, href: `/the-gods#the-god-of-${observation.godId}`, kind: "follow-deity" },
      {
        label: "Let the Glass Choose",
        href: nextObservation ? getObservationHref(nextObservation) : "/observations",
        kind: "random",
      },
      { label: "Return to the Archive", href: "/observations", kind: "archive" },
    ],
    secondGaze: [],
    lenses: {},
    chapters: [],
  });
}
