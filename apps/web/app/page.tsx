import type { WaitlistSummary } from "@terapia/contracts";
import { StructuredData } from "@/components/shared/structured-data";
import { LandingPage } from "@/components/marketing/landing-page";
import { apiFetch } from "@/lib/api/client";
import {
  buildOrganizationStructuredData,
  buildSoftwareApplicationStructuredData
} from "@/lib/marketing/structured-data";

const fallbackSummary: WaitlistSummary = {
  totalEntries: 0,
  therapistEntries: 0,
  clinicEntries: 0,
  topPainLabel: "Primeiros sinais de demanda ainda em formação",
  updatedAtLabel: "Sem inscrições ainda"
};

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{
    utm_campaign?: string;
    utm_content?: string;
    utm_medium?: string;
    utm_source?: string;
    utm_term?: string;
  }>;
}) {
  const params = await searchParams;
  const summary = await apiFetch<WaitlistSummary>("/v1/marketing/waitlist/summary").catch(
    () => fallbackSummary
  );
  const structuredData = [
    buildOrganizationStructuredData(),
    buildSoftwareApplicationStructuredData({
      description:
        "Software para psicologos autonomos no Brasil com agenda, prontuario, documentos, cobranca e fluxo de pos-sessao no mesmo lugar.",
      path: "/"
    })
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <LandingPage
        summary={summary}
        utmCampaign={params.utm_campaign}
        utmContent={params.utm_content}
        utmMedium={params.utm_medium}
        utmSource={params.utm_source}
        utmTerm={params.utm_term}
      />
    </>
  );
}
