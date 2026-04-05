import type { PortalBootstrap } from "@terapia/contracts";

import { PortalShell } from "@/components/portal/portal-shell";
import { getRequiredPortalSessionToken } from "@/lib/portal/session";
import { portalFetch } from "@/lib/portal/api";

export default async function PortalLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const portalToken = await getRequiredPortalSessionToken();
  const bootstrap = await portalFetch<PortalBootstrap>("/v1/portal/bootstrap", portalToken);

  return <PortalShell bootstrap={bootstrap}>{children}</PortalShell>;
}
