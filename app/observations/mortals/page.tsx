import type { Metadata } from "next";
import { RegionPage } from "../RegionPage";

export const metadata: Metadata = {
  title: "Mortal Observations",
  description:
    "Enter the Mirror and read Gaze Glass fantasy short stories about mortal prayers, choices, blessings, and lives changed by divine attention.",
  alternates: {
    canonical: "/observations/mortals",
  },
};

export default function MortalObservationsPage() {
  return <RegionPage region="mortals" />;
}
