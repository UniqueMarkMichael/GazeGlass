import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AFOM_ACCESS_COOKIE, hasAfomAccess } from "../../access";
import { ChapterOneExperience } from "../chapter-1/ChapterOneExperience";
import chapter from "./chapter-eight.json";

export const metadata: Metadata = {
  title: "Chapter 8: Sonam — A Family of Mortals",
  description: "Witness Chapter 8 of A Family of Mortals by Gaze Glass.",
  robots: { index: false, follow: false, nocache: true },
};

const config = {
  number: 8,
  title: "Sonam",
  video: "/novels/a-family-of-mortals/chapter-8/hero.mp4",
  poster: "/novels/a-family-of-mortals/hero.png",
  invitation: "In the streets of Rishikesh, Sonam tests the difference between being right, being heard, and choosing to be kind.",
  scenes: [
    { key: "city", start: 0, label: "Rishikesh", invitation: "The family enters a holy city crowded with appetite, devotion, and contradiction." },
    { key: "waste", start: 2, label: "What Mortals Leave Behind", invitation: "Sacred cows and discarded plastic expose the distance between reverence and care." },
    { key: "pot", start: 8, label: "The Clay Pot", invitation: "A drunken collision draws out a side of Sonam no one expected." },
    { key: "escape", start: 12, label: "Flight at Sunset", invitation: "The family disappears into the alleys with laughter close behind." },
    { key: "gate", start: 15, label: "The Ominous Gate", invitation: "An abandoned estate waits beyond rusted bars and overgrown grass." },
    { key: "courtyard", start: 25, label: "The Silent Courtyard", invitation: "A dry fountain, a rusted sword, and a stone witch preserve an unfinished warning." },
    { key: "serpents", start: 32, label: "The Serpent Doors", invitation: "Ancient metal promises judgment—and the renewal of the world." },
    { key: "kindness", start: 45, label: "A Heart Revealed", invitation: "Beneath Sonam's wit, Priya finds the fear that kindness may not come naturally." },
  ],
  relicTitle: "Kindness Is a Choice",
  relicQuote: "“All you have to do is be kind.”",
  relicMeaning: "Sonam cannot control every impulse, insult, or vision—but she can still decide what she does next.",
  focusKind: "Mortal",
  focusName: "Sonam Shah",
  focusDescription: "A brilliant and defensive young woman confronting the possibility that foresight matters less than the choices she makes in the present.",
};

export default async function ChapterEightPage() {
  const cookieStore = await cookies();
  if (!hasAfomAccess(cookieStore.get(AFOM_ACCESS_COOKIE)?.value)) return null;

  return <ChapterOneExperience paragraphs={chapter.paragraphs} images={[]} config={config} />;
}
