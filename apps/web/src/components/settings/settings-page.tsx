"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type {
  SettingsBootstrap,
  SettingsNotificationPreference,
  SettingsNotificationsSection,
  SettingsPoliciesSection,
  SettingsPracticeSection,
  SettingsProfileSection,
  SettingsSectionKey,
  SettingsSecuritySection,
  SettingsUpdateResponse
} from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader, cn } from "@terapia/ui";
import {
  Bell,
  Building2,
  CheckCircle2,
  LockKeyhole,
  Save,
  ShieldAlert,
  ShieldCheck,
  UserRound
} from "lucide-react";

import { OperationalHero } from "@/components/shared/operational-surface";

type SettingsPageProps = {
  activeSection: SettingsSectionKey;
  initialData: SettingsBootstrap;
};

export function SettingsPageView({ activeSection, initialData }: SettingsPageProps) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [profile, setProfile] = useState(initialData.profile);
  const [practice, setPractice] = useState(initialData.practice);
  const [security, setSecurity] = useState(initialData.security);
  const [policies, setPolicies] = useState(initialData.policies);
  const [notifications, setNotifications] = useState(initialData.notifications);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasPendingChanges = useMemo(() => {
    switch (activeSection) {
      case "profile":
        return JSON.stringify(profile) !== JSON.stringify(data.profile);
      case "practice":
        return JSON.stringify(practice) !== JSON.stringify(data.practice);
      case "security":
        return JSON.stringify(security) !== JSON.stringify(data.security);
      case "policies":
        return JSON.stringify(policies) !== JSON.stringify(data.policies);
      case "notifications":
        return JSON.stringify(notifications) !== JSON.stringify(data.notifications);
    }
  }, [activeSection, data, notifications, policies, practice, profile, security]);
  const blockingRemediationCount = data.remediationItems.filter((item) => item.blocking).length;

  async function saveActiveSection() {
    setFeedback(null);

    const { path, payload } = getSavePayload(activeSection, {
      notifications,
      policies,
      practice,
      profile,
      security
    });

    startTransition(async () => {
      const response = await fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        setFeedback("Não foi possível salvar esta seção agora.");
        return;
      }

      const result = (await response.json()) as SettingsUpdateResponse;
      setData(result.settings);
      setProfile(result.settings.profile);
      setPractice(result.settings.practice);
      setSecurity(result.settings.security);
      setPolicies(result.settings.policies);
      setNotifications(result.settings.notifications);
      setFeedback(
        result.stepUpRequired
          ? "Alteração salva com trilha reforçada de segurança."
          : "Alterações salvas com sucesso."
      );
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <OperationalHero
        actions={
          <Button onClick={() => void saveActiveSection()} type="button" disabled={!hasPendingChanges || isPending}>
            <Save className="h-4 w-4" />
            {isPending ? "Salvando..." : "Salvar alterações"}
          </Button>
        }
        badges={
          <>
            <Badge tone="info">Governança operacional</Badge>
            <Badge
              tone={data.accountStatus === "restricted" ? "critical" : data.accountStatus === "ready_for_operations" ? "success" : "warning"}
            >
              {data.accountStatusLabel}
            </Badge>
            <Badge tone="success">{data.mfaStatusLabel}</Badge>
          </>
        }
        description="Gerencie dados do consultório, segurança da conta e políticas padrão de operação sem transformar a área em depósito de opções."
        stats={[
          {
            detail: "Itens que pedem correção agora.",
            label: "Remediações",
            tone: data.remediationItems.length > 0 ? "warning" : "success",
            value: String(data.remediationItems.length)
          },
          {
            detail: "Bloqueiam operação ou segurança até ajuste.",
            label: "Bloqueantes",
            tone: blockingRemediationCount > 0 ? "critical" : "success",
            value: String(blockingRemediationCount)
          },
          {
            detail: data.lastSensitiveChangeLabel,
            label: "Última trilha sensível",
            tone: "neutral",
            value: hasPendingChanges ? "Pendente" : "Em dia"
          }
        ]}
        title="Configurações"
      />

      {data.remediationItems.length > 0 ? (
        <Card className="border-[rgba(198,122,69,0.16)] bg-[rgba(198,122,69,0.05)] shadow-[var(--shadow-panel)]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[var(--color-accent)]" />
              <p className="text-lg font-semibold">Remediações em destaque</p>
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">
              O terapeuta não deve precisar procurar pendências em várias telas.
            </p>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {data.remediationItems.map((item) => (
              <Link
                className="rounded-3xl border border-[rgba(198,122,69,0.18)] bg-white p-4 transition hover:bg-[rgba(198,122,69,0.04)]"
                href={item.href}
                key={item.id}
              >
                <div className="flex items-center gap-2">
                  <Badge tone={item.blocking ? "critical" : "warning"}>
                    {item.blocking ? "Bloqueante" : "Atenção"}
                  </Badge>
                </div>
                <p className="mt-3 font-semibold">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {item.description}
                </p>
                <p className="mt-3 text-sm font-semibold text-[var(--color-primary)]">{item.ctaLabel}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[290px_minmax(0,1fr)_340px]">
        <Card>
          <CardHeader>
            <p className="text-lg font-semibold">Seções</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              O salvamento acontece por seção e suporta deep link.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.sections.map((section) => (
              <Link
                className={cn(
                  "block rounded-3xl border px-4 py-4 transition",
                  section.key === activeSection
                    ? "border-[var(--color-primary)] bg-[rgba(15,76,92,0.06)]"
                    : "border-[var(--color-border)] bg-white hover:bg-[rgba(15,76,92,0.03)]"
                )}
                href={section.href}
                key={section.key}
              >
                <div className="flex items-center gap-3">
                  <SectionIcon section={section.key} />
                  <div>
                    <p className="font-semibold">{section.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {activeSection === "profile" ? (
            <ProfileSection profile={profile} setProfile={setProfile} />
          ) : activeSection === "practice" ? (
            <PracticeSection practice={practice} setPractice={setPractice} />
          ) : activeSection === "security" ? (
            <SecuritySection security={security} setSecurity={setSecurity} />
          ) : activeSection === "policies" ? (
            <PoliciesSection policies={policies} setPolicies={setPolicies} />
          ) : (
            <NotificationsSection
              notifications={notifications}
              setNotifications={setNotifications}
            />
          )}

          <Card>
            <CardContent className="flex items-center justify-between gap-4 pt-6">
              <div>
                <p className="font-semibold">
                  {hasPendingChanges ? "Alterações pendentes nesta seção" : "Nenhuma alteração pendente"}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  Cada seção salva de forma independente e mudanças sensíveis geram auditoria reforçada.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {feedback ? <Badge tone="info">{feedback}</Badge> : null}
                <Button onClick={() => void saveActiveSection()} type="button" disabled={!hasPendingChanges || isPending}>
                  <Save className="h-4 w-4" />
                  Salvar alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <p className="text-lg font-semibold">Trilha sensível</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Alterações regulatórias e de segurança relevantes ficam rastreáveis.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.lastSensitiveChanges.map((item) => (
                <div
                  className="rounded-3xl border border-[var(--color-border)] bg-white p-4"
                  key={item.id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{item.title}</p>
                    <Badge tone={item.tone}>{item.actorLabel}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                    {item.description}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                    {item.occurredAtLabel}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-lg font-semibold">Regras da area</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-[var(--color-text-muted)]">
              <p>Dados do onboarding passam a ser mantidos aqui depois da ativacao.</p>
              <p>Configuracoes novas valem para o futuro por padrao, sem reescrever passado regulatorio.</p>
              <p>Nenhuma politica pode sobrescrever ausencia de consentimento valido.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({
  profile,
  setProfile
}: {
  profile: SettingsProfileSection;
  setProfile: React.Dispatch<React.SetStateAction<SettingsProfileSection>>;
}) {
  return (
    <Card>
      <CardHeader>
        <p className="text-lg font-semibold">Perfil profissional</p>
        <p className="text-sm text-[var(--color-text-muted)]">
          Dados visiveis ao paciente ficam claramente identificados.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Field label="Nome completo" value={profile.fullName} onChange={(value) => setProfile((current) => ({ ...current, fullName: value }))} />
        <Field label="Nome social" value={profile.socialName} onChange={(value) => setProfile((current) => ({ ...current, socialName: value }))} />
        <Field label="E-mail profissional" value={profile.professionalEmail} onChange={(value) => setProfile((current) => ({ ...current, professionalEmail: value }))} />
        <Field label="Telefone profissional" value={profile.phone} onChange={(value) => setProfile((current) => ({ ...current, phone: value }))} />
        <Field label="CRP" value={profile.crp} onChange={(value) => setProfile((current) => ({ ...current, crp: value }))} />
        <Field label="UF do CRP" value={profile.crpState} onChange={(value) => setProfile((current) => ({ ...current, crpState: value }))} />
        <Field label="Especialidade" value={profile.specialty} onChange={(value) => setProfile((current) => ({ ...current, specialty: value }))} />
        <Field label="Timezone" value={profile.timezone} onChange={(value) => setProfile((current) => ({ ...current, timezone: value }))} />
        <TextArea
          className="md:col-span-2"
          label="Mini bio"
          value={profile.miniBio}
          onChange={(value) => setProfile((current) => ({ ...current, miniBio: value }))}
        />
        <InfoBlock
          className="md:col-span-2"
          label="Campos publicos ao paciente"
          value={profile.publicFieldsSummary}
        />
      </CardContent>
    </Card>
  );
}

function PracticeSection({
  practice,
  setPractice
}: {
  practice: SettingsPracticeSection;
  setPractice: React.Dispatch<React.SetStateAction<SettingsPracticeSection>>;
}) {
  return (
    <Card>
      <CardHeader>
        <p className="text-lg font-semibold">Conta e consultório</p>
        <p className="text-sm text-[var(--color-text-muted)]">
          Dados institucionais e de recebimento usados por cobrança, recibos e novos documentos.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Field label="Nome do consultório" value={practice.practiceName} onChange={(value) => setPractice((current) => ({ ...current, practiceName: value }))} />
        <Field label="Nome exibido ao paciente" value={practice.displayName} onChange={(value) => setPractice((current) => ({ ...current, displayName: value }))} />
        <Field label="CPF/CNPJ" value={practice.billingDocument} onChange={(value) => setPractice((current) => ({ ...current, billingDocument: value }))} />
        <Field label="Telefone do consultório" value={practice.phone} onChange={(value) => setPractice((current) => ({ ...current, phone: value }))} />
        <Field label="Endereço principal" value={practice.addressLine} onChange={(value) => setPractice((current) => ({ ...current, addressLine: value }))} />
        <Field label="Cidade" value={practice.city} onChange={(value) => setPractice((current) => ({ ...current, city: value }))} />
        <Field label="UF" value={practice.state} onChange={(value) => setPractice((current) => ({ ...current, state: value }))} />
        <Field label="Chave Pix" value={practice.pixKey} onChange={(value) => setPractice((current) => ({ ...current, pixKey: value }))} />
        <Field label="Beneficiário" value={practice.beneficiaryName} onChange={(value) => setPractice((current) => ({ ...current, beneficiaryName: value }))} />
        <TextArea
          className="md:col-span-2"
          label="Instruções de recibo / cobrança"
          value={practice.receiptInstructions}
          onChange={(value) => setPractice((current) => ({ ...current, receiptInstructions: value }))}
        />
      </CardContent>
    </Card>
  );
}

function SecuritySection({
  security,
  setSecurity
}: {
  security: SettingsSecuritySection;
  setSecurity: React.Dispatch<React.SetStateAction<SettingsSecuritySection>>;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <p className="text-lg font-semibold">Segurança</p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Eventos críticos não podem ser apagados pelo terapeuta.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="E-mail de login" value={security.loginEmail} onChange={(value) => setSecurity((current) => ({ ...current, loginEmail: value }))} />
          <InfoBlock label="MFA" value={security.mfaStatusLabel} />
          <InfoBlock label="Códigos de recuperação" value={security.recoveryCodesLabel} />
          <InfoBlock label="Último evento crítico" value={security.lastCriticalEventLabel} />
          <ToggleCard
            label="Solicitar rotação de senha"
            description="Marca a conta para revisar credenciais no próximo ciclo de segurança."
            value={security.passwordRotationRequested}
            onChange={(value) => setSecurity((current) => ({ ...current, passwordRotationRequested: value }))}
          />
          <ToggleCard
            label="Revogar outras sessões"
            description="Revoga dispositivos recentes e preserva apenas a sessão atual."
            value={security.revokeOtherSessions}
            onChange={(value) => setSecurity((current) => ({ ...current, revokeOtherSessions: value }))}
          />
          <ToggleCard
            className="md:col-span-2"
            label="Rotacionar códigos de recuperação"
            description="Gera novo conjunto de códigos e invalida o anterior."
            value={security.rotateRecoveryCodes}
            onChange={(value) => setSecurity((current) => ({ ...current, rotateRecoveryCodes: value }))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="text-lg font-semibold">Sessões ativas</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {security.activeSessions.map((session) => (
            <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4" key={session.id}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{session.label}</p>
                <Badge tone={session.current ? "success" : "neutral"}>{session.statusLabel}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                {session.locationLabel} · {session.lastSeenLabel}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function PoliciesSection({
  policies,
  setPolicies
}: {
  policies: SettingsPoliciesSection;
  setPolicies: React.Dispatch<React.SetStateAction<SettingsPoliciesSection>>;
}) {
  return (
    <Card>
      <CardHeader>
        <p className="text-lg font-semibold">Políticas operacionais</p>
        <p className="text-sm text-[var(--color-text-muted)]">
          Defaults afetam fluxos futuros e nunca sobrescrevem ausência de consentimento válido.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <NumericField label="Duração padrão da sessão (min)" value={policies.sessionDurationMinutes} onChange={(value) => setPolicies((current) => ({ ...current, sessionDurationMinutes: value }))} />
        <NumericField label="Intervalo entre sessões (min)" value={policies.gapMinutes} onChange={(value) => setPolicies((current) => ({ ...current, gapMinutes: value }))} />
        <SelectField
          label="Modalidade padrão"
          value={policies.defaultModality}
          options={[
            { label: "Teleatendimento", value: "telehealth" },
            { label: "Presencial", value: "in_person" }
          ]}
          onChange={(value) =>
            setPolicies((current) => ({
              ...current,
              defaultModality: value as SettingsPoliciesSection["defaultModality"]
            }))
          }
        />
        <NumericField label="Janela de cancelamento (h)" value={policies.cancelWindowHours} onChange={(value) => setPolicies((current) => ({ ...current, cancelWindowHours: value }))} />
        <ToggleCard
          label="Paciente pode agendar sozinho"
          description="Define o default do fluxo futuro de autoagendamento."
          value={policies.allowSelfScheduling}
          onChange={(value) => setPolicies((current) => ({ ...current, allowSelfScheduling: value }))}
        />
        <ToggleCard
          label="Teleatendimento habilitado"
          description="Não altera retrospectivamente sessões já concluídas."
          value={policies.telehealthEnabled}
          onChange={(value) => setPolicies((current) => ({ ...current, telehealthEnabled: value }))}
        />
        <ToggleCard
          label="Transcript habilitado por padrão"
          description="Só vale quando houver capability ativa e consentimento válido."
          value={policies.transcriptDefaultEnabled}
          onChange={(value) => setPolicies((current) => ({ ...current, transcriptDefaultEnabled: value }))}
        />
        <ToggleCard
          label="Gerar cobrança após sessão"
          description="Default futuro do financeiro, sem reescrever cobranças antigas."
          value={policies.autoChargeAfterSession}
          onChange={(value) => setPolicies((current) => ({ ...current, autoChargeAfterSession: value }))}
        />
        <TextArea
          className="md:col-span-2"
          label="Política de cobrança e coleta"
          value={policies.collectionPolicy}
          onChange={(value) => setPolicies((current) => ({ ...current, collectionPolicy: value }))}
        />
      </CardContent>
    </Card>
  );
}

function NotificationsSection({
  notifications,
  setNotifications
}: {
  notifications: SettingsNotificationsSection;
  setNotifications: React.Dispatch<React.SetStateAction<SettingsNotificationsSection>>;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <p className="text-lg font-semibold">Canais</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <ToggleCard
            label="Canal in-app"
            description="Alertas dentro do shell do terapeuta."
            value={notifications.inAppEnabled}
            onChange={(value) => setNotifications((current) => ({ ...current, inAppEnabled: value }))}
          />
          <ToggleCard
            label="Canal e-mail"
            description="Resumo operacional enviado ao endereco profissional."
            value={notifications.emailEnabled}
            onChange={(value) => setNotifications((current) => ({ ...current, emailEnabled: value }))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="text-lg font-semibold">Preferencias</p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Alertas criticos de seguranca permanecem ligados.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.preferences.map((preference) => (
            <NotificationPreferenceCard
              key={preference.key}
              preference={preference}
              onChange={(nextPreference) =>
                setNotifications((current) => ({
                  ...current,
                  preferences: current.preferences.map((item) =>
                    item.key === nextPreference.key ? nextPreference : item
                  )
                }))
              }
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationPreferenceCard({
  onChange,
  preference
}: {
  onChange: (preference: SettingsNotificationPreference) => void;
  preference: SettingsNotificationPreference;
}) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold">{preference.label}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            {preference.description}
          </p>
        </div>
        {preference.locked ? <Badge tone="warning">Sempre ativo</Badge> : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <MiniToggle
          checked={preference.inApp}
          disabled={preference.locked}
          label="In-app"
          onChange={(checked) => onChange({ ...preference, inApp: checked })}
        />
        <MiniToggle
          checked={preference.email}
          disabled={preference.locked}
          label="E-mail"
          onChange={(checked) => onChange({ ...preference, email: checked })}
        />
      </div>
    </div>
  );
}

function MiniToggle({
  checked,
  disabled,
  label,
  onChange
}: {
  checked: boolean;
  disabled: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-semibold leading-none whitespace-nowrap transition",
        checked
          ? "border-[var(--color-primary)] bg-[rgba(15,76,92,0.08)] text-[var(--color-primary)]"
          : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)]",
        disabled && "cursor-not-allowed opacity-70"
      )}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      type="button"
    >
      {checked ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
      {label}
    </button>
  );
}

function Field({
  label,
  onChange,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </span>
      <input
        className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] px-4 outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function NumericField({
  label,
  onChange,
  value
}: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </span>
      <input
        className="h-12 w-full rounded-2xl border border-[var(--color-border-strong)] px-4 outline-none"
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        value={value}
      />
    </label>
  );
}

function TextArea({
  className,
  label,
  onChange,
  value
}: {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className={cn("space-y-2", className)}>
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </span>
      <textarea
        className="min-h-28 w-full rounded-2xl border border-[var(--color-border-strong)] px-4 py-3 outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
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

function ToggleCard({
  className,
  description,
  label,
  onChange,
  value
}: {
  className?: string;
  description: string;
  label: string;
  onChange: (value: boolean) => void;
  value: boolean;
}) {
  return (
    <button
      className={cn(
        "rounded-3xl border p-4 text-left transition",
        value
          ? "border-[var(--color-primary)] bg-[rgba(15,76,92,0.06)]"
          : "border-[var(--color-border)] bg-white",
        className
      )}
      onClick={() => onChange(!value)}
      type="button"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-semibold">{label}</p>
        <Badge tone={value ? "success" : "neutral"}>{value ? "Ativo" : "Desligado"}</Badge>
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
    </button>
  );
}

function InfoBlock({
  className,
  label,
  value
}: {
  className?: string;
  label: string;
  value: string;
}) {
  return (
    <div className={cn("rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4", className)}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{value}</p>
    </div>
  );
}

function SectionIcon({ section }: { section: SettingsSectionKey }) {
  if (section === "profile") return <UserRound className="h-4 w-4 text-[var(--color-primary)]" />;
  if (section === "practice") return <Building2 className="h-4 w-4 text-[var(--color-primary)]" />;
  if (section === "security") return <ShieldCheck className="h-4 w-4 text-[var(--color-primary)]" />;
  if (section === "policies") return <LockKeyhole className="h-4 w-4 text-[var(--color-primary)]" />;
  return <Bell className="h-4 w-4 text-[var(--color-primary)]" />;
}

function getSavePayload(
  activeSection: SettingsSectionKey,
  sections: {
    profile: SettingsProfileSection;
    practice: SettingsPracticeSection;
    security: SettingsSecuritySection;
    policies: SettingsPoliciesSection;
    notifications: SettingsNotificationsSection;
  }
) {
  switch (activeSection) {
    case "profile":
      return {
        path: "/api/settings/profile",
        payload: {
          fullName: sections.profile.fullName,
          socialName: sections.profile.socialName,
          professionalEmail: sections.profile.professionalEmail,
          phone: sections.profile.phone,
          crp: sections.profile.crp,
          crpState: sections.profile.crpState,
          specialty: sections.profile.specialty,
          timezone: sections.profile.timezone,
          miniBio: sections.profile.miniBio
        }
      };
    case "practice":
      return {
        path: "/api/settings/practice",
        payload: {
          practiceName: sections.practice.practiceName,
          displayName: sections.practice.displayName,
          billingDocument: sections.practice.billingDocument,
          addressLine: sections.practice.addressLine,
          city: sections.practice.city,
          state: sections.practice.state,
          phone: sections.practice.phone,
          pixKey: sections.practice.pixKey,
          beneficiaryName: sections.practice.beneficiaryName,
          receiptInstructions: sections.practice.receiptInstructions
        }
      };
    case "security":
      return {
        path: "/api/settings/security",
        payload: {
          loginEmail: sections.security.loginEmail,
          passwordRotationRequested: sections.security.passwordRotationRequested,
          revokeOtherSessions: sections.security.revokeOtherSessions,
          rotateRecoveryCodes: sections.security.rotateRecoveryCodes
        }
      };
    case "policies":
      return {
        path: "/api/settings/policies",
        payload: sections.policies
      };
    case "notifications":
      return {
        path: "/api/settings/notifications",
        payload: sections.notifications
      };
  }
}
