import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AFOM_ACCESS_COOKIE, hasAfomAccess } from "../../access";
import { ChapterOneExperience } from "../chapter-1/ChapterOneExperience";
import chapter from "./chapter-five.json";

export const metadata: Metadata = {
  title: "Chapter 5: Jermaine — A Family of Mortals",
  description: "Witness Chapter 5 of A Family of Mortals by Gaze Glass.",
  robots: { index: false, follow: false, nocache: true },
};

const images = [
  {
    after: 1,
    src: "/novels/a-family-of-mortals/chapter-5/marok-above-the-storm.png",
    alt: "Marok bounds gleefully through moonlit storm clouds above the four Shah siblings, Jermaine, and the rescued calf far below in the jungle.",
  },
  {
    after: 3,
    src: "/novels/a-family-of-mortals/chapter-5/meet-priya-and-sonam.png",
    alt: "Priya and Sonam Shah emerge beneath a storm-darkened banyan tree in matching emerald dresses, with the rescued calf between them.",
  },
  {
    after: 4,
    src: "/novels/a-family-of-mortals/chapter-5/jermaine-fruit-drops.png",
    alt: "Jermaine recoils from a mosquito on his nose as his fruit drops spill beside Priya, Sonam, Rashid, and the rescued calf beneath the storm-darkened banyan trees.",
  },
  {
    after: 21,
    src: "/novels/a-family-of-mortals/chapter-5/sonam-confronts-rashid.png",
    alt: "Sonam confronts Rashid beneath lightning and driving rain while Jermaine and Priya watch the siblings' argument turn dangerous.",
  },
  {
    after: 36,
    src: "/novels/a-family-of-mortals/chapter-5/priya-intervenes.png",
    alt: "Priya steps between Sonam and Rashid beneath the lightning, raising a protective hand as Jermaine holds Rashid close and the rescued calf shelters beside them.",
  },
];

const config = {
  number: 5,
  title: "Jermaine",
  video: "/novels/a-family-of-mortals/chapter-5/hero.mp4",
  poster: "/novels/a-family-of-mortals/chapter-5/meet-priya-and-sonam.png",
  invitation: "The Shah twins arrive with the missing calf—and a secret sharp enough to divide the family.",
  scenes: [
    { key: "marok", start: 0, label: "Above the Storm", invitation: "Marok revels while Jermaine discovers paradise has teeth." },
    { key: "sisters", start: 3, label: "Priya and Sonam", invitation: "The Shah twins emerge from the banyan trees with Chotu between them." },
    { key: "family", start: 14, label: "The Shah Siblings", invitation: "Old rivalries turn a rescue into a battlefield." },
    { key: "secret", start: 22, label: "Lust and Grief", invitation: "Sonam reaches for a secret Rashid is not ready to surrender." },
    { key: "revelation", start: 29, label: "What Would Mom Think?", invitation: "A family cruelty becomes a public threat beneath the gathering storm." },
  ],
  relicTitle: "A Secret Is Not a Weapon",
  relicQuote: "“That’s enough!”",
  relicMeaning: "Priya draws the line Sonam refuses to see: intimacy does not become less sacred because someone discovers it.",
  focusKind: "Mortal",
  focusName: "Jermaine",
  focusDescription: "Rashid's closest friend, caught between loyalty to him and feelings for the sister who knows how to wound him.",
};

export default async function ChapterFivePage() {
  const cookieStore = await cookies();
  if (!hasAfomAccess(cookieStore.get(AFOM_ACCESS_COOKIE)?.value)) return null;

  return <ChapterOneExperience paragraphs={chapter.paragraphs} images={images} config={config} />;
}
