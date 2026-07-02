import type { MetadataRoute } from "next";
import { getObservationHref, observations } from "./observations/data";

const baseUrl = "https://www.gazeglass.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-11");

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
      url: `${baseUrl}/observations`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/a-court-of-foxes`,
      lastModified: new Date("2026-07-01"),
      changeFrequency: "weekly",
      priority: 0.92,
    },
    {
      url: `${baseUrl}/celestial-codex`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/observations/gods`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.82,
    },
    {
      url: `${baseUrl}/observations/spirits`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.82,
    },
    {
      url: `${baseUrl}/observations/mortals`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.82,
    },
    ...observations
      .filter((observation) => getObservationHref(observation) !== "/observations")
      .map((observation) => ({
        url: `${baseUrl}${getObservationHref(observation)}`,
        lastModified: new Date(observation.dateObserved),
        changeFrequency: "monthly" as const,
        priority: 0.78,
      })),
    {
      url: `${baseUrl}/the-seer`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
