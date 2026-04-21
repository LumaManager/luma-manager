import { ArrowRight } from "lucide-react";

import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";

export function PublicArticleCard({
  ctaLabel = "Ler artigo",
  ctaLocation,
  description,
  href,
  readingTime,
  tag,
  title
}: {
  ctaLabel?: string;
  ctaLocation: string;
  description: string;
  href: string;
  readingTime: string;
  tag: string;
  title: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-[28px] border border-[rgba(15,76,92,0.12)] bg-[rgba(255,253,248,0.96)] p-6 shadow-[0_18px_46px_rgba(15,76,92,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_56px_rgba(15,76,92,0.12)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
        {tag}
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-[rgba(15,76,92,0.08)] pt-4">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          {readingTime}
        </span>
        <TrackedCtaLink
          ctaLabel={ctaLabel}
          ctaLocation={ctaLocation}
          href={href}
          pageType="blog_hub_page"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] transition hover:text-[color-mix(in_srgb,var(--color-primary)_82%,black)]"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </TrackedCtaLink>
      </div>
    </article>
  );
}
