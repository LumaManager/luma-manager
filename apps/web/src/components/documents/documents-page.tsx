"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import type {
  DocumentCreateRequest,
  DocumentCreateResponse,
  DocumentListItem,
  DocumentsListResponse
} from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader, cn } from "@terapia/ui";
import {
  ArrowRight,
  FilePlus2,
  Mail,
  Search,
  Send,
  ShieldAlert,
  SlidersHorizontal,
  X
} from "lucide-react";

import { OperationalHero, ToolbarPanel } from "@/components/shared/operational-surface";

type DocumentsPageProps = {
  initialData: DocumentsListResponse;
};

export function DocumentsPageView({ initialData }: DocumentsPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState(initialData.items);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [query, setQuery] = useState(initialData.filters.search);
  const [patientId, setPatientId] = useState(initialData.filters.patientId);
  const [documentType, setDocumentType] = useState(initialData.filters.documentType);
  const [signatureStatus, setSignatureStatus] = useState(initialData.filters.signatureStatus);
  const [consentStatus, setConsentStatus] = useState(initialData.filters.consentStatus);
  const [criticality, setCriticality] = useState(initialData.filters.criticality);
  const [onlyCritical, setOnlyCritical] = useState(initialData.filters.onlyCritical);
  const [thisWeekOnly, setThisWeekOnly] = useState(initialData.filters.thisWeekOnly);
  const [onlyRevoked, setOnlyRevoked] = useState(initialData.filters.onlyRevoked);
  const [isMutating, startMutating] = useTransition();
  const [generationForm, setGenerationForm] = useState<DocumentCreateRequest>({
    patientId: initialData.patientOptions[0]?.value ?? "",
    documentType: initialData.templateOptions[0]?.documentType ?? "lgpd",
    templateVersion: initialData.templateOptions[0]?.defaultVersion ?? "v1.0",
    deliveryChannel: "email"
  });

  const selectedTemplate = useMemo(
    () =>
      initialData.templateOptions.find((option) => option.documentType === generationForm.documentType) ??
      initialData.templateOptions[0],
    [generationForm.documentType, initialData.templateOptions]
  );

  const activeChips = useMemo(() => {
    const chips: string[] = [];
    if (patientId.length > 0) {
      const patient = initialData.patientOptions.find((option) => option.value === patientId);
      if (patient) chips.push(`Paciente: ${patient.label}`);
    }
    if (documentType !== "all") chips.push(`Tipo: ${labelForType(documentType)}`);
    if (signatureStatus !== "all") chips.push(`Assinatura: ${labelForSignature(signatureStatus)}`);
    if (consentStatus !== "all") chips.push(`Consentimento: ${labelForConsent(consentStatus)}`);
    if (criticality !== "all") chips.push(`Prioridade: ${labelForCriticality(criticality)}`);
    if (onlyCritical) chips.push("Apenas críticos");
    if (thisWeekOnly) chips.push("Apenas esta semana");
    if (onlyRevoked) chips.push("Apenas revogados");
    return chips;
  }, [
    consentStatus,
    criticality,
    documentType,
    initialData.patientOptions,
    onlyCritical,
    onlyRevoked,
    patientId,
    signatureStatus,
    thisWeekOnly
  ]);

  useEffect(() => {
    if (!selectedTemplate) return;
    if (!selectedTemplate.versionOptions.includes(generationForm.templateVersion)) {
      setGenerationForm((current) => ({
        ...current,
        templateVersion: selectedTemplate.defaultVersion
      }));
    }
  }, [generationForm.templateVersion, selectedTemplate]);

  async function handleResend(documentId: string) {
    setFeedback(null);
    startMutating(async () => {
      const response = await fetch(`/api/documents/${documentId}/resend`, {
        method: "POST"
      });

      if (!response.ok) {
        setFeedback("Não foi possível reenviar o documento agora.");
        return;
      }

      setFeedback("Documento reenviado com sucesso.");
      router.refresh();
    });
  }

  async function handleGenerateDocument() {
    setFeedback(null);
    startTransition(async () => {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(generationForm)
      });

      if (!response.ok) {
        setFeedback("Não foi possível gerar o documento agora.");
        return;
      }

      const payload = (await response.json()) as DocumentCreateResponse;
      setIsGenerateOpen(false);
      router.push(payload.redirectTo);
      router.refresh();
    });
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    setOrDelete(params, "search", query);
    setOrDelete(params, "patientId", patientId);
    setOrDelete(params, "documentType", documentType === "all" ? "" : documentType);
    setOrDelete(params, "signatureStatus", signatureStatus === "all" ? "" : signatureStatus);
    setOrDelete(params, "consentStatus", consentStatus === "all" ? "" : consentStatus);
    setOrDelete(params, "criticality", criticality === "all" ? "" : criticality);
    setOrDelete(params, "onlyCritical", onlyCritical ? "true" : "");
    setOrDelete(params, "thisWeekOnly", thisWeekOnly ? "true" : "");
    setOrDelete(params, "onlyRevoked", onlyRevoked ? "true" : "");
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function clearFilters() {
    setQuery("");
    setPatientId("");
    setDocumentType("all");
    setSignatureStatus("all");
    setConsentStatus("all");
    setCriticality("all");
    setOnlyCritical(false);
    setThisWeekOnly(false);
    setOnlyRevoked(false);
    router.replace(pathname);
  }

  function jumpToCritical() {
    setOnlyCritical(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("onlyCritical", "true");
    router.replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    setItems(initialData.items);
  }, [initialData.items]);

  return (
    <>
      <div className="space-y-6">
        <OperationalHero
          actions={
            <>
              <Button onClick={() => setIsGenerateOpen(true)} type="button">
                <FilePlus2 className="h-4 w-4" />
                Gerar documento
              </Button>
              <Button onClick={jumpToCritical} type="button" variant="secondary">
                <ShieldAlert className="h-4 w-4" />
                Ver pendências críticas
              </Button>
            </>
          }
          badges={
            <>
              <Badge tone="info">Compliance documental</Badge>
              {initialData.summary.criticalCount > 0 ? (
                <Badge tone="critical">{initialData.summary.criticalCount} pendências críticas</Badge>
              ) : (
                <Badge tone="success">Sem bloqueios críticos</Badge>
              )}
            </>
          }
          description="Acompanhe assinaturas, consentimentos e pendências documentais sem transformar a área em repositório genérico de arquivos."
          stats={[
            {
              detail: "Itens com impacto direto em sessão, call ou capability clínica.",
              label: "Críticos",
              tone: initialData.summary.criticalCount > 0 ? "critical" : "success",
              value: String(initialData.summary.criticalCount)
            },
            {
              detail: "Documentos aguardando aceite do paciente ou responsável.",
              label: "Assinaturas",
              tone: initialData.summary.pendingSignatureCount > 0 ? "warning" : "success",
              value: String(initialData.summary.pendingSignatureCount)
            },
            {
              detail: "Históricos revogados com rastreabilidade preservada.",
              label: "Revogados",
              tone: initialData.summary.revokedCount > 0 ? "warning" : "neutral",
              value: String(initialData.summary.revokedCount)
            }
          ]}
          supportingText={`${initialData.summary.affectedPatientsLabel}. O foco aqui é destacar o que bloqueia atendimento, transcript ou operação.`}
          title="Documentos"
        />

        <ToolbarPanel
          actions={
            <>
              <Button onClick={applyFilters} type="button" variant="secondary">
                Aplicar
              </Button>
              <Button onClick={() => setIsAdvancedOpen(true)} type="button" variant="ghost">
                <SlidersHorizontal className="h-4 w-4" />
                Extras
              </Button>
            </>
          }
          description="Filtre por paciente, tipo, assinatura e consentimento sem esconder o recorte crítico da fila."
          footer={
            <>
              <div className="flex flex-wrap gap-3">
                {activeChips.map((chip) => (
                  <Badge key={chip} tone="neutral">
                    {chip}
                  </Badge>
                ))}
                {activeChips.length > 0 ? (
                  <button
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 text-[11px] font-semibold leading-none whitespace-nowrap text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-raised)]"
                    onClick={clearFilters}
                    type="button"
                  >
                    <X className="h-3.5 w-3.5" />
                    Limpar filtros
                  </button>
                ) : null}
              </div>

              {feedback ? (
                <div className="rounded-2xl border border-[rgba(15,76,92,0.12)] bg-[rgba(15,76,92,0.04)] px-4 py-3 text-sm text-[var(--color-primary)]">
                  {feedback}
                </div>
              ) : null}
            </>
          }
          title="Filtrar documentos"
        >
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_repeat(4,minmax(0,1fr))]">
            <label className="flex h-12 min-w-0 items-center gap-3 rounded-2xl border border-[var(--color-border-strong)] bg-white px-4">
              <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
              <input
                className="w-full bg-transparent outline-none"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por paciente, código ou tipo documental"
                value={query}
              />
            </label>
            <SelectField
              label="Paciente"
              onChange={setPatientId}
              options={[{ label: "Todos", value: "" }, ...initialData.patientOptions]}
              value={patientId}
            />
            <SelectField
              label="Tipo"
              onChange={(value) => setDocumentType(value as typeof documentType)}
              options={[
                { label: "Todos", value: "all" },
                ...initialData.templateOptions.map((option) => ({
                  label: option.label,
                  value: option.documentType
                }))
              ]}
              value={documentType}
            />
            <SelectField
              label="Assinatura"
              onChange={(value) => setSignatureStatus(value as typeof signatureStatus)}
              options={signatureOptions}
              value={signatureStatus}
            />
            <SelectField
              label="Consentimento"
              onChange={(value) => setConsentStatus(value as typeof consentStatus)}
              options={consentOptions}
              value={consentStatus}
            />
          </div>
          <div className="flex gap-3 xl:hidden">
            <Button onClick={applyFilters} type="button" variant="secondary">
              Aplicar
            </Button>
            <Button onClick={() => setIsAdvancedOpen(true)} type="button" variant="ghost">
              <SlidersHorizontal className="h-4 w-4" />
              Extras
            </Button>
          </div>
        </ToolbarPanel>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">Lista principal</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                {initialData.total} documentos encontrados com priorizacao operacional, nao
                alfabetica.
              </p>
            </div>
            <Badge tone="neutral">
              <SlidersHorizontal className="mr-2 inline h-3.5 w-3.5" />
              Lista-first
            </Badge>
          </CardHeader>
          <CardContent className="overflow-hidden p-0">
            {items.length === 0 ? (
              <div className="p-6">
                <div className="rounded-[28px] border border-dashed border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-6">
                  <p className="text-lg font-semibold">
                    {activeChips.length > 0
                      ? "Nenhum documento corresponde aos filtros atuais."
                      : "Ainda não há documentos gerados para este workspace."}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    {activeChips.length > 0
                      ? "Ajuste a combinação de filtros ou limpe a busca para voltar a ver a fila completa."
                      : "Comece gerando o primeiro documento padrão da plataforma para deixar a operação pronta para assinatura e rastreabilidade."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {activeChips.length > 0 ? (
                      <Button onClick={clearFilters} type="button" variant="secondary">
                        Limpar filtros
                      </Button>
                    ) : (
                      <Button onClick={() => setIsGenerateOpen(true)} type="button">
                        Gerar primeiro documento
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1.5fr)_0.9fr_1fr_1.1fr] gap-4 border-b border-[var(--color-border)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                  <span>Paciente</span>
                  <span>Documento</span>
                  <span>Assinatura</span>
                  <span>Consentimento</span>
                  <span>Atualização</span>
                </div>
                {items.map((item) => (
                  <div
                    className={cn(
                      "grid cursor-pointer grid-cols-[minmax(0,1.4fr)_minmax(0,1.5fr)_0.9fr_1fr_1.1fr] gap-4 border-b border-[var(--color-border)] px-6 py-5 transition hover:bg-[rgba(15,76,92,0.03)]",
                      item.criticality === "critical" && "bg-[rgba(178,74,58,0.04)]"
                    )}
                    key={item.id}
                    onClick={() => router.push(item.openHref)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(item.openHref);
                      }
                    }}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold">{item.patientName}</p>
                        {item.criticality !== "normal" ? (
                          <Badge tone={item.criticality === "critical" ? "critical" : "warning"}>
                            {item.criticalityLabel}
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 truncate text-sm text-[var(--color-text-muted)]">{item.code}</p>
                      {item.blockedFlowLabels.length > 0 ? (
                        <p className="mt-2 truncate text-xs font-medium text-[var(--color-danger)]">
                          Impacta: {item.blockedFlowLabels.join(" · ")}
                        </p>
                      ) : null}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold">{item.documentTitle}</p>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        {item.templateVersion} · {item.generatedAtLabel}
                      </p>
                      <p className="mt-2 truncate text-xs text-[var(--color-text-muted)]">
                        {item.criticalReason}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <StatusBadge status={item.signatureStatus} text={item.signatureStatusLabel} />
                      <p className="text-xs text-[var(--color-text-muted)]">{item.signedByLabel}</p>
                    </div>

                    <div className="space-y-2">
                      <StatusBadge status={item.consentStatus} text={item.consentStatusLabel} />
                      {item.blockedFlowLabels.length > 0 ? (
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {item.blockedFlowLabels.length} impacto(s)
                        </p>
                      ) : (
                        <p className="text-xs text-[var(--color-text-muted)]">Sem bloqueio atual</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold">{item.lastEventAtLabel}</p>
                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">{item.lastEventLabel}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            void handleResend(item.id);
                          }}
                          type="button"
                          variant="ghost"
                          disabled={!item.canResend || isMutating}
                        >
                          <Send className="h-3.5 w-3.5" />
                          Reenviar
                        </Button>
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            router.push(item.patientHref);
                          }}
                          type="button"
                          variant="ghost"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Paciente
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <SidePanel
        description="Ative recortes de fila para destacar documentos da semana, críticos ou já revogados."
        isOpen={isAdvancedOpen}
        onClose={() => setIsAdvancedOpen(false)}
        title="Filtros extras"
      >
        <div className="space-y-3">
          <ChipToggle checked={onlyCritical} label="Apenas críticos" onToggle={setOnlyCritical} />
          <ChipToggle checked={thisWeekOnly} label="Apenas esta semana" onToggle={setThisWeekOnly} />
          <ChipToggle checked={onlyRevoked} label="Apenas revogados" onToggle={setOnlyRevoked} />
          <SelectField
            label="Prioridade"
            onChange={(value) => setCriticality(value as typeof criticality)}
            options={criticalityOptions}
            value={criticality}
          />
        </div>
        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => {
              setIsAdvancedOpen(false);
              applyFilters();
            }}
            type="button"
            variant="secondary"
          >
            Aplicar filtros
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              setIsAdvancedOpen(false);
            }}
            type="button"
            variant="ghost"
          >
            Limpar
          </Button>
        </div>
      </SidePanel>

      <SidePanel
        description="Gere documentos padrão da plataforma por paciente e contexto operacional."
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        title="Gerar documento"
      >
        <div className="space-y-4">
          <SelectField
            label="Paciente"
            onChange={(value) =>
              setGenerationForm((current) => ({
                ...current,
                patientId: value
              }))
            }
            options={initialData.patientOptions}
            value={generationForm.patientId}
          />
          <SelectField
            label="Tipo documental"
            onChange={(value) =>
              setGenerationForm((current) => ({
                ...current,
                documentType: value as DocumentCreateRequest["documentType"]
              }))
            }
            options={initialData.templateOptions.map((option) => ({
              label: option.label,
              value: option.documentType
            }))}
            value={generationForm.documentType}
          />
          <SelectField
            label="Versao"
            onChange={(value) =>
              setGenerationForm((current) => ({
                ...current,
                templateVersion: value
              }))
            }
            options={(selectedTemplate?.versionOptions ?? []).map((version) => ({
              label: version,
              value: version
            }))}
            value={generationForm.templateVersion}
          />
          <SelectField
            label="Canal"
            onChange={(value) =>
              setGenerationForm((current) => ({
                ...current,
                deliveryChannel: value as DocumentCreateRequest["deliveryChannel"]
              }))
            }
            options={[{ label: "E-mail", value: "email" }]}
            value={generationForm.deliveryChannel}
          />

          {selectedTemplate ? (
            <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4">
              <p className="text-sm font-semibold">{selectedTemplate.label}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                {selectedTemplate.description}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex gap-3">
          <Button onClick={handleGenerateDocument} type="button" disabled={isMutating}>
            <ArrowRight className="h-4 w-4" />
            Gerar e abrir detalhe
          </Button>
          <Button onClick={() => setIsGenerateOpen(false)} type="button" variant="ghost">
            Fechar
          </Button>
        </div>
      </SidePanel>
    </>
  );
}

function setOrDelete(params: URLSearchParams, key: string, value: string) {
  if (value.length === 0) {
    params.delete(key);
  } else {
    params.set(key, value);
  }
}

function SelectField({
  label,
  onChange,
  options,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </span>
      <select
        className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] bg-white px-4 outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ChipToggle({
  checked,
  label,
  onToggle
}: {
  checked: boolean;
  label: string;
  onToggle: (value: boolean) => void;
}) {
  return (
    <button
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-semibold leading-none whitespace-nowrap transition",
        checked
          ? "border-[var(--color-primary)] bg-[rgba(15,76,92,0.08)] text-[var(--color-primary)]"
          : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)]"
      )}
      onClick={() => onToggle(!checked)}
      type="button"
    >
      {label}
      {checked ? <X className="h-3.5 w-3.5" /> : null}
    </button>
  );
}

function SidePanel({
  children,
  description,
  isOpen,
  onClose,
  title
}: {
  children: ReactNode;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(12,24,27,0.24)] p-4">
      <button aria-label="Fechar painel" className="absolute inset-0" onClick={onClose} type="button" />
      <div className="relative h-full w-full max-w-xl overflow-y-auto rounded-[32px] border border-[var(--color-border)] bg-white p-6 shadow-[0_30px_90px_rgba(12,24,27,0.22)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.02em]">{title}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
          </div>
          <Button onClick={onClose} type="button" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  text
}: {
  status: DocumentListItem["signatureStatus"] | DocumentListItem["consentStatus"];
  text: string;
}) {
  const tone =
    status === "signed" || status === "valid"
      ? "success"
      : status === "pending"
        ? "warning"
        : status === "expired" || status === "revoked"
          ? "critical"
          : "neutral";

  return <Badge tone={tone}>{text}</Badge>;
}

function labelForType(value: string) {
  const map = {
    lgpd: "LGPD",
    telehealth: "Teleatendimento",
    transcript_ai: "Transcript e IA",
    therapy_contract: "Contrato terapeutico",
    operational: "Operacional"
  } as const;

  return map[value as keyof typeof map] ?? value;
}

function labelForSignature(value: string) {
  const map = {
    not_sent: "Não enviado",
    pending: "Pendente",
    signed: "Assinado",
    expired: "Expirado",
    revoked: "Revogado"
  } as const;

  return map[value as keyof typeof map] ?? value;
}

function labelForConsent(value: string) {
  const map = {
    valid: "Valido",
    pending: "Pendente",
    revoked: "Revogado",
    not_applicable: "Não aplicável"
  } as const;

  return map[value as keyof typeof map] ?? value;
}

function labelForCriticality(value: string) {
  const map = {
    normal: "Normal",
    attention: "Atenção",
    critical: "Critico"
  } as const;

  return map[value as keyof typeof map] ?? value;
}

const signatureOptions = [
  { label: "Todas", value: "all" },
  { label: "Não enviado", value: "not_sent" },
  { label: "Pendente", value: "pending" },
  { label: "Assinado", value: "signed" },
  { label: "Expirado", value: "expired" },
  { label: "Revogado", value: "revoked" }
];

const consentOptions = [
  { label: "Todos", value: "all" },
  { label: "Valido", value: "valid" },
  { label: "Pendente", value: "pending" },
  { label: "Revogado", value: "revoked" },
  { label: "Não aplicável", value: "not_applicable" }
];

const criticalityOptions = [
  { label: "Todas", value: "all" },
  { label: "Critico", value: "critical" },
  { label: "Atenção", value: "attention" },
  { label: "Normal", value: "normal" }
];
