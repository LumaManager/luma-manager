"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { InternalBootstrap } from "@terapia/contracts";
import { Badge, Button } from "@terapia/ui";
import { Building2, LifeBuoy, SearchCheck, Shield, Siren, UserRoundPlus, Wallet } from "lucide-react";

export function InternalShell({
  bootstrap,
  children
}: {
  bootstrap: InternalBootstrap;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#15191e_0%,#1c2329_100%)] text-white">
      <header className="border-b border-[rgba(255,255,255,0.08)] bg-[rgba(10,14,18,0.84)] px-4 py-4 backdrop-blur sm:px-8 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="warning">Área interna restrita</Badge>
              <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
                {bootstrap.internalUserProfile.environmentLabel}
              </Badge>
            </div>
            <h1 className="mt-2 text-xl font-semibold tracking-[-0.02em] sm:mt-3 sm:text-2xl">Luma Manager · Ops</h1>
            <p className="mt-1 text-sm text-[rgba(255,255,255,0.72)] sm:mt-2">
              {bootstrap.internalSecurityStatus}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
              {bootstrap.internalUserProfile.roleLabel}
            </Badge>
            <Badge tone="warning">{bootstrap.internalUserProfile.sessionSecurityLabel}</Badge>
            <Button asChild variant="secondary" className="border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)] text-white hover:bg-[rgba(255,255,255,0.12)]">
              <Link href="/app/dashboard">Voltar ao app</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:grid lg:min-h-[calc(100vh-89px)] lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-[rgba(255,255,255,0.08)] bg-[rgba(12,16,20,0.72)] px-4 py-4 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
          <div className="hidden rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5 lg:block">
            <p className="text-sm font-semibold">{bootstrap.internalUserProfile.fullName}</p>
            <p className="mt-1 text-sm text-[rgba(255,255,255,0.62)]">
              {bootstrap.internalUserProfile.email}
            </p>
            <div className="mt-4 rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[rgba(255,255,255,0.5)]">
                Sessão atual
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {bootstrap.internalUserProfile.sessionSecurityLabel}
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-1 lg:mt-5 lg:flex-col lg:space-y-2 lg:gap-0">
            {bootstrap.navigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition lg:gap-3 lg:px-4 lg:py-3 ${
                    active
                      ? "bg-[rgba(255,255,255,0.12)] text-white"
                      : "text-[rgba(255,255,255,0.72)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
                  }`}
                >
                  <NavIcon navKey={item.key} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="mb-5 flex flex-col gap-3 overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_26px_60px_rgba(0,0,0,0.18)] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-[28px] sm:p-6 lg:mb-6">
            <div>
              <p className="text-sm font-semibold text-white">{bootstrap.banner.title}</p>
              <p className="mt-2 text-sm text-[rgba(255,255,255,0.68)]">
                {bootstrap.banner.description}
              </p>
            </div>
            <Button asChild variant="secondary" className="w-fit border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.14)]">
              <Link href={bootstrap.banner.href}>{bootstrap.banner.ctaLabel}</Link>
            </Button>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

function NavIcon({ navKey }: { navKey: InternalBootstrap["navigation"][number]["key"] }) {
  if (navKey === "overview") return <SearchCheck className="h-4 w-4" />;
  if (navKey === "waitlist") return <UserRoundPlus className="h-4 w-4" />;
  if (navKey === "tenants") return <Building2 className="h-4 w-4" />;
  if (navKey === "support") return <LifeBuoy className="h-4 w-4" />;
  if (navKey === "billing") return <Wallet className="h-4 w-4" />;
  if (navKey === "audit") return <Shield className="h-4 w-4" />;
  return <Siren className="h-4 w-4" />;
}
