import type { WaitlistSummary } from "@terapia/contracts";
import { LandingPage } from "@/components/marketing/landing-page";
import { apiFetch } from "@/lib/api/client";

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

  return (
    <LandingPage
      summary={summary}
      utmCampaign={params.utm_campaign}
      utmContent={params.utm_content}
      utmMedium={params.utm_medium}
      utmSource={params.utm_source}
      utmTerm={params.utm_term}
    />
  );
}
