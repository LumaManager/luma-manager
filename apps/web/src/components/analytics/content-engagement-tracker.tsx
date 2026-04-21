"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import {
  isGa4Enabled,
  trackQualifiedRead,
  trackScrollDepth
} from "@/lib/analytics/gtag";

type ContentKind = "article" | "comparison";

const scrollDepthThresholds = [25, 50, 75, 90] as const;

const qualifiedReadRules: Record<
  ContentKind,
  {
    depthPercent: number;
    seconds: number;
  }
> = {
  article: {
    depthPercent: 60,
    seconds: 45
  },
  comparison: {
    depthPercent: 50,
    seconds: 30
  }
};

export function ContentEngagementTracker({
  contentKind
}: {
  contentKind: ContentKind;
}) {
  const pathname = usePathname();
  const maxScrollDepthRef = useRef(0);
  const emittedThresholdsRef = useRef<Set<number>>(new Set());
  const qualifiedReadTrackedRef = useRef(false);
  const activeStartedAtRef = useRef<number | null>(null);
  const activeElapsedMsRef = useRef(0);

  useEffect(() => {
    if (!isGa4Enabled()) {
      return;
    }

    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    maxScrollDepthRef.current = 0;
    emittedThresholdsRef.current = new Set();
    qualifiedReadTrackedRef.current = false;
    activeStartedAtRef.current = null;
    activeElapsedMsRef.current = 0;

    const rule = qualifiedReadRules[contentKind];
    const contentPath = pathname ?? window.location.pathname;

    const getEngagedMs = () => {
      const activeElapsed = activeElapsedMsRef.current;
      const activeTime =
        activeStartedAtRef.current === null ? 0 : Date.now() - activeStartedAtRef.current;

      return activeElapsed + activeTime;
    };

    const getScrollDepthPercent = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = scrollHeight - viewportHeight;

      if (maxScroll <= 0) {
        return 100;
      }

      const depth = Math.min(
        100,
        Math.max(0, ((window.scrollY + viewportHeight) / scrollHeight) * 100)
      );

      return Math.round(depth);
    };

    const pauseEngagement = () => {
      if (activeStartedAtRef.current === null) {
        return;
      }

      activeElapsedMsRef.current += Date.now() - activeStartedAtRef.current;
      activeStartedAtRef.current = null;
    };

    const resumeEngagement = () => {
      if (activeStartedAtRef.current !== null) {
        return;
      }

      if (document.visibilityState !== "visible") {
        return;
      }

      activeStartedAtRef.current = Date.now();
    };

    const evaluateContentEngagement = () => {
      const scrollDepthPercent = getScrollDepthPercent();

      if (scrollDepthPercent > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = scrollDepthPercent;
      }

      for (const thresholdPercent of scrollDepthThresholds) {
        if (
          maxScrollDepthRef.current >= thresholdPercent &&
          !emittedThresholdsRef.current.has(thresholdPercent)
        ) {
          emittedThresholdsRef.current.add(thresholdPercent);
          trackScrollDepth({
            contentKind,
            contentPath,
            maxScrollDepthPercent: maxScrollDepthRef.current,
            scrollDepthPercent: thresholdPercent,
            thresholdPercent
          });
        }
      }

      const engagedSeconds = Math.floor(getEngagedMs() / 1000);

      if (
        !qualifiedReadTrackedRef.current &&
        maxScrollDepthRef.current >= rule.depthPercent &&
        engagedSeconds >= rule.seconds
      ) {
        qualifiedReadTrackedRef.current = true;
        trackQualifiedRead({
          contentKind,
          contentPath,
          engagedSeconds,
          maxScrollDepthPercent: maxScrollDepthRef.current,
          qualifiedDepthPercent: rule.depthPercent,
          qualifiedSeconds: rule.seconds
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        pauseEngagement();
        return;
      }

      resumeEngagement();
      evaluateContentEngagement();
    };

    resumeEngagement();
    evaluateContentEngagement();

    window.addEventListener("scroll", evaluateContentEngagement, { passive: true });
    window.addEventListener("resize", evaluateContentEngagement);
    window.addEventListener("focus", resumeEngagement);
    window.addEventListener("blur", pauseEngagement);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const heartbeat = window.setInterval(evaluateContentEngagement, 1000);

    return () => {
      pauseEngagement();
      window.removeEventListener("scroll", evaluateContentEngagement);
      window.removeEventListener("resize", evaluateContentEngagement);
      window.removeEventListener("focus", resumeEngagement);
      window.removeEventListener("blur", pauseEngagement);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(heartbeat);
    };
  }, [contentKind, pathname]);

  return null;
}
