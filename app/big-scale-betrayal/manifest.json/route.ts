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
  {
    chapterNumber: 3,
    after: 2,
    type: "image",
    src: `${assetBase}/chapter3-image-1.png`,
    alt: "Heba and Amunet watch Sate arrive in a sandstorm between two armored crocodiles in the Kemet market",
    caption: "Sate rises from the sand, and Matu and Nefer turn the market toward judgment.",
    wide: true,
  },
  {
    chapterNumber: 3,
    after: 9,
    type: "image",
    src: `${assetBase}/chapter3-image-4.png`,
    alt: "Heba studies her glowing scale with a white feather and living red heart in the quiet of the cabbage stall",
    caption: "Heba watches the heart beat and the feather burn, understanding that the scale is still speaking.",
    wide: true,
  },
  {
    chapterNumber: 3,
    after: 41,
    type: "image",
    src: `${assetBase}/chapter3-image-2.png`,
    alt: "Prince Ahmose rises from a wave of dark red wine while Sate lies defeated in the market",
    caption: "Ahmose steps out of the wine, and the marketplace learns another kind of power has arrived.",
    wide: true,
  },
  {
    chapterNumber: 3,
    after: 78,
    type: "image",
    src: `${assetBase}/chapter3-image-3.png`,
    alt: "A translucent ice hawk spreads its wings before Heba, Amunet, and the crocodile guardians in the Kemet market",
    caption: "Water becomes a hawk of ice, and Heba sees Heka answer in public.",
    wide: true,
  },
  {
    chapterNumber: 4,
    after: 1,
    type: "image",
    src: `${assetBase}/chapter4-heba-wakes-palace.png`,
    alt: "Heba wakes on an ornate palace bed beneath gold chandeliers and murals of the gods",
    caption: "Heba wakes beneath gold and god-murals, far from the cabbage stall.",
    wide: true,
  },
  {
    chapterNumber: 4,
    after: 10,
    type: "image",
    src: `${assetBase}/chapter4-queen-of-kemet.png`,
    alt: "The Queen of Kemet extends her hand in a golden palace chamber",
    caption: "The great royal wife offers her hand, and the palace names her queen.",
    wide: true,
  },
  {
    chapterNumber: 4,
    after: 59,
    type: "image",
    src: `${assetBase}/chapter4-tawet-seket-rift.png`,
    alt: "Tawet conjures a cloud while Seket steps through a golden rift beside Heba in the palace",
    caption: "Tawet shows off, Seket tears through the air, and Heba lands on a cloud.",
    wide: true,
  },
  {
    chapterNumber: 4,
    after: 71,
    type: "image",
    src: `${assetBase}/chapter4-pharaoh-of-kemet.png`,
    alt: "The Pharaoh of Kemet appears in gold light while attendants bow in the palace",
    caption: "The Pharaoh gathers himself from black sand, and the room remembers how to kneel.",
    wide: true,
  },
  {
    chapterNumber: 5,
    after: 4,
    type: "image",
    src: `${assetBase}/chapter5-pharaoh-conjures-cat.png`,
    alt: "The Pharaoh conjures a smoky rainbow cat onto Heba's shoulder in the palace",
    caption: "The Pharaoh gives smoke weight, and Heba learns the palace can make wonder feel like command.",
    wide: true,
  },
  {
    chapterNumber: 5,
    after: 24,
    type: "image",
    src: `${assetBase}/chapter5-heba-meets-aken.png`,
    alt: "Heba faces Prince Aken as shadowy Heka gathers behind him in the palace",
    caption: "Aken arrives with a darker silence, and Heba feels another royal heart enter the room.",
    wide: true,
  },
  {
    chapterNumber: 5,
    after: 41,
    type: "image",
    src: `${assetBase}/chapter5-heba-dreams-unity.png`,
    alt: "Heba stands between the royal family as golden light connects them in the palace",
    caption: "The royal family closes around Heba, beautiful as a promise and dangerous as a lock.",
    wide: true,
  },
  {
    chapterNumber: 5,
    after: 68,
    type: "image",
    src: `${assetBase}/chapter5-ahmose-ice-flower.png`,
    alt: "Ahmose conjures a delicate ice flower between himself and Heba in the palace",
    caption: "Ahmose turns tears into ice, and the flower between them says what neither can afford to name.",
    wide: true,
  },
  {
    chapterNumber: 6,
    after: 23,
    type: "image",
    src: `${assetBase}/chapter6-mata-first-lesson.png`,
    alt: "Mata sits with Heba and a black jackal beside an old linen strip painted with a scale",
    caption: "Mata sets the first lesson between them, old linen holding a truth Heba has already seen.",
    wide: true,
  },
  {
    chapterNumber: 6,
    after: 81,
    type: "image",
    src: `${assetBase}/chapter6-black-sand-trace.png`,
    alt: "Mata, Heba, and a black jackal find glittering black sand before the royal throne",
    caption: "The jackal finds black sand before the throne, and the palace loses another layer of gold.",
    wide: true,
  },
  {
    chapterNumber: 6,
    after: 160,
    type: "image",
    src: `${assetBase}/chapter6-ahmose-doorway.png`,
    alt: "Ahmose raises his hands in the palace doorway while Heba, Mata, and the jackal watch him",
    caption: "Ahmose enters with empty hands, inked nails, and a silence Heba cannot weigh.",
    wide: true,
  },
  {
    chapterNumber: 6,
    after: 294,
    type: "image",
    src: `${assetBase}/chapter6-scale-heart-beats.png`,
    alt: "Heba holds the old linen scale as the painted heart glows red in her hands",
    caption: "The lesson warms in Heba's hands, and the painted heart begins to beat.",
    wide: true,
  },
  {
    chapterNumber: 7,
    after: 12,
    type: "image",
    src: `${assetBase}/chapter7-copper-corridor.png`,
    alt: "Heba, Mata, Ahmose, the jackal, and crocodile guardians move through a copper-lined palace corridor",
    caption: "The corridor narrows, the pots watch, and even the crocodiles know where not to follow.",
    wide: true,
  },
  {
    chapterNumber: 7,
    after: 32,
    type: "image",
    src: `${assetBase}/chapter7-duna-kitchen-ghost.png`,
    alt: "The golden spirit of Duna kneads bread before Heba, Mata, and the jackal in the palace kitchen",
    caption: "Duna sings without a heartbeat, and the kitchen remembers a man the palace forgot to ask about.",
    wide: true,
  },
  {
    chapterNumber: 7,
    after: 53,
    type: "image",
    src: `${assetBase}/chapter7-mata-golden-word.png`,
    alt: "Mata raises one hand as golden Heka spirals over a honey-cake trace in the palace kitchen",
    caption: "Mata spends one word, the loaves sink, and the trap leaves a honey-cake shape behind.",
    wide: true,
  },
  {
    chapterNumber: 7,
    after: 93,
    type: "image",
    src: `${assetBase}/chapter7-threshold-scale.png`,
    alt: "Heba kneels with a lamp before a black-sand scale drawn across a palace threshold",
    caption: "At the threshold, black sand writes Heba's name and draws the shape that has been following her.",
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
