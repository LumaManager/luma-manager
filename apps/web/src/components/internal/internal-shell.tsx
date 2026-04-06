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
      <header className="border-b border-[rgba(255,255,255,0.08)] bg-[rgba(10,14,18,0.84)] px-8 py-5 backdrop-blur">
        <div className="flex items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <Badge tone="warning">Área interna restrita</Badge>
              <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
                {bootstrap.internalUserProfile.environmentLabel}
              </Badge>
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">Luma Manager · Ops</h1>
            <p className="mt-2 text-sm text-[rgba(255,255,255,0.72)]">
              {bootstrap.internalSecurityStatus}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge tone="neutral" className="bg-[rgba(255,255,255,0.12)] text-white">
              {bootstrap.internalUserProfile.roleLabel}
            </Badge>
            <Badge tone="warning">{bootstrap.internalUserProfile.sessionSecurityLabel}</Badge>
            <Button asChild variant="secondary" className="border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)] text-white hover:bg-[rgba(255,255,255,0.12)]">
              <Link href="/app/dashboard">Voltar ao web do terapeuta</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-89px)] grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-[rgba(255,255,255,0.08)] bg-[rgba(12,16,20,0.72)] px-5 py-6">
          <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
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

          <nav className="mt-5 space-y-2">
            {bootstrap.navigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
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

        <main className="min-w-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] px-8 py-8">
          <div className="mb-6 flex items-center justify-between gap-4 overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_26px_60px_rgba(0,0,0,0.18)]">
            <div>
              <p className="text-sm font-semibold text-white">{bootstrap.banner.title}</p>
              <p className="mt-2 text-sm text-[rgba(255,255,255,0.68)]">
                {bootstrap.banner.description}
              </p>
            </div>
            <Button asChild variant="secondary" className="border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.14)]">
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
