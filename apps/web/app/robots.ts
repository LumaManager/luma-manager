import type { MetadataRoute } from "next";

import { buildAbsoluteUrl, privateRoutePrefixes } from "@/lib/marketing/seo-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...privateRoutePrefixes, "/api/"]
    },
    sitemap: buildAbsoluteUrl("/sitemap.xml")
  };
}
