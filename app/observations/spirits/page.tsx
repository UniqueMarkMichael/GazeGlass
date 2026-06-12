import type { Metadata } from "next";
import { RegionPage } from "../RegionPage";

export const metadata: Metadata = {
  title: "Spirit Observations",
  description:
    "Enter the Stained Glass and read Gaze Glass fantasy observations about fox spirits, memory, devotion, and those who sit beside power.",
  alternates: {
    canonical: "/observations/spirits",
  },
};

export default function SpiritObservationsPage() {
  return <RegionPage region="spirits" />;
}
