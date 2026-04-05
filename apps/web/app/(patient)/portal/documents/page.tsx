import type { PortalDocumentsResponse } from "@terapia/contracts";

import { PortalDocumentsPage } from "@/components/portal/portal-documents-page";
import { portalFetch } from "@/lib/portal/api";
import { getRequiredPortalSessionToken } from "@/lib/portal/session";

export default async function PortalDocumentsRoute() {
  const portalToken = await getRequiredPortalSessionToken();
  const data = await portalFetch<PortalDocumentsResponse>("/v1/portal/documents", portalToken);

  return <PortalDocumentsPage data={data} />;
}
