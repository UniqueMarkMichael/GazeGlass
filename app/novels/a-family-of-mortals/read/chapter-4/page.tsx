import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AFOM_ACCESS_COOKIE, hasAfomAccess } from "../../access";
import { ChapterOneExperience } from "../chapter-1/ChapterOneExperience";
import chapter from "./chapter-four.json";

export const metadata: Metadata = {
  title: "Chapter 4: Rashid — A Family of Mortals",
  description: "Witness Chapter 4 of A Family of Mortals by Gaze Glass.",
  robots: { index: false, follow: false, nocache: true },
};

const images = [
  {
    after: 22,
    src: "/novels/a-family-of-mortals/chapter-4/chotu-banana.png",
    alt: "Chotu stretches for a banana while Rashid steadies the calf and Jermaine watches beside the merchant's hanging scale.",
  },
  {
    after: 35,
    src: "/novels/a-family-of-mortals/chapter-4/grandmother-meets-jermaine.png",
    alt: "Jermaine kneels as Rashid's grandmother cups his face, with Rashid and Chotu beside them in the village street.",
  },
  {
    after: 54,
    src: "/novels/a-family-of-mortals/chapter-4/grandmother-guides-rashid.png",
    alt: "Rashid's grandmother guides him through the transformed temple threshold as one white sneaker withers into a leather sandal.",
  },
  {
    after: 68,
    src: "/novels/a-family-of-mortals/chapter-4/black-cobra-temple.png",
    alt: "A black cobra peers from a diamond-shaped opening in the restored temple beneath a crimson sky.",
  },
  {
    after: 110,
    src: "/novels/a-family-of-mortals/chapter-4/monkey-on-jermaine.png",
    alt: "A monkey lands on Jermaine's head beneath a banyan tree while Rashid laughs and Chotu watches among butterflies.",
  },
];

const config = {
  number: 4,
  title: "Rashid",
  video: "/novels/a-family-of-mortals/chapter-4/hero.mp4",
  poster: "/novels/a-family-of-mortals/chapter-4/hero-poster.png",
  invitation: "An abandoned temple remembers what Rashid has forgotten about himself.",
  scenes: [
    { key: "dead", start: 0, label: "The Realm of the Dead", invitation: "Marok watches from a place even spirits fear to linger." },
    { key: "balance", start: 1, label: "The Hanging Scale", invitation: "A hungry calf turns a banana stall into a lesson about balance." },
    { key: "grandmother", start: 23, label: "Grandmother", invitation: "Chotu finds home—and the boys meet the keeper of an older truth." },
    { key: "judgment", start: 31, label: "The Watching Village", invitation: "Jermaine kneels. The village reveals what it believes he should be." },
    { key: "temple", start: 46, label: "The Abandoned Temple", invitation: "Seven locks guard the story of a priestess called wicked." },
    { key: "awakening", start: 53, label: "Embrace Your Power", invitation: "Rashid steps forward, and the ruin remembers its sacred shape." },
    { key: "cobra", start: 68, label: "The Cobra Watches", invitation: "The restored temple shows itself to Rashid alone." },
    { key: "belonging", start: 82, label: "Home and Belonging", invitation: "The boys name the histories that taught them to feel invisible." },
    { key: "viper", start: 99, label: "The Viper", invitation: "A violent omen falls from the branches before them." },
    { key: "monkey", start: 110, label: "Under the Banyan Tree", invitation: "For one breath, fear gives way to laughter." },
  ],
  relicTitle: "Let Go of Control",
  relicQuote: "“Let go of control and trust yourself.”",
  relicMeaning: "Rashid's power answers instinct before it answers certainty.",
  focusKind: "Mortal",
  focusName: "Rashid Shah",
  focusDescription: "A reluctant heir to a buried family gift, standing at the threshold between self-doubt and awakening.",
};

export default async function ChapterFourPage() {
  const cookieStore = await cookies();
  if (!hasAfomAccess(cookieStore.get(AFOM_ACCESS_COOKIE)?.value)) return null;

  return <ChapterOneExperience paragraphs={chapter.paragraphs} images={images} config={config} />;
}
