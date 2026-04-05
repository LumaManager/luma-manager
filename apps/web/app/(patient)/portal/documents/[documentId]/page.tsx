import type { PortalDocumentDetail } from "@terapia/contracts";

import { PortalDocumentDetailPage } from "@/components/portal/portal-document-detail-page";
import { portalFetch } from "@/lib/portal/api";
import { getRequiredPortalSessionToken } from "@/lib/portal/session";

export default async function PortalDocumentDetailRoute({
  params
}: {
  params: Promise<{ documentId: string }>;
}) {
  const portalToken = await getRequiredPortalSessionToken();
  const { documentId } = await params;
  const detail = await portalFetch<PortalDocumentDetail>(
    `/v1/portal/documents/${documentId}`,
    portalToken
  );

  return <PortalDocumentDetailPage detail={detail} />;
}
