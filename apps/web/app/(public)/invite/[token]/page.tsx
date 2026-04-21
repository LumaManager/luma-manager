import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { PortalInvite } from "@terapia/contracts";

import { PortalInvitePage } from "@/components/portal/portal-invite-page";
import { apiFetch } from "@/lib/api/client";
import { getPortalSessionToken } from "@/lib/portal/session";
import { noindexMetadata } from "@/lib/marketing/seo-config";

export const metadata: Metadata = {
  ...noindexMetadata,
  title: "Convite de acesso | Luma Manager",
  description: "Convite para acesso ao portal Luma Manager."
};

export default async function InvitePage({
  params
}: {
  params: Promise<{ token: string }>;
}) {
  const portalToken = await getPortalSessionToken();

  if (portalToken) {
    redirect("/portal");
  }

  const { token } = await params;
  const invite = await apiFetch<PortalInvite>(`/v1/portal/invite/${token}`);

  return <PortalInvitePage invite={invite} />;
}
