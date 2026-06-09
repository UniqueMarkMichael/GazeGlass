import type { Metadata } from "next";
import { JsonLd } from "./components/JsonLd";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gazeglass.com"),
  applicationName: "Gaze Glass",
  title: {
    default: "Gaze Glass | Fantasy Stories of Gods, Spirits, and Mortals",
    template: "%s | Gaze Glass",
  },
  description:
    "Peer through Gaze Glass, a cinematic fantasy story world where gods, fox spirits, and mortals leave sacred stories behind.",
  keywords: [
    "Gaze Glass",
    "fantasy author",
    "fantasy stories",
    "fantasy novel",
    "mythic fantasy",
    "gods and mortals fantasy",
    "divine fantasy characters",
    "fantasy worldbuilding",
    "TikTok fantasy stories",
  ],
  authors: [{ name: "Gaze Glass", url: "https://www.gazeglass.com" }],
  creator: "Gaze Glass",
  publisher: "Gaze Glass",
  category: "Fantasy Fiction",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/brand/gaze-glass-mark.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.gazeglass.com",
    siteName: "Gaze Glass",
    title: "Gaze Glass | Fantasy Stories of Gods, Spirits, and Mortals",
    description:
      "A luxury fantasy observatory where readers witness gods, spirits, mortals, and the sacred stories they leave behind.",
    images: [
      {
        url: "/og/gaze-glass.png",
        width: 1672,
        height: 941,
        alt: "A sacred golden mirror opening into the fantasy world of Gaze Glass",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaze Glass | Fantasy Stories of Gods, Spirits, and Mortals",
    description:
      "Peer through the glass into a mythic fantasy world of gods, spirits, mortal blessings, and sacred consequences.",
    images: ["/og/gaze-glass.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const websiteData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.gazeglass.com/#website",
  name: "Gaze Glass",
  url: "https://www.gazeglass.com",
  description:
    "A fantasy story world where readers witness gods, spirits, mortals, blessings, and sacred consequences.",
  genre: ["Fantasy", "Mythic Fantasy", "Speculative Fiction"],
  inLanguage: "en-US",
  publisher: {
    "@type": "Organization",
    "@id": "https://www.gazeglass.com/#publisher",
    name: "Gaze Glass",
    url: "https://www.gazeglass.com",
    email: "behold@gazeglass.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.gazeglass.com/brand/gaze-glass-mark.png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={websiteData} />
        {children}
      </body>
    </html>
  );
}
