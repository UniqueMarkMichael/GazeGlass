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

function sceneLabel(index: number, total: number) {
  const labelsByCount: Record<number, string[]> = {
    2: ["The scene opens", "The witness arrives"],
    3: ["The scene opens", "The turn arrives", "The final echo"],
    4: ["The scene opens", "The pressure gathers", "The turn arrives", "The final echo"],
    5: ["The scene opens", "The pressure gathers", "The turn arrives", "The meaning lands", "The final echo"],
  };
  return labelsByCount[total]?.[index] ?? `Beat ${index + 1}`;
}

function buildScenes(body: Array<{ type: string; id: string }>, deity: (typeof deityById)[keyof typeof deityById]) {
  const paragraphIds = body.filter((block) => block.type === "p").map((block) => block.id);
  const paragraphCount = paragraphIds.length;
  const sceneCount = paragraphCount >= 16 ? 5 : paragraphCount >= 10 ? 4 : paragraphCount >= 5 ? 3 : 2;
  const startIds = Array.from({ length: sceneCount }, (_value, index) => {
    const paragraphIndex = Math.min(paragraphCount - 1, Math.floor((index / sceneCount) * paragraphCount));
    return paragraphIds[paragraphIndex] ?? "b0";
  });

  return startIds.map((startBlockId, index) => ({
    id: `sc-${index + 1}`,
    startBlockId,
    mood: index === 0 ? ("Neutral" as const) : deity,
    label: sceneLabel(index, sceneCount),
  }));
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
    scenes: buildScenes(body, deity),
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
