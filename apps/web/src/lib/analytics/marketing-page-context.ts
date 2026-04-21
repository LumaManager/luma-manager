export type ContentKind = "article" | "comparison";

export type MarketingFunnelStage = "top" | "middle" | "bottom";

export type MarketingPageCluster =
  | "home"
  | "solution"
  | "trust"
  | "pricing"
  | "demo"
  | "blog"
  | "comparison";

export type MarketingPrimaryIntent =
  | "brand_capture"
  | "software_evaluation"
  | "operational_solution"
  | "trust_validation"
  | "pricing_evaluation"
  | "demo_request"
  | "content_education"
  | "comparative_decision";

export type MarketingPageContext = {
  contentKind?: ContentKind;
  funnelStage: MarketingFunnelStage;
  pageCluster: MarketingPageCluster;
  pageType: string;
  primaryIntent: MarketingPrimaryIntent;
};

const exactPageContexts: Record<string, MarketingPageContext> = {
  "/": {
    funnelStage: "top",
    pageCluster: "home",
    pageType: "marketing_home",
    primaryIntent: "brand_capture"
  },
  "/software-para-psicologos": {
    funnelStage: "bottom",
    pageCluster: "solution",
    pageType: "solution_page",
    primaryIntent: "software_evaluation"
  },
  "/prontuario-eletronico-para-psicologos": {
    funnelStage: "middle",
    pageCluster: "solution",
    pageType: "solution_page",
    primaryIntent: "operational_solution"
  },
  "/agenda-para-psicologos": {
    funnelStage: "middle",
    pageCluster: "solution",
    pageType: "solution_page",
    primaryIntent: "operational_solution"
  },
  "/teleatendimento-para-psicologos": {
    funnelStage: "middle",
    pageCluster: "solution",
    pageType: "solution_page",
    primaryIntent: "operational_solution"
  },
  "/documentos-e-consentimentos-para-psicologos": {
    funnelStage: "middle",
    pageCluster: "solution",
    pageType: "solution_page",
    primaryIntent: "operational_solution"
  },
  "/seguranca-e-privacidade": {
    funnelStage: "bottom",
    pageCluster: "trust",
    pageType: "trust_page",
    primaryIntent: "trust_validation"
  },
  "/pricing": {
    funnelStage: "bottom",
    pageCluster: "pricing",
    pageType: "pricing_page",
    primaryIntent: "pricing_evaluation"
  },
  "/solicitar-demo": {
    funnelStage: "bottom",
    pageCluster: "demo",
    pageType: "demo_request_page",
    primaryIntent: "demo_request"
  },
  "/blog": {
    funnelStage: "top",
    pageCluster: "blog",
    pageType: "blog_hub_page",
    primaryIntent: "content_education"
  },
  "/comparar": {
    funnelStage: "middle",
    pageCluster: "comparison",
    pageType: "comparison_hub_page",
    primaryIntent: "comparative_decision"
  }
};

const prefixedPageContexts: ReadonlyArray<{
  context: MarketingPageContext;
  prefix: string;
}> = [
  {
    prefix: "/blog/",
    context: {
      contentKind: "article",
      funnelStage: "middle",
      pageCluster: "blog",
      pageType: "blog_article_page",
      primaryIntent: "content_education"
    }
  },
  {
    prefix: "/comparar/",
    context: {
      contentKind: "comparison",
      funnelStage: "bottom",
      pageCluster: "comparison",
      pageType: "comparison_page",
      primaryIntent: "comparative_decision"
    }
  }
] as const;

export function normalizeMarketingPath(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  try {
    const url = new URL(path, "https://lumamanager.com.br");
    const normalizedPathname =
      url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname;

    return normalizedPathname || "/";
  } catch {
    const pathWithoutHash = path.split("#")[0] ?? path;
    const pathWithoutQuery = pathWithoutHash.split("?")[0] ?? pathWithoutHash;
    const normalizedPathname =
      pathWithoutQuery.length > 1 ? pathWithoutQuery.replace(/\/+$/, "") : pathWithoutQuery;

    return normalizedPathname || "/";
  }
}

export function getMarketingPageContext(path: string | null | undefined) {
  const normalizedPath = normalizeMarketingPath(path);

  if (!normalizedPath) {
    return null;
  }

  const exactMatch = exactPageContexts[normalizedPath];

  if (exactMatch) {
    return exactMatch;
  }

  const prefixedMatch = prefixedPageContexts.find(({ prefix }) =>
    normalizedPath.startsWith(prefix)
  );

  return prefixedMatch?.context ?? null;
}
