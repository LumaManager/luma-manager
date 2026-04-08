import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app/", "/portal/", "/internal/"]
    },
    sitemap: "https://lumamanager.com.br/sitemap.xml"
  };
}
