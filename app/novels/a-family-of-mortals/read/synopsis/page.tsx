import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AFOM_ACCESS_COOKIE, hasAfomAccess } from "../../access";
import { PreludeExperience } from "../PreludeExperience";
import synopsis from "./synopsis.json";

export const metadata: Metadata = {
  title: "Synopsis — A Family of Mortals",
  description: "The synopsis of A Family of Mortals by Gaze Glass.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function SynopsisPage() {
  const cookieStore = await cookies();
  if (!hasAfomAccess(cookieStore.get(AFOM_ACCESS_COOKIE)?.value)) return null;

  return (
    <PreludeExperience
      title="Synopsis"
      sectionLabel="The Sealed Account"
      invitation="Meet the family chosen to judge whether humanity deserves to survive."
      paragraphs={synopsis.paragraphs}
      poster="/novels/a-family-of-mortals/hero.png"
      nextHref="/novels/a-family-of-mortals/read/prologue"
      nextLabel="Enter the Prologue"
    />
  );
}
