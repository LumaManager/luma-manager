import type { MetadataRoute } from "next";

import { buildAbsoluteUrl, indexableRoutes } from "@/lib/marketing/seo-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes.map((route) => ({
    url: buildAbsoluteUrl(route.path),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));
}
