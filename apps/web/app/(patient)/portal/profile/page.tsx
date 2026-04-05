import type { PortalProfile } from "@terapia/contracts";

import { PortalProfilePage } from "@/components/portal/portal-profile-page";
import { portalFetch } from "@/lib/portal/api";
import { getRequiredPortalSessionToken } from "@/lib/portal/session";

export default async function PortalProfileRoute() {
  const portalToken = await getRequiredPortalSessionToken();
  const profile = await portalFetch<PortalProfile>("/v1/portal/profile", portalToken);

  return <PortalProfilePage profile={profile} />;
}
