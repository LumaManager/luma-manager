import type { PortalProfile } from "@terapia/contracts";
import { Badge } from "@terapia/ui";

import { PortalHero, PortalPanel } from "./portal-surface";

export function PortalProfilePage({ profile }: { profile: PortalProfile }) {
  return (
    <div className="space-y-6">
      <PortalHero
        badges={<Badge tone="info">Perfil</Badge>}
        description="Dados mínimos do portal e preferências operacionais do atendimento."
        stats={[
          {
            detail: "Canal principal de contato.",
            label: "Comunicação",
            tone: "info",
            value: profile.communicationPreferenceLabel
          },
          {
            detail: "Contato de apoio e tomada de decisão.",
            label: "Responsável",
            tone: "neutral",
            value: profile.legalGuardianLabel
          }
        ]}
        title={profile.patient.fullName}
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <PortalPanel description="Informações usadas para comunicação e suporte do atendimento." title="Dados de contato">
          <div className="space-y-3 text-sm leading-7 text-[var(--color-text-muted)]">
            <p>{profile.patient.email}</p>
            <p>{profile.patient.phone}</p>
            <p>{profile.communicationPreferenceLabel}</p>
            <p>{profile.emergencyContactLabel}</p>
            <p>{profile.legalGuardianLabel}</p>
          </div>
        </PortalPanel>

        <PortalPanel description="Combinados visíveis para manter o uso do portal previsível e claro." title="Diretrizes do portal">
            {profile.careGuidelines.map((item) => (
              <div key={item} className="rounded-3xl border border-[rgba(22,42,56,0.08)] bg-[rgba(255,249,242,0.88)] p-4 text-sm leading-6 text-[var(--color-text-muted)]">
                {item}
              </div>
            ))}
        </PortalPanel>
      </section>
    </div>
  );
}
