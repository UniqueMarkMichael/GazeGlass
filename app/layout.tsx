import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gaze Glass",
  description:
    "A premium fantasy author observatory for gods, spirits, mortals, and sacred stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
