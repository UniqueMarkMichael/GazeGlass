import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/press", // TODO_MARK_PRESS_SLUG
    },
    sitemap: "https://www.gazeglass.com/sitemap.xml",
    host: "https://www.gazeglass.com",
  };
}
