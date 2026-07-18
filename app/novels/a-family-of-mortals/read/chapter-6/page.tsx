import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AFOM_ACCESS_COOKIE, hasAfomAccess } from "../../access";
import { ChapterOneExperience } from "../chapter-1/ChapterOneExperience";
import chapter from "./chapter-six.json";

export const metadata: Metadata = {
  title: "Chapter 6: Priya — A Family of Mortals",
  description: "Witness Chapter 6 of A Family of Mortals by Gaze Glass.",
  robots: { index: false, follow: false, nocache: true },
};

const images = [
  {
    after: 8,
    src: "/novels/a-family-of-mortals/chapter-6/priya-stands-between-them.png",
    alt: "Priya stands between Rashid and Sonam beneath a violet lightning storm, shielding her brother as the sisters face one another.",
  },
  {
    after: 86,
    src: "/novels/a-family-of-mortals/chapter-6/priya-crushes-mosquito.png",
    alt: "Priya plucks a mosquito from above Rashid's nose and crushes it between her fingers beneath the full moon as he recoils in surprise.",
  },
  {
    after: 116,
    src: "/novels/a-family-of-mortals/chapter-6/priya-embraces-rashid.png",
    alt: "Priya embraces a tearful Rashid beneath the full moon after assuring him that he is worthy of a love this great.",
    portrait: true,
  },
];

const config = {
  number: 6,
  title: "Priya",
  video: "/novels/a-family-of-mortals/chapter-6/hero.mp4",
  poster: "/novels/a-family-of-mortals/chapter-6/priya-stands-between-them.png",
  invitation: "Priya draws a line between protection and control—and refuses to let Rashid face cruelty alone.",
  scenes: [
    { key: "witness", start: 0, label: "Marok Watches", invitation: "The spirit sees a family fracture and imagines his master's delight." },
    { key: "boundary", start: 7, label: "How Dare You", invitation: "Priya places herself between Rashid and the sister wielding his secret." },
    { key: "collision", start: 10, label: "The Sisters Collide", invitation: "Protection turns physical beneath the approaching storm." },
    { key: "loyalty", start: 17, label: "Always My Best Friend", invitation: "Jermaine gives Rashid the answer fear would not let him ask for." },
    { key: "consequence", start: 24, label: "Consequences", invitation: "Priya makes Sonam feel the pain she chose to inflict." },
    { key: "aftermath", start: 47, label: "How Can I Help?", invitation: "Away from the fight, Priya offers Rashid presence instead of answers." },
    { key: "elijah", start: 59, label: "Elijah", invitation: "Rashid names the feeling that changed what he understood about himself." },
    { key: "truth", start: 108, label: "Worthy of Love", invitation: "A moonlit confession becomes a promise between brother and sister." },
  ],
  relicTitle: "Protection Must Leave Room to Breathe",
  relicQuote: "“I know you can, but I will always protect you.”",
  relicMeaning: "Priya's love is fierce enough to fight, but Rashid reminds her that love must also trust him to stand for himself.",
  focusKind: "Mortal",
  focusName: "Priya Shah",
  focusDescription: "The eldest Shah daughter, whose empathic gift turns another person's pain into something she can neither ignore nor forgive.",
};

export default async function ChapterSixPage() {
  const cookieStore = await cookies();
  if (!hasAfomAccess(cookieStore.get(AFOM_ACCESS_COOKIE)?.value)) return null;

  return <ChapterOneExperience paragraphs={chapter.paragraphs} images={images} config={config} />;
}
