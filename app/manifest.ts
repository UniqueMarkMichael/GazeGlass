import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gaze Glass",
    short_name: "Gaze Glass",
    description:
      "A fantasy story world of gods, spirits, mortals, blessings, and sacred observations.",
    start_url: "/",
    display: "standalone",
    background_color: "#1A1733",
    theme_color: "#1A1733",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
