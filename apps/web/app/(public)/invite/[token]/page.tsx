import { redirect } from "next/navigation";
import type { PortalInvite } from "@terapia/contracts";

import { PortalInvitePage } from "@/components/portal/portal-invite-page";
import { apiFetch } from "@/lib/api/client";
import { getPortalSessionToken } from "@/lib/portal/session";

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
