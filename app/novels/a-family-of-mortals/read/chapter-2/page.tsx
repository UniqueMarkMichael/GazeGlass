import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ChapterOneExperience } from "../chapter-1/ChapterOneExperience";
import chapter from "./chapter-two.json";
import { AFOM_ACCESS_COOKIE, hasAfomAccess } from "../../access";

export const metadata: Metadata = {
  title: "Chapter 2: Sahil — A Family of Mortals",
  description: "Witness Chapter 2 of A Family of Mortals by Gaze Glass.",
  robots: { index: false, follow: false, nocache: true },
};

const images = [
  {
    after: 12,
    src: "/novels/a-family-of-mortals/chapter-2/sahil-meets-arjun.png",
    alt: "Sahil and Arjun meet beneath mango trees, surrounded by luminous white peacocks.",
  },
  {
    after: 17,
    src: "/novels/a-family-of-mortals/chapter-2/marok-appears.png",
    alt: "Marok erupts in green divine fire before Sahil as white peacocks scatter through the jungle.",
  },
  {
    after: 35,
    src: "/novels/a-family-of-mortals/chapter-2/sahil-meets-god-of-beauty.png",
    alt: "Sahil meets the radiant, ten-armed God of Beauty in the back of a poachers' truck as rain and black birds hang frozen around them.",
  },
  {
    after: 56,
    src: "/novels/a-family-of-mortals/chapter-2/sahil-turns-zatik.png",
    alt: "Sahil radiates rose-colored divine power as Zatik transforms into black tourmaline and crumbles in the rain-soaked jungle.",
  },
];

const config = {
  number: 2,
  title: "Sahil",
  video: "/novels/a-family-of-mortals/chapter-2/hero.mp4",
  poster: "/novels/a-family-of-mortals/chapter-2/sahil-meets-arjun.png",
  invitation: "A child runs toward wonder. The gods are already watching.",
  scenes: [
    { key: "jungle", start: 0, label: "The Mango Grove", invitation: "Marok watches the youngest Shah race beneath an ocean-blue sky." },
    { key: "arjun", start: 4, label: "The Boy with the Peacocks", invitation: "Two children meet beyond the borders of language." },
    { key: "marok", start: 14, label: "The Fox Makes His Move", invitation: "Green flame turns wonder into a trap." },
    { key: "poachers", start: 19, label: "The Net", invitation: "The jungle closes around Sahil and the sacred birds." },
    { key: "beauty", start: 25, label: "The God of Beauty", invitation: "Time freezes. A divine offer begins." },
    { key: "pledge", start: 49, label: "The Pledge", invitation: "A child speaks an oath whose weight he cannot yet know." },
  ],
  relicTitle: "The Weight of a Child’s Yes",
  relicQuote: "“I pledge my loyalty—body, mind, and spirit to the God of Beauty.”",
  relicMeaning: "A divine contract may sound like a game to the mortal asked to sign it.",
  focusKind: "Mortal",
  focusName: "Sahil Shah",
  focusDescription: "The youngest Shah. Restless, fearless, and chosen before he understands the cost.",
};

export default async function ChapterTwoPage() {
  const cookieStore = await cookies();
  if (!hasAfomAccess(cookieStore.get(AFOM_ACCESS_COOKIE)?.value)) return null;

  return <ChapterOneExperience paragraphs={chapter.paragraphs} images={images} config={config} />;
}
