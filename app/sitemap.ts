import type { MetadataRoute } from "next";

const baseUrl = "https://www.gazeglass.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-09");

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/the-gods`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/the-spirits`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/the-mortals`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/the-seer`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
