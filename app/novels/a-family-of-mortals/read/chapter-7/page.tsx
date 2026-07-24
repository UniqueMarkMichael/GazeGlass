import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AFOM_ACCESS_COOKIE, hasAfomAccess } from "../../access";
import { ChapterOneExperience } from "../chapter-1/ChapterOneExperience";
import chapter from "./chapter-seven.json";

export const metadata: Metadata = {
  title: "Chapter 7: Sonam — A Family of Mortals",
  description: "Witness Chapter 7 of A Family of Mortals by Gaze Glass.",
  robots: { index: false, follow: false, nocache: true },
};

const images = [
  {
    after: 6,
    src: "/novels/a-family-of-mortals/chapter-7/sonam-encounters-leopard.png",
    alt: "Sonam looks up in alarm as a leopard watches her from a broad jungle branch at sunset.",
  },
  {
    after: 18,
    src: "/novels/a-family-of-mortals/chapter-7/sonam-rescues-leopard.png",
    alt: "Sonam struggles through the mud to pull a trapped leopard to safety while the jungle animals gather around them.",
  },
  {
    after: 28,
    src: "/novels/a-family-of-mortals/chapter-7/sonam-meets-god-of-beauty.png",
    alt: "A mud-covered Sonam recoils as the many-armed God of Beauty rises in rose-colored light while Marok watches from above.",
  },
  {
    after: 39,
    src: "/novels/a-family-of-mortals/chapter-7/sonam-activates-throat-chakra.png",
    alt: "Sonam kneels before the God of Beauty as a blue symbol illuminates her throat and shattered amethyst scatters across the temple floor.",
  },
];

const config = {
  number: 7,
  title: "Sonam",
  video: "/novels/a-family-of-mortals/chapter-7/hero.mp4",
  poster: "/novels/a-family-of-mortals/hero.png",
  invitation: "Lost in a jungle reshaped by Marok, Sonam discovers that foresight cannot save her from the desire to control.",
  scenes: [
    { key: "resentment", start: 0, label: "The Wicked Sister", invitation: "Sonam is left alone with anger—and Marok decides what it means." },
    { key: "blood", start: 2, label: "Blood for Blood", invitation: "A mosquito becomes a mirror for Sonam's private morality." },
    { key: "fork", start: 5, label: "Three Paths", invitation: "Marok bends the mountain and leaves Sonam with a choice she does not recognize." },
    { key: "leopard", start: 7, label: "The Leopard", invitation: "Foresight shows Sonam the shape of her death before it arrives." },
    { key: "quicksand", start: 15, label: "The Watery Grave", invitation: "The predator becomes prey—and Sonam cannot silence the instinct to save it." },
    { key: "passage", start: 19, label: "The Hidden Passage", invitation: "A green fox leads Sonam through dead vines and into an impossible sanctuary." },
    { key: "marok", start: 23, label: "A Jewel for the Will", invitation: "Marok offers a prize disguised as proof that none of this can be real." },
    { key: "beauty", start: 29, label: "What the Heart Desires", invitation: "The God of Beauty gives Sonam a future in which everyone finally listens." },
    { key: "voice", start: 36, label: "A Voice That Gives No Choice", invitation: "Sonam reaches into the snow before hearing the price." },
  ],
  relicTitle: "Foresight Is Not Wisdom",
  relicQuote: "“Embrace a voice that gives no choice.”",
  relicMeaning: "Sonam can see consequences before they arrive, yet the promise of control makes consequence feel like someone else's problem.",
  focusKind: "Mortal",
  focusName: "Sonam Shah",
  focusDescription: "Brilliant, wounded, and certain that being heard would make her good—until divine power offers to remove everyone else's choice.",
};

export default async function ChapterSevenPage() {
  const cookieStore = await cookies();
  if (!hasAfomAccess(cookieStore.get(AFOM_ACCESS_COOKIE)?.value)) return null;

  return <ChapterOneExperience paragraphs={chapter.paragraphs} images={images} config={config} />;
}
