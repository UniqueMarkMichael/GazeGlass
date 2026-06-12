import type { Metadata } from "next";
import { RegionPage } from "../RegionPage";

export const metadata: Metadata = {
  title: "Gods Observations",
  description:
    "Enter the Orb and read Gaze Glass fantasy observations connected to gods, prophecy, beauty, fortune, mercy, and divine consequence.",
  alternates: {
    canonical: "/observations/gods",
  },
};

export default function GodsObservationsPage() {
  return <RegionPage region="gods" />;
}
