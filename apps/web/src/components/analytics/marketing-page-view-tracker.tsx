"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { isGa4Enabled, trackMarketingPageView } from "@/lib/analytics/gtag";

export function MarketingPageViewTracker() {
  const pathname = usePathname();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isGa4Enabled() || !pathname || lastTrackedPathRef.current === pathname) {
      return;
    }

    lastTrackedPathRef.current = pathname;
    trackMarketingPageView({ pagePath: pathname });
  }, [pathname]);

  return null;
}
