import type { DocumentDetail } from "@terapia/contracts";

import { DocumentDetailPageView } from "@/components/documents/document-detail-page";
import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export default async function DocumentDetailPage({
  params
}: {
  params: Promise<{ documentId: string }>;
}) {
  const token = await getRequiredSessionToken();
  const { documentId } = await params;
  const detail = await apiFetch<DocumentDetail>(`/v1/documents/${documentId}`, {
    token
  });

  return <DocumentDetailPageView initialData={detail} />;
}
