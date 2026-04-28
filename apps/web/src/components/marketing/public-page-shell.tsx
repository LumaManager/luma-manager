import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@terapia/ui";
import { TrackedCtaLink } from "@/lib/analytics/tracked-cta-link";

const shellButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(255,255,255,0.18)] px-4 text-sm font-medium text-white transition hover:bg-[rgba(255,255,255,0.08)]";

const shellPrimaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-[18px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(198,122,69,0.24)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]";

export function PublicPageShell({
  actions,
  children,
  className,
  primaryHref = "/#waitlist",
  secondaryHref = "/seguranca-e-privacidade"
}: {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  primaryHref?: string;
  secondaryHref?: string;
}) {
  const pageType = "public_marketing";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(198,122,69,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(15,76,92,0.16),transparent_30%),linear-gradient(180deg,#f8f3e8_0%,#f4ede2_100%)] px-2 py-5 lg:px-3 lg:py-6">
      <div className="mx-auto w-full max-w-[1900px]">
        <section
          className={cn(
            "relative overflow-hidden rounded-[40px] border border-[rgba(15,76,92,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 pb-10 text-white shadow-[0_30px_80px_rgba(15,76,92,0.24)] lg:p-10 lg:pb-14",
            className
          )}
        >
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_28%,rgba(255,255,255,0.04)_46%,rgba(255,255,255,0)_74%)] opacity-90" />
          <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[rgba(255,255,255,0.08)] blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[rgba(198,122,69,0.16)] blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link href="/" className="flex items-center gap-2.5">
                <Image src="/icon.svg" alt="Luma" width={26} height={26} className="rounded-lg" />
                <span className="text-base font-semibold tracking-[-0.03em] text-white">Luma</span>
              </Link>

              <div className="flex flex-wrap items-center gap-3">
                <TrackedCtaLink
                  href={secondaryHref}
                  className={shellButtonClassName}
                  ctaLabel="Segurança e privacidade"
                  ctaLocation="public_shell_header_secondary"
                  pageType={pageType}
                >
                  Segurança e privacidade
                </TrackedCtaLink>
                <TrackedCtaLink
                  href={primaryHref}
                  className={shellPrimaryButtonClassName}
                  ctaLabel="Entrar na waitlist"
                  ctaLocation="public_shell_header_primary"
                  pageType={pageType}
                >
                  Entrar na waitlist
                </TrackedCtaLink>
              </div>
            </div>

            <div className="mt-8">{children}</div>

            {actions ? <div className="mt-8">{actions}</div> : null}
          </div>
        </section>
      </div>
    </main>
  );
}

export function PublicSectionCard({
  children,
  className,
  description,
  eyebrow,
  title
}: {
  children: ReactNode;
  className?: string;
  description?: string;
  eyebrow?: string;
  title: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[32px] border border-[rgba(15,76,92,0.12)] bg-[rgba(255,253,248,0.96)] p-6 text-[var(--color-text)] shadow-[0_18px_46px_rgba(15,76,92,0.08)]",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text)]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </div>
  );
}
