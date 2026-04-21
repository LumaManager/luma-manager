import {
  getMarketingPageContext,
  normalizeMarketingPath,
  type ContentKind
} from "@/lib/analytics/marketing-page-context";

type GtagFunction = (...args: unknown[]) => void;

type GtagEventParams = Record<string, string | number | boolean | null | undefined>;

type WindowWithGtag = Window & {
  dataLayer?: unknown[];
  gtag?: GtagFunction;
};

const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim() ?? "";

function serializeInlineValue(value: string) {
  return JSON.stringify(value);
}

function getWindowWithGtag() {
  if (typeof window === "undefined") {
    return null;
  }

  return window as WindowWithGtag;
}

function sanitizeEventParams(params: GtagEventParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
  ) as Record<string, string | number | boolean>;
}

export function getGa4MeasurementId() {
  return measurementId;
}

export function isGa4Enabled() {
  return measurementId.length > 0;
}

export function getGtagScriptUrl() {
  return isGa4Enabled()
    ? `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
    : null;
}

export function getGtagInitScript() {
  if (!isGa4Enabled()) {
    return "";
  }

  return [
    "window.dataLayer = window.dataLayer || [];",
    "function gtag(){window.dataLayer.push(arguments);}",
    "window.gtag = window.gtag || gtag;",
    `gtag("js", new Date());`,
    `gtag("config", ${serializeInlineValue(measurementId)});`
  ].join("\n");
}

export function getDestinationPathFromHref(href: string) {
  try {
    const url = new URL(href, "https://lumamanager.com.br");
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return href;
  }
}

function getMarketingContextParams(path: string | null | undefined) {
  const normalizedPath = normalizeMarketingPath(path);
  const context = getMarketingPageContext(normalizedPath);

  return {
    content_kind: context?.contentKind,
    funnel_stage: context?.funnelStage,
    page_cluster: context?.pageCluster,
    page_type: context?.pageType,
    primary_intent: context?.primaryIntent,
    source_path: normalizedPath ?? undefined
  };
}

export function trackGtagEvent(eventName: string, params: GtagEventParams = {}) {
  const win = getWindowWithGtag();

  if (!win?.gtag) {
    return false;
  }

  const sanitizedParams = sanitizeEventParams(params);
  win.gtag("event", eventName, sanitizedParams);
  return true;
}

export function trackGenerateLead(params: {
  leadType: string;
  sourcePath: string;
  professionalRole: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}) {
  const contextParams = getMarketingContextParams(params.sourcePath);

  return trackGtagEvent("generate_lead", {
    ...contextParams,
    lead_type: params.leadType,
    professional_role: params.professionalRole,
    utm_source: params.utmSource,
    utm_medium: params.utmMedium,
    utm_campaign: params.utmCampaign,
    utm_content: params.utmContent,
    utm_term: params.utmTerm
  });
}

export function trackCtaClick(params: {
  ctaLabel: string;
  ctaLocation: string;
  destinationPath: string;
  pageType?: string;
  sourcePath?: string;
}) {
  const contextParams = getMarketingContextParams(params.sourcePath);

  return trackGtagEvent("cta_click", {
    cta_label: params.ctaLabel,
    cta_location: params.ctaLocation,
    destination_path: params.destinationPath,
    funnel_stage: contextParams.funnel_stage,
    page_cluster: contextParams.page_cluster,
    page_type: params.pageType ?? contextParams.page_type,
    primary_intent: contextParams.primary_intent,
    source_path: contextParams.source_path
  });
}

export function trackScrollDepth(params: {
  contentKind: ContentKind;
  contentPath: string;
  maxScrollDepthPercent: number;
  scrollDepthPercent: number;
  thresholdPercent: number;
}) {
  return trackGtagEvent("scroll_depth", {
    content_kind: params.contentKind,
    content_path: params.contentPath,
    max_scroll_depth_percent: params.maxScrollDepthPercent,
    scroll_depth_percent: params.scrollDepthPercent,
    threshold_percent: params.thresholdPercent
  });
}

export function trackFormStart(params: {
  formName: string;
  formVariant?: string;
  sourcePath: string;
}) {
  const contextParams = getMarketingContextParams(params.sourcePath);

  return trackGtagEvent("form_start", {
    ...contextParams,
    form_name: params.formName,
    form_variant: params.formVariant
  });
}

export function trackMarketingPageView(params: {
  pagePath: string;
}) {
  const normalizedPath = normalizeMarketingPath(params.pagePath);
  const context = getMarketingPageContext(normalizedPath);

  if (!normalizedPath || !context) {
    return false;
  }

  return trackGtagEvent("marketing_page_view", {
    content_kind: context.contentKind,
    funnel_stage: context.funnelStage,
    page_cluster: context.pageCluster,
    page_type: context.pageType,
    primary_intent: context.primaryIntent,
    source_path: normalizedPath
  });
}

export function trackQualifiedRead(params: {
  contentKind: ContentKind;
  contentPath: string;
  engagedSeconds: number;
  maxScrollDepthPercent: number;
  qualifiedDepthPercent: number;
  qualifiedSeconds: number;
}) {
  return trackGtagEvent("qualified_read", {
    content_kind: params.contentKind,
    content_path: params.contentPath,
    engaged_seconds: params.engagedSeconds,
    max_scroll_depth_percent: params.maxScrollDepthPercent,
    qualified_depth_percent: params.qualifiedDepthPercent,
    qualified_seconds: params.qualifiedSeconds
  });
}
