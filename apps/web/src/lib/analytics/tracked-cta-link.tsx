"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { getDestinationPathFromHref, trackCtaClick } from "@/lib/analytics/gtag";

export function TrackedCtaLink({
  children,
  ctaLabel,
  ctaLocation,
  className,
  href,
  pageType
}: {
  children: ReactNode;
  ctaLabel: string;
  ctaLocation: string;
  className?: string;
  href: string;
  pageType?: string;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        trackCtaClick({
          ctaLabel,
          ctaLocation,
          destinationPath: getDestinationPathFromHref(href),
          pageType,
          sourcePath: pathname ?? undefined
        });
      }}
    >
      {children}
    </Link>
  );
}
