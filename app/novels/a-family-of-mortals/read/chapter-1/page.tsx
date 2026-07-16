import type { Metadata } from "next";
import chapter from "./chapter-one.json";
import { ChapterOneExperience } from "./ChapterOneExperience";

export const metadata: Metadata = {
  title: "Chapter 1: Marok — A Family of Mortals",
  description: "Witness Chapter 1 of A Family of Mortals by Gaze Glass.",
  robots: { index: false, follow: false, nocache: true },
};

const images = [
  { after: 1, src: "/novels/a-family-of-mortals/chapter-1/marok-floating-over-foxnip.png", alt: "Marok, a many-tailed green fox spirit, floats above luminous foxnip in the Realm of Paradise." },
  { after: 15, src: "/novels/a-family-of-mortals/chapter-1/marok-bows-to-war.png", alt: "Marok bows before the many-eyed primordial form of the God of War beside a mirror overlooking Earth." },
  { after: 22, src: "/novels/a-family-of-mortals/chapter-1/god-of-beauty-appears.png", alt: "The radiant, ten-armed God of Beauty appears among crystalline trees beneath an eclipsed sky." },
  { after: 54, src: "/novels/a-family-of-mortals/chapter-1/gods-kissing.png", alt: "The God of War and the many-armed God of Beauty kiss amid crimson and rose-colored divine energy.", portrait: true },
  { after: 73, src: "/novels/a-family-of-mortals/chapter-1/snakes-possessed.png", alt: "Two black cobras entwine outside a weathered farmhouse, glowing with crimson and violet divine possession." },
];

export default function ChapterOnePage() {
  return <ChapterOneExperience paragraphs={chapter.paragraphs} images={images} />;
}
