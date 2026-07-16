import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AFOM_ACCESS_COOKIE, hasAfomAccess } from "../../access";
import { ChapterOneExperience } from "../chapter-1/ChapterOneExperience";
import chapter from "./chapter-three.json";

export const metadata: Metadata = {
  title: "Chapter 3: Rashid — A Family of Mortals",
  description: "Witness Chapter 3 of A Family of Mortals by Gaze Glass.",
  robots: { index: false, follow: false, nocache: true },
};

const images = [
  {
    after: 24,
    src: "/novels/a-family-of-mortals/chapter-3/tea-merchant.png",
    alt: "The Tea Merchant pours chai for Rashid and Jermaine at dusk while the rescued calf watches beside them.",
  },
  {
    after: 28,
    src: "/novels/a-family-of-mortals/chapter-3/garland.png",
    alt: "A grateful mother places a marigold and jasmine garland around Rashid's neck as Jermaine and her children gather beside the tea cart.",
  },
  {
    after: 38,
    src: "/novels/a-family-of-mortals/chapter-3/hooded-figure.png",
    alt: "Rashid looks back at a faceless hooded figure in scarlet boots moving through the darkening marketplace beneath circling black birds.",
  },
  {
    after: 65,
    src: "/novels/a-family-of-mortals/chapter-3/rashid-pulls-hair.png",
    alt: "Rashid weeps beneath the full moon, holding strands of his pulled hair as Jermaine reaches toward him and the rescued calf remains at his side.",
  },
];

const config = {
  number: 3,
  title: "Rashid",
  video: "/novels/a-family-of-mortals/chapter-3/hero.mp4",
  poster: "/novels/a-family-of-mortals/chapter-3/hero-poster.png",
  invitation: "Two brothers guide a lost calf home—and expose the wounds they carry with them.",
  scenes: [
    { key: "mountain", start: 0, label: "Above the Ganges", invitation: "Marok watches Rashid and Jermaine climb with a hungry calf." },
    { key: "market", start: 5, label: "The Marketplace", invitation: "Cruelty tests Jermaine’s anger and Rashid’s instinct to retreat." },
    { key: "fracture", start: 13, label: "People Like Me", invitation: "One unfinished sentence opens an old and dangerous wound." },
    { key: "tea", start: 19, label: "The Tea Merchant", invitation: "A stranger offers warmth before anger consumes what love remains." },
    { key: "hooded", start: 38, label: "The Hooded Figure", invitation: "Something impossible crosses Rashid’s path and vanishes into the crowd." },
    { key: "family", start: 44, label: "The Shah Family", invitation: "Rashid names the shape of home—and why he longs to escape it." },
    { key: "voice", start: 54, label: "Find Your Voice", invitation: "Jermaine asks Rashid to believe he is not powerless." },
  ],
  relicTitle: "Love Does Not Make You Small",
  relicQuote: "“Love doesn’t make you sad. Love doesn’t make you feel small.”",
  relicMeaning: "Rashid recognizes harm clearly in others, even when he cannot yet escape it himself.",
  focusKind: "Mortal",
  focusName: "Rashid Shah",
  focusDescription: "The middle Shah child. Tender, observant, and convinced that survival requires making himself smaller.",
};

export default async function ChapterThreePage() {
  const cookieStore = await cookies();
  if (!hasAfomAccess(cookieStore.get(AFOM_ACCESS_COOKIE)?.value)) return null;

  return <ChapterOneExperience paragraphs={chapter.paragraphs} images={images} config={config} />;
}
