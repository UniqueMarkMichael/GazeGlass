import { NextResponse } from "next/server";
import { bigScaleChapters } from "../chapters";

const assetBase = "/big-scale-betrayal/assets";

type ChapterMedia = {
  after: number;
  alt?: string;
  caption: string;
  chapterNumber: number;
  src: string;
  type: "image" | "video";
  wide?: boolean;
};

const chapterMedia: ChapterMedia[] = [
  {
    chapterNumber: 1,
    after: 2,
    type: "video",
    src: `${assetBase}/chapter1.mp4`,
    caption: "The armored guardian of the royal library of Kemet, bells at its throat, incense at its brow.",
    alt: "The armored guardian of the royal library of Kemet",
    wide: true,
  },
  {
    chapterNumber: 1,
    after: 3,
    type: "image",
    src: `${assetBase}/heba-intro.png`,
    alt: "Heba carrying cabbages down the temple steps of Kemet",
    caption: "Heba, daughter of a vegetable merchant, before the gods finished naming her fate.",
    wide: true,
  },
  {
    chapterNumber: 1,
    after: 20,
    type: "image",
    src: `${assetBase}/market.png`,
    alt: "Heba and a young thief near a cabbage stall in the market of Kemet",
    caption: "The market of Kemet, the hour before the chase.",
    wide: true,
  },
  {
    chapterNumber: 1,
    after: 33,
    type: "video",
    src: `${assetBase}/feather.mp4`,
    caption: "A feather for the oracle, a hand for the boy.",
    alt: "A feather moving through golden light",
    wide: true,
  },
  {
    chapterNumber: 1,
    after: 44,
    type: "video",
    src: `${assetBase}/chapter1-end.mp4`,
    caption: "Destined to sell cabbage, or so she believed.",
    alt: "Heba at the end of Chapter One",
    wide: true,
  },
];

function wordCount() {
  return bigScaleChapters
    .flatMap((chapter) => chapter.paragraphs)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function getReadingTimeMin() {
  return Math.max(1, Math.round(wordCount() / 220));
}

function mediaBlocks(chapterNumber: number, paragraphNumber: number) {
  return chapterMedia
    .filter((media) => media.type === "image" && media.chapterNumber === chapterNumber && media.after === paragraphNumber)
    .map((media) => ({
      type: "image" as const,
      id: `img-ch${media.chapterNumber}-${media.after}`,
      src: media.src,
      alt: media.alt ?? media.caption,
      caption: media.caption,
      wide: media.wide,
    }));
}

function buildBody() {
  return bigScaleChapters.flatMap((chapter) => [
    {
      type: "h" as const,
      id: `chapter-${chapter.number}`,
      level: 2 as const,
      text: chapter.title,
    },
    {
      type: "fieldnote" as const,
      id: `chapter-${chapter.number}-deck`,
      speaker: "The Seer",
      text: chapter.deck,
    },
    ...chapter.paragraphs.flatMap((paragraph, index) => [
      {
        type: "p" as const,
        id: `ch${chapter.number}-p${index + 1}`,
        text: paragraph,
      },
      ...mediaBlocks(chapter.number, index + 1),
    ]),
  ]);
}

function buildScenes() {
  return bigScaleChapters.map((chapter, index) => ({
    id: `scene-chapter-${chapter.number}`,
    startBlockId: `chapter-${chapter.number}`,
    mood: index % 3 === 0 ? ("Wisdom" as const) : ("Neutral" as const),
    label: `Chapter ${chapter.number}: ${chapter.title}`,
    accentOverride: index % 2 === 0 ? "#e0a030" : "#5fb7c4",
  }));
}

export function GET() {
  const body = buildBody();
  const chapters = bigScaleChapters.map((chapter) => ({
    id: `chapter-${chapter.number}`,
    title: chapter.title,
    startBlockId: `chapter-${chapter.number}`,
  }));

  return NextResponse.json({
    schemaVersion: 1,
    id: "big-scale-betrayal",
    number: 2,
    title: "Big Scale Betrayal",
    realm: "The Mortals",
    magnitude: "Novel",
    deity: "Wisdom",
    recordedBy: "The Seer",
    readingTimeMin: getReadingTimeMin(),
    wordCount: wordCount(),
    contentNote: "A mythic fantasy prequel with danger, divine judgment, and palace betrayal.",
    body,
    scenes: buildScenes(),
    ambientTrack: {
      src: "/audio/atmosphere/divine-sanctuary-observatory.mp3",
      format: "mp3",
      loop: true,
      gainDb: -22,
    },
    glossary: [
      {
        key: "heba",
        title: "Heba",
        kind: "mortal",
        blurb: "A merchant's daughter whose gift can weigh the truth of almost any heart.",
      },
      {
        key: "kemet",
        title: "Kemet",
        kind: "term",
        blurb: "The ancient kingdom where market debt, royal power, and divine law collide.",
      },
      {
        key: "sacred-scales",
        title: "The Sacred Scales",
        kind: "term",
        blurb: "Heba's instrument of judgment, where feather, heart, and truth refuse to stay symbolic.",
      },
      {
        key: "god-of-order",
        title: "God of Order",
        kind: "god",
        blurb: "The divine pressure behind Heba's gift, law, and impossible usefulness to power.",
      },
      {
        key: "matu-nefer",
        title: "Matu and Nefer",
        kind: "term",
        blurb: "Armored crocodile guardians of the royal library, loyal to sacred law and very sharp teeth.",
      },
    ],
    keyQuotations: [
      "Love doesn't fix everything.",
      "I cannot judge you.",
      "Destined to sell cabbage.",
    ],
    nextPaths: [
      { label: "Return to the steps", href: "/big-scale-betrayal#big-scale-betrayal", kind: "preserve" },
      { label: "Enter A Court of Foxes", href: "/a-court-of-foxes", kind: "random" },
      { label: "Return to Observations", href: "/observations", kind: "archive" },
    ],
    secondGaze: [
      {
        oid: "ch1-p13",
        note: "Heba says she has weighed her options before the world shows her how literal weighing can become.",
      },
      {
        oid: "ch1-p44",
        note: "The line sounds humble, but the Glass hears a prophecy disguising itself as resignation.",
      },
    ],
    lenses: {},
    chapters,
  });
}
