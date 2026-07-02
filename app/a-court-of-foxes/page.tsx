import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A Court of Foxes | Interactive Gaze Glass Reader",
  description:
    "Begin A Court of Foxes, a branching romantasy chronicle set inside the Gaze Glass story world.",
  alternates: {
    canonical: "/a-court-of-foxes",
  },
  openGraph: {
    title: "A Court of Foxes | Gaze Glass",
    description:
      "A candlelit, branching romantasy reader where fox spirits, divine courts, and sacred choices braid into consequence.",
    url: "/a-court-of-foxes",
    images: [
      {
        url: "/a-court-of-foxes/assets/cover.png",
        width: 1536,
        height: 1024,
        alt: "A Court of Foxes cover art",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "A Court of Foxes | Gaze Glass",
    description:
      "A branching romantasy chronicle set inside the Gaze Glass story world.",
    images: ["/a-court-of-foxes/assets/cover.png"],
  },
};

export default function CourtOfFoxesPage() {
  return (
    <main className="court-of-foxes-shell" aria-label="A Court of Foxes interactive reader">
      <a className="court-of-foxes-home" href="/" aria-label="Return to Gaze Glass home">
        Gaze Glass
      </a>
      <iframe
        className="court-of-foxes-frame"
        src="/a-court-of-foxes/index.html"
        title="A Court of Foxes interactive reader"
        allow="autoplay"
      />
    </main>
  );
}
