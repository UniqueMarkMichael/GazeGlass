import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AFOM_ACCESS_COOKIE, hasAfomAccess } from "../../access";
import { PreludeExperience } from "../PreludeExperience";
import prologue from "./prologue.json";

export const metadata: Metadata = {
  title: "Prologue — A Family of Mortals",
  description: "The prologue of A Family of Mortals by Gaze Glass.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function ProloguePage() {
  const cookieStore = await cookies();
  if (!hasAfomAccess(cookieStore.get(AFOM_ACCESS_COOKIE)?.value)) return null;

  return (
    <PreludeExperience
      title="Prologue"
      sectionLabel="A Letter from Wisdom"
      invitation="Before mortals inherit divine power, the God of Wisdom reveals how the Judgment began."
      paragraphs={prologue.paragraphs}
      poster="/novels/a-family-of-mortals/chapter-1/marok-floating-over-foxnip.png"
      nextHref="/novels/a-family-of-mortals/read/chapter-1"
      nextLabel="Enter Chapter One"
    />
  );
}
