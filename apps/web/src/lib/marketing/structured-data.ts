import { buildAbsoluteUrl } from "@/lib/marketing/seo-config";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type SoftwareApplicationOptions = {
  description: string;
  name?: string;
  offers?: Array<{
    name: string;
    price?: number;
    priceCurrency?: string;
    url?: string;
  }>;
  path: string;
};

const organizationName = "Luma Manager";

export function buildOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organizationName,
    url: buildAbsoluteUrl("/"),
    logo: buildAbsoluteUrl("/icon.svg"),
    sameAs: []
  };
}

export function buildSoftwareApplicationStructuredData({
  description,
  name = organizationName,
  offers = [],
  path
}: SoftwareApplicationOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    applicationCategory: "BusinessApplication",
    description,
    name,
    offers:
      offers.length > 0
        ? offers.map((offer) => ({
            "@type": "Offer",
            name: offer.name,
            price: offer.price,
            priceCurrency: offer.priceCurrency ?? "BRL",
            url: buildAbsoluteUrl(offer.url ?? path)
          }))
        : undefined,
    operatingSystem: "Web",
    url: buildAbsoluteUrl(path)
  };
}

export function buildBreadcrumbStructuredData(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: buildAbsoluteUrl(item.path),
      name: item.name,
      position: index + 1
    }))
  };
}

export function buildArticleStructuredData({
  description,
  headline,
  path
}: {
  description: string;
  headline: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    author: {
      "@type": "Organization",
      name: organizationName
    },
    description,
    headline,
    mainEntityOfPage: buildAbsoluteUrl(path),
    publisher: {
      "@type": "Organization",
      logo: {
        "@type": "ImageObject",
        url: buildAbsoluteUrl("/icon.svg")
      },
      name: organizationName
    },
    url: buildAbsoluteUrl(path)
  };
}
