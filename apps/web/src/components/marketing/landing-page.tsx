"use client";

import { useState, useTransition, type FormEvent } from "react";
import {
  ArrowRight,
  Ban,
  BookOpen,
  Building2,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  FileCheck,
  FileText,
  Flag,
  Globe,
  Lock,
  MessageSquare,
  Monitor,
  RefreshCw,
  Shield,
  Sparkles,
  User,
  UserCheck,
  Wallet
} from "lucide-react";
import type {
  WaitlistBiggestPain,
  WaitlistJoinRequest,
  WaitlistJoinResponse,
  WaitlistMonthlySessionsRange,
  WaitlistProfessionalRole,
  WaitlistSummary
} from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader } from "@terapia/ui";

import { WaitlistForm, type WaitlistJoinSuccessPayload } from "./waitlist-form";

type LandingPageProps = {
  summary: WaitlistSummary;
  utmCampaign?: string;
  utmContent?: string;
  utmMedium?: string;
  utmSource?: string;
  utmTerm?: string;
};

type LandingStage = "capture" | "enrichment" | "done";

type JoinState = {
  alreadyJoined: boolean;
  email: string;
  message: string;
  professionalRole: WaitlistProfessionalRole;
};

const roleLabels: Record<WaitlistProfessionalRole, string> = {
  therapist: "Psicólogo(a) clínico(a)",
  psychiatrist: "Psiquiatra",
  clinic_owner: "Clínica ou consultório",
  operations: "Operação ou secretária",
  other: "Outro perfil"
};

function getRoleLabel(role: WaitlistProfessionalRole) {
  return roleLabels[role] ?? "Outro perfil";
}

const monthlySessionsOptions: { label: string; value: WaitlistMonthlySessionsRange }[] = [
  { value: "up_to_20", label: "Até 20 sessões por mês" },
  { value: "21_to_60", label: "Entre 21 e 60 sessões por mês" },
  { value: "61_to_120", label: "Entre 61 e 120 sessões por mês" },
  { value: "121_plus", label: "Mais de 120 sessões por mês" }
];

const biggestPainOptions: { label: string; value: WaitlistBiggestPain }[] = [
  { value: "post_session_overload", label: "Pós-sessão pesado no fim do dia" },
  { value: "scattered_workflow", label: "Rotina espalhada entre várias ferramentas" },
  { value: "documents_and_consents", label: "Documentos e consentimentos fora do timing" },
  { value: "financial_follow_up", label: "Cobrança e acompanhamento financeiro" },
  { value: "switching_between_tools", label: "Troca constante entre telas e contextos" }
];

const brandName = "Luma";
const productName = "Luma Manager";

export function LandingPage({
  summary,
  utmCampaign,
  utmContent,
  utmMedium,
  utmSource,
  utmTerm
}: LandingPageProps) {
  const [stage, setStage] = useState<LandingStage>("capture");
  const [waitlistSummary, setWaitlistSummary] = useState(summary);
  const [joinState, setJoinState] = useState<JoinState | null>(null);
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [monthlySessionsRange, setMonthlySessionsRange] =
    useState<WaitlistMonthlySessionsRange>("21_to_60");
  const [biggestPain, setBiggestPain] =
    useState<WaitlistBiggestPain>("scattered_workflow");
  const [questionnaireError, setQuestionnaireError] = useState<string | null>(null);
  const [isSavingQuestionnaire, startQuestionnaireSave] = useTransition();

  function handleJoinSuccess(payload: WaitlistJoinSuccessPayload) {
    setWaitlistSummary(payload.summary);
    setJoinState({
      alreadyJoined: payload.alreadyJoined,
      email: payload.email,
      message: payload.message,
      professionalRole: payload.professionalRole
    });
    setQuestionnaireError(null);
    setStage("enrichment");
  }

  async function handleQuestionnaireSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!joinState) {
      return;
    }

    setQuestionnaireError(null);

    startQuestionnaireSave(async () => {
      try {
        const payload = {
          email: joinState.email,
          professionalRole: joinState.professionalRole,
          fullName,
          whatsapp,
          monthlySessionsRange,
          biggestPain,
          sourcePath: "/",
          referrerHost: getReferrerHost(),
          utmSource: utmSource ?? "",
          utmMedium: utmMedium ?? "",
          utmCampaign: utmCampaign ?? "",
          utmContent: utmContent ?? "",
          utmTerm: utmTerm ?? ""
        } as WaitlistJoinRequest;

        const response = await fetch("/api/marketing/waitlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const body = (await response.json().catch(() => null)) as
          | WaitlistJoinResponse
          | { message?: string }
          | null;

        if (!response.ok) {
          throw new Error(
            body && "message" in body
              ? body.message ?? "Não foi possível salvar seu contexto agora."
              : "Não foi possível salvar seu contexto agora."
          );
        }

        const result = body as WaitlistJoinResponse;
        setWaitlistSummary(result.summary);
        setJoinState((current) =>
          current
            ? {
                ...current,
                alreadyJoined: result.alreadyJoined,
                message: result.message
              }
            : current
        );
        setStage("done");
      } catch (error) {
        setQuestionnaireError(
          error instanceof Error
            ? error.message
            : "Não foi possível salvar seu contexto agora."
        );
      }
    });
  }

  if (stage !== "capture" && joinState) {
    return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(198,122,69,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(15,76,92,0.16),transparent_30%),linear-gradient(180deg,#f8f3e8_0%,#f4ede2_100%)] px-2 py-5 lg:px-3 lg:py-6">
        <div className="mx-auto w-full max-w-[1600px]">
          {stage === "enrichment" ? (
            <FullViewStage
              badge="Você está na fila"
              title={joinState.alreadyJoined ? "Seu e-mail já estava registrado" : "Pronto, sua entrada foi confirmada."}
              description="Quer ser chamado antes? Responda 4 perguntas rápidas sobre sua rotina — menos de 1 minuto."
            >
              <div className="flex items-start gap-3 rounded-[20px] border border-[rgba(63,107,97,0.18)] bg-[linear-gradient(180deg,rgba(63,107,97,0.08)_0%,rgba(63,107,97,0.03)_100%)] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(63,107,97,0.16)] text-[var(--color-success)]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    {joinState.email} registrado como {getRoleLabel(joinState.professionalRole)}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                    Os primeiros convites vão para quem tem mais aderência ao problema que o {productName} resolve.
                  </p>
                </div>
              </div>

              <form className="grid gap-5" onSubmit={handleQuestionnaireSubmit}>
                <div className="rounded-[22px] border border-[rgba(15,76,92,0.14)] bg-[rgba(255,255,255,0.72)] p-5">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                    Sobre sua rotina
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <StageField label="Nome completo">
                      <input
                        className={stageInputClassName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="Seu nome"
                        value={fullName}
                      />
                    </StageField>
                    <StageField label="WhatsApp (opcional)">
                      <input
                        className={stageInputClassName}
                        onChange={(event) => setWhatsapp(event.target.value)}
                        placeholder="(11) 99999-9999"
                        value={whatsapp}
                      />
                    </StageField>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <StageField label="Quantas sessões você faz por mês?">
                      <select
                        className={stageInputClassName}
                        onChange={(event) =>
                          setMonthlySessionsRange(
                            event.target.value as WaitlistMonthlySessionsRange
                          )
                        }
                        value={monthlySessionsRange}
                      >
                        {monthlySessionsOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </StageField>
                    <StageField label="O que mais pesa na sua rotina hoje?">
                      <select
                        className={stageInputClassName}
                        onChange={(event) =>
                          setBiggestPain(event.target.value as WaitlistBiggestPain)
                        }
                        value={biggestPain}
                      >
                        {biggestPainOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </StageField>
                  </div>
                </div>

                {questionnaireError ? (
                  <div className="rounded-[22px] border border-[rgba(178,74,58,0.16)] bg-[rgba(178,74,58,0.06)] px-4 py-3 text-sm text-[var(--color-danger)]">
                    {questionnaireError}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    className="h-[48px] rounded-[20px] px-5 text-sm"
                    disabled={isSavingQuestionnaire}
                    type="submit"
                  >
                    {isSavingQuestionnaire ? "Enviando..." : "Enviar e aumentar minha prioridade"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <button
                    className="text-sm text-[var(--color-text-muted)] underline underline-offset-4 transition hover:text-[var(--color-text)]"
                    onClick={() => setStage("done")}
                    type="button"
                  >
                    Pular por agora
                  </button>
                </div>
              </form>
            </FullViewStage>
          ) : null}

          {stage === "done" ? (
            <FullViewStage
              badge="Tudo certo"
              title="Seu lugar na fila está garantido."
              description="Agora é só aguardar. Se o seu perfil combinar com os primeiros convites, vamos entrar em contato pelo e-mail cadastrado."
            >
              <div className="flex items-start gap-3 rounded-[20px] border border-[rgba(63,107,97,0.18)] bg-[linear-gradient(180deg,rgba(63,107,97,0.08)_0%,rgba(63,107,97,0.03)_100%)] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(63,107,97,0.16)] text-[var(--color-success)]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    {joinState.email} — {getRoleLabel(joinState.professionalRole)}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                    Os primeiros convites vão por aderência ao problema, não por ordem de chegada.
                  </p>
                </div>
              </div>

              <div className="rounded-[22px] border border-[rgba(15,76,92,0.14)] bg-[rgba(255,255,255,0.72)] p-5">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  O que esperar agora
                </p>
                <ul className="mt-3 grid gap-2 text-sm leading-7 text-[var(--color-text-muted)]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                    Vamos analisar seu perfil e sua rotina para entender a aderência.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                    Se fizer sentido, você recebe o convite direto no e-mail.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                    Sem spam — só entramos em contato quando houver novidade real.
                  </li>
                </ul>
              </div>

              <Button
                className="h-[48px] w-fit rounded-[20px] border border-[var(--color-border-strong)] px-5 text-sm"
                onClick={() => setStage("capture")}
                variant="ghost"
              >
                Ver como funciona o {productName}
              </Button>
            </FullViewStage>
          ) : null}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(198,122,69,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(15,76,92,0.16),transparent_30%),linear-gradient(180deg,#f8f3e8_0%,#f4ede2_100%)] px-2 py-5 lg:px-3 lg:py-6">
      <div className="mx-auto w-full max-w-[1900px]">
        <section>
          <div className="relative overflow-hidden rounded-[40px] border border-[rgba(15,76,92,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 pb-11 text-white shadow-[0_30px_80px_rgba(15,76,92,0.24)] lg:p-10 lg:pb-16">
            <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_28%,rgba(255,255,255,0.04)_46%,rgba(255,255,255,0)_74%)] opacity-90" />
            <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[rgba(255,255,255,0.08)] blur-3xl" />
            <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[rgba(198,122,69,0.16)] blur-3xl" />

            <div className="relative">
              <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(380px,420px)]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-2xl border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.74)]">
                      {brandName}
                    </div>
                    <Badge tone="warning" className="bg-[rgba(255,255,255,0.16)] text-white">
                      Beta do {productName}
                    </Badge>
                  </div>

                  <h1 className="mt-8 max-w-3xl text-[clamp(2.8rem,4.1vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                    A rotina clínica para de se espalhar quando tudo roda na {brandName}.
                  </h1>

                  <p className="mt-5 max-w-2xl text-[17px] leading-8 text-[rgba(255,255,255,0.8)]">
                    O {productName} é o produto da {brandName} para psicólogo(a) autônomo(a) no Brasil.
                    Ele junta o que hoje fica em Google Agenda, WhatsApp, planilha, documento solto
                    e cobrança espalhada, sem abrir mão de revisão humana obrigatória.
                  </p>

                  <div className="mt-6 grid gap-2 sm:max-w-2xl">
                    <HeroBullet text="Veja cedo o que pode travar atendimento, consentimento, continuidade ou pagamento." />
                    <HeroBullet text="Feche o pós-sessão com contexto, rascunho assistido e decisão humana." />
                    <HeroBullet text="Saia do remendo entre Google Agenda, WhatsApp, planilha, documento e cobrança." />
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button
                      asChild
                      className="h-[54px] rounded-[22px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-6 text-base font-semibold text-white shadow-[0_18px_38px_rgba(198,122,69,0.28)] hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
                    >
                      <a href="#waitlist">
                        Entrar na waitlist
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      className="h-[54px] rounded-[22px] border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.08)] px-6 text-base text-white hover:bg-[rgba(255,255,255,0.12)]"
                      variant="ghost"
                    >
                      <a href="#como-funciona">Ver como funciona</a>
                    </Button>
                  </div>
                </div>

                <WaitlistForm
                  embedded
                  initialSummary={waitlistSummary}
                  onJoinSuccess={handleJoinSuccess}
                  sourcePath="/"
                  utmCampaign={utmCampaign}
                  utmContent={utmContent}
                  utmMedium={utmMedium}
                  utmSource={utmSource}
                  utmTerm={utmTerm}
                />
              </div>

              <div className="mt-8 rounded-[30px] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] p-5 backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(255,255,255,0.56)]">
                      Hoje na {brandName}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                      O consultório em ordem antes, durante e depois da sessão.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 lg:grid-cols-5">
                  <HeroMetric
                    label="Sessões hoje"
                    value="6"
                    detail="2 com pendência operacional"
                  />
                  <HeroMetric
                    label="Pós-sessão"
                    value="2"
                    detail="1 rascunho e 1 revisão final"
                  />
                  <HeroMetric
                    label="Recebimentos"
                    value="R$ 480"
                    detail="1 cobrança fora do prazo"
                  />
                  <MiniSignal
                    eyebrow="Governança"
                    title="Revisão humana obrigatória"
                    description="A IA assiste o fechamento. O registro clínico final continua sob decisão do terapeuta."
                  />
                  <MiniSignal
                    eyebrow="Pensado para o Brasil"
                    title="Feito para a rotina do consultório daqui"
                    description="Cobrança, documentos, consentimentos e o jeito de atender no Brasil entram no produto desde o começo."
                  />
                </div>
              </div>

              <div className="mt-4 rounded-[30px] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] p-5 backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(255,255,255,0.56)]">
                      Preview do {productName}
                    </p>
                    <p className="mt-2 text-lg font-semibold tracking-[-0.02em]">
                      Um recorte do dia para visualizar o que pede ação agora.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid items-start gap-3 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
                  <PatientSummaryCard
                    patientName="Ana Ribeiro"
                    sessionTime="09:00"
                    summary="Entre na próxima sessão com a mente fresca sobre o que ficou mais vivo na conversa anterior."
                    bullets={[
                      "ansiedade mais alta ao falar da pressão no trabalho",
                      "culpa recorrente quando tenta colocar limite na família",
                      "combinado de observar rotina de sono até a próxima sessão"
                    ]}
                    nextStep="Retomar como foi a semana no trabalho e se conseguiu sustentar algum limite sem se punir."
                  />

                  <HeroQueueCard
                    eyebrow="Fila de fechamento"
                    title="Pós-sessão com contexto pronto"
                    description={`A ${brandName} separa o que está pronto para revisar do que ainda depende de ação.`}
                    items={[
                      "Sessão 11:00 com cobrança pendente",
                      "Sessão 15:30 com documento para liberar"
                    ]}
                  />

                  <HeroQueueCard
                    eyebrow="Leitura longitudinal"
                    title="Continuidade visível antes da próxima conversa"
                    description="O caso volta com o que já foi aprovado, sem recomeçar da memória."
                    items={[
                      "Último resumo aprovado em 26 de março",
                      "Próximo passo sugerido para retomada"
                    ]}
                  />
                </div>

                <div className="mt-3 grid gap-3 lg:grid-cols-4">
                  <HeroValue
                    eyebrow="Agenda"
                    title="Bloqueios, disponibilidade e sessões no mesmo quadro"
                    description="A agenda deixa de ser um calendário solto e vira a mesa de ação do dia."
                  />
                  <HeroValue
                    eyebrow="Sessão"
                    title="O detalhe mostra o que pode travar continuidade"
                    description="Paciente, consentimentos, cobrança e próximos passos aparecem no mesmo lugar."
                  />
                  <HeroValue
                    eyebrow="Revisão"
                    title="O pós-sessão deixa de depender de memória improvisada"
                    description="O sistema organiza rascunho, contexto e pendências antes da aprovação final."
                  />
                  <HeroValue
                    eyebrow="Financeiro"
                    title="Cobrança e documentos entram no fluxo clínico"
                    description="O que costuma escapar ao longo da semana aparece antes de virar urgência."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-4">
          <TrustCard
            icon={<MessageSquare className="h-5 w-5" />}
            title="Útil sem áudio"
            description="A promessa principal não depende de gravar tudo. O produto continua útil no modo texto ou ditado."
          />
          <TrustCard
            icon={<UserCheck className="h-5 w-5" />}
            title="Revisão humana obrigatória"
            description="A IA propõe e organiza. O terapeuta continua decidindo o que vira registro final."
          />
          <TrustCard
            icon={<Shield className="h-5 w-5" />}
            title="Sem fazer o bruto virar identidade"
            description="Áudio e transcript são capability condicional, não a base da tese do produto."
          />
          <TrustCard
            icon={<Globe className="h-5 w-5" />}
            title="Pensado para o consultório no Brasil"
            description="Cobrança, consentimentos, documentos e a rotina real do consultório entram no produto desde cedo."
          />
        </section>

        <section className="mt-16" id="problema">
          <div className="max-w-3xl">
            <Badge tone="warning" className="px-3">
              O problema hoje
            </Badge>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
              O consultório se espalha quando cada parte da rotina vive em um canto.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[var(--color-text-muted)]">
              Google Agenda em um lado, WhatsApp em outro, planilha para cobrança, documento solto
              no Drive e o pós-sessão sempre empurrado para o fim do dia.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            <ProblemCard
              icon={<Calendar className="h-5 w-5" />}
              title="Agenda solta"
              description="A sessão existe no Google Agenda, mas o contexto real do atendimento não acompanha o horário."
            />
            <ProblemCard
              icon={<Clock className="h-5 w-5" />}
              title="Pós-sessão pesado"
              description="O fechamento clínico fica para depois e passa a depender de memória, cansaço e texto improvisado."
            />
            <ProblemCard
              icon={<FileText className="h-5 w-5" />}
              title="Documento fora do timing"
              description="Consentimento, termo e pendência aparecem tarde, quando já viraram atrito no WhatsApp com paciente."
            />
            <ProblemCard
              icon={<CreditCard className="h-5 w-5" />}
              title="Cobrança sem contexto"
              description="Pagamento vai para planilha, comprovante chega no WhatsApp e o financeiro vira mais uma pilha separada."
            />
          </div>
        </section>

        <section className="mt-16" id="como-funciona">
          <div className="max-w-3xl">
            <Badge tone="info" className="px-3">
              Plataforma única
            </Badge>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
                Em vez de remendar ferramentas, a rotina inteira passa a caber no mesmo workspace.
              </h2>
              <p className="mt-4 text-lg leading-8 text-[var(--color-text-muted)]">
                No {productName}, antes, durante e depois da sessão passam a conversar no mesmo fluxo
                operacional, com menos troca de contexto e menos decisão importante perdida no fim do dia.
              </p>
            </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <PlatformCard
              icon={<CalendarDays className="h-5 w-5" />}
              title="Agenda do terapeuta"
              description="Disponibilidade, bloqueios, quick view e criação de sessão sem sair da grade."
            />
            <PlatformCard
              icon={<Monitor className="h-5 w-5" />}
              title="Detalhe da sessão"
              description="Paciente, consentimentos, pagamento, prontidão e acesso à sala no mesmo contexto."
            />
            <PlatformCard
              icon={<FileCheck className="h-5 w-5" />}
              title="Revisão clínica"
              description="Fila, transcript quando houver, rascunho assistido e aprovação humana antes do registro final."
            />
            <PlatformCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Prontuário longitudinal"
              description="Continuidade visível a partir do que já foi aprovado, sem depender de memória improvisada."
            />
            <PlatformCard
              icon={<FileText className="h-5 w-5" />}
              title="Documentos e consentimentos"
              description="Versão, status, assinatura, revogação e impacto operacional claros no fluxo da prática."
            />
            <PlatformCard
              icon={<Wallet className="h-5 w-5" />}
              title="Financeiro e portal"
              description="Cobrança ligada à sessão, leitura operacional do recebimento e fluxo web do paciente."
            />
          </div>
        </section>

        <section className="mt-16">
          <div className="grid gap-5 lg:grid-cols-3">
            <DeepDiveCard
              badge="Deep dive 01"
              signal="Texto ou ditado com fechamento assistido"
              title="O pós-sessão pesa menos quando o sistema já organiza o que precisa ser fechado."
              description="Em vez de depender só de memória, texto improvisado e boa vontade no fim do dia, a revisão clínica já nasce com contexto, rascunho assistido, pendências e continuidade visível."
              bullets={[
                "funciona com texto ou ditado",
                "revisão humana obrigatória",
                "organiza resumo, continuidade e próximos passos"
              ]}
            />
            <DeepDiveCard
              badge="Deep dive 02"
              signal="Contexto reaparece no momento certo"
              title="A continuidade clínica deixa de viver espalhada entre sessões, arquivos e lembranças."
              description="O que já foi aprovado volta como contexto útil para retomar o caso sem começar sempre do zero."
              bullets={[
                "linha longitudinal do cuidado",
                "mais clareza para retomar a próxima sessão",
                "menos risco de perder contexto importante"
              ]}
            />
            <DeepDiveCard
              badge="Deep dive 03"
              signal="Operação e cuidado no mesmo radar"
              title="Consentimentos, documentos e cobrança entram no mesmo radar da prática."
              description="O produto não trata documento e financeiro como apêndice. O que pode travar continuidade ou recebimento aparece no fluxo certo."
              bullets={[
                "status documental visível",
                "cobrança ligada ao atendimento",
                "menos surpresa operacional com o paciente"
              ]}
            />
          </div>
        </section>

        <section className="mt-16">
          <div className="max-w-3xl">
            <Badge tone="neutral" className="px-3">
              Redução de risco
            </Badge>
            <h2 className="mt-4 text-[2.4rem] font-semibold tracking-[-0.04em]">
              Antes de experimentar, você precisa confiar.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[var(--color-text-muted)]">
              Sabemos que privacidade, uso de IA e clareza sobre o que o produto faz (e o que não
              faz) são decisivos para qualquer profissional de saúde mental.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            <RiskCard
              icon={<Sparkles className="h-5 w-5" />}
              title="IA assistiva"
              description="O produto propõe, organiza e acelera o fechamento. O julgamento clínico continua humano."
            />
            <RiskCard
              icon={<Ban className="h-5 w-5" />}
              title="Sem CID por IA"
              description="O sistema não se posiciona como ferramenta de diagnóstico ou classificação automática."
            />
            <RiskCard
              icon={<Lock className="h-5 w-5" />}
              title="Sem reter bruto como tese"
              description="Áudio e transcript não precisam virar a identidade do produto para ele continuar útil."
            />
            <RiskCard
              icon={<Flag className="h-5 w-5" />}
              title="Feito para operar no Brasil"
              description="Consentimentos, fluxo documental e rotina de consultório entram no produto desde o beta, sem adaptar um sistema gringo."
            />
          </div>
        </section>

        <section className="mt-16">
          <Card className="overflow-hidden border-[rgba(15,76,92,0.14)] bg-[rgba(255,253,248,0.94)]">
            <CardHeader className="border-b border-[var(--color-border)] pb-5">
              <Badge tone="warning" className="w-fit px-3">
                Para quem o beta faz sentido
              </Badge>
              <p className="text-3xl font-semibold tracking-[-0.03em]">
                Para quem já sente que a operação clínica se espalhou demais.
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-text-muted)]">
                O fit mais forte hoje é o psicólogo autônomo, com consultório enxuto, que atende
                sozinho e sente atrito real entre agenda, pós-sessão, documento e cobrança.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
              <FitPoint
                icon={<RefreshCw className="h-5 w-5" />}
                title="Quem cansou do remendo"
                description="Hoje opera entre Google Agenda, WhatsApp, planilha, Drive, documento solto e revisão clínica fragmentada."
              />
              <FitPoint
                icon={<User className="h-5 w-5" />}
                title="Psicólogo(a) solo"
                description="Atende com volume recorrente e já sente o desgaste para fechar sessão, documento e cobrança no mesmo dia."
              />
              <FitPoint
                icon={<Building2 className="h-5 w-5" />}
                title="Consultório enxuto"
                description="Quer clareza operacional sem cair em software frio de clínica grande nem em app wellness para paciente."
              />
            </CardContent>
          </Card>
        </section>

        <section className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <Badge tone="neutral" className="px-3">
              FAQ
            </Badge>
            <h2 className="mt-4 text-[2.4rem] font-semibold tracking-[-0.04em]">
              As perguntas que um terapeuta faz antes de confiar.
            </h2>
          </div>
          <div className="mt-8 grid gap-4">
            <FaqCard
              question="Funciona mesmo sem áudio?"
              answer="Sim. A utilidade principal continua existindo com texto ou ditado. Áudio e transcript são capability condicional, não a única forma do produto fazer sentido."
            />
            <FaqCard
              question="A IA substitui meu julgamento clínico?"
              answer="Não. O produto organiza, propõe e acelera. O fechamento clínico final continua exigindo revisão e decisão humana."
            />
            <FaqCard
              question="O paciente acessa prontuário ou conteúdo clínico?"
              answer="Não. O portal do paciente cobre o fluxo operacional essencial, como convite, documentos, pagamento e acesso à sessão, sem abrir o prontuário clínico."
            />
            <FaqCard
              question="Onde isso mais ajuda na prática?"
              answer="Principalmente antes da sessão, no detalhe operacional do atendimento, no fechamento do pós-sessão e na leitura de tudo que pode travar continuidade ou pagamento."
            />
            <FaqCard
              question="Como ficam consentimentos e documentos?"
              answer="Eles entram no fluxo da prática com status, impacto operacional, assinatura e histórico, em vez de ficarem soltos até virarem urgência."
            />
            <FaqCard
              question="O que acontece depois que eu entrar?"
              answer="Você entra na fila e, se o seu caso combinar com os primeiros testes, vamos abrir o beta com um grupo pequeno e bem aderente a essa dor."
            />
          </div>
        </section>

        <section className="mt-16 rounded-[40px] border border-[rgba(15,76,92,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_50%,#164d59_100%)] px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,76,92,0.24)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge tone="warning" className="bg-[rgba(255,255,255,0.16)] text-white">
                Waitlist
              </Badge>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
                Se essa rotina já pesa hoje, entra cedo na fila.
              </h2>
              <p className="mt-4 text-lg leading-8 text-[rgba(255,255,255,0.8)]">
                O {productName} não é para quem quer mais uma ferramenta solta. Ele é para quem quer
                parar de remendar agenda, sessão, documento, revisão e cobrança em cinco lugares diferentes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="h-[58px] rounded-[22px] border border-[rgba(198,122,69,0.42)] bg-[var(--color-accent)] px-8 text-base font-semibold text-white shadow-[0_18px_38px_rgba(198,122,69,0.28)] hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,black)]"
              >
                <a href="#waitlist">
                  Entrar na waitlist
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                className="h-[58px] rounded-[22px] border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.08)] px-8 text-base text-white hover:bg-[rgba(255,255,255,0.14)]"
                variant="ghost"
              >
                <a href="#como-funciona">Ver como funciona</a>
              </Button>
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-[rgba(15,76,92,0.1)] py-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-2xl border border-[rgba(15,76,92,0.1)] bg-[rgba(15,76,92,0.04)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              {brandName}
            </div>
            <p className="max-w-lg text-sm leading-6 text-[var(--color-text-muted)]">
              O {productName} é um produto da {brandName} para psicólogos autônomos no Brasil.
              Plataforma em desenvolvimento. Acesso por waitlist.
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              &copy; {new Date().getFullYear()} {brandName}. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}

const stageInputClassName =
  "h-[48px] w-full rounded-[18px] border border-[var(--color-border-strong)] bg-white px-4 outline-none transition focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(15,76,92,0.08)]";

function FullViewStage({
  badge,
  children,
  description,
  title
}: {
  badge: string;
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="rounded-[32px] border border-[rgba(15,76,92,0.14)] bg-[rgba(255,253,248,0.96)] p-6 shadow-[0_30px_80px_rgba(15,76,92,0.14)] lg:p-8">
      <div className="max-w-3xl">
        <Badge
          tone="success"
          className="border border-[rgba(63,107,97,0.18)] bg-[rgba(63,107,97,0.14)] px-3 text-[rgba(52,101,88,0.95)]"
        >
          {badge}
        </Badge>
        <h1 className="mt-3 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--color-text)]">
          {title}
        </h1>
        <p className="mt-2 text-base leading-7 text-[var(--color-text-muted)]">{description}</p>
      </div>
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}

function _StageInfoCard({ description, title }: { description: string; title: string }) {
  return (
    <div className="rounded-[26px] border border-[rgba(15,76,92,0.12)] bg-white/82 p-5 shadow-[0_18px_40px_rgba(15,76,92,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
        {title}
      </p>
      <p className="mt-3 text-base leading-8 text-[var(--color-text)]">{description}</p>
    </div>
  );
}

function StageField({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
      {children}
    </label>
  );
}

function _EnrichmentMetric({ description, title }: { description: string; title: string }) {
  return (
    <div className="rounded-[22px] border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}

function getReferrerHost() {
  if (typeof document === "undefined" || !document.referrer) {
    return "";
  }

  try {
    return new URL(document.referrer).host;
  } catch {
    return "";
  }
}

function HeroBullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 py-1">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.12)]">
        <CheckCircle2 className="h-3.5 w-3.5 text-[rgba(255,255,255,0.82)]" />
      </div>
      <p className="text-[15px] leading-7 text-[rgba(255,255,255,0.8)]">{text}</p>
    </div>
  );
}

function HeroValue({
  description,
  eyebrow,
  title
}: {
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="rounded-[24px] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] p-4 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.62)]">
        {eyebrow}
      </p>
      <p className="mt-2 text-lg font-semibold tracking-[-0.02em]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[rgba(255,255,255,0.76)]">{description}</p>
    </div>
  );
}

function HeroMetric({
  detail,
  label,
  value
}: {
  detail: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-[rgba(255,255,255,0.12)] bg-[rgba(7,24,29,0.18)] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(255,255,255,0.54)]">
        {label}
      </p>
      <p className="mt-2 text-[1.65rem] font-semibold leading-none tracking-[-0.04em]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[rgba(255,255,255,0.74)]">{detail}</p>
    </div>
  );
}

function PatientSummaryCard({
  bullets,
  nextStep,
  patientName,
  sessionTime,
  summary
}: {
  bullets: string[];
  nextStep: string;
  patientName: string;
  sessionTime: string;
  summary: string;
}) {
  return (
    <div className="rounded-[26px] border border-[rgba(255,255,255,0.12)] bg-[rgba(7,24,29,0.2)] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(255,255,255,0.54)]">
            Resumo da última sessão
          </p>
          <p className="mt-2 text-lg font-semibold tracking-[-0.02em]">
            {patientName}, {sessionTime}
          </p>
        </div>
        <div className="rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.08)] px-3 py-1 text-xs font-semibold text-[rgba(255,255,255,0.72)]">
          Próxima sessão
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-[rgba(255,255,255,0.76)]">{summary}</p>

      <div className="mt-4 grid gap-2.5">
        {bullets.map((bullet) => (
          <div
            className="rounded-[18px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)] px-3.5 py-3 text-sm leading-6 text-[rgba(255,255,255,0.82)]"
            key={bullet}
          >
            {bullet}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[rgba(7,24,29,0.16)] p-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(255,255,255,0.54)]">
          Ponto para retomar
        </p>
        <p className="mt-2 text-sm leading-6 text-[rgba(255,255,255,0.82)]">{nextStep}</p>
      </div>
    </div>
  );
}

function HeroQueueCard({
  description,
  eyebrow,
  items,
  title
}: {
  description: string;
  eyebrow: string;
  items: string[];
  title: string;
}) {
  return (
    <div className="rounded-[24px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.08)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(255,255,255,0.54)]">
        {eyebrow}
      </p>
      <p className="mt-2 text-lg font-semibold tracking-[-0.02em]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[rgba(255,255,255,0.74)]">{description}</p>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <div
            className="rounded-[18px] border border-[rgba(255,255,255,0.1)] bg-[rgba(7,24,29,0.16)] px-3 py-2.5 text-sm leading-6 text-[rgba(255,255,255,0.8)]"
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function TrustCard({ description, icon, title }: { description: string; icon: React.ReactNode; title: string }) {
  return (
    <div className="rounded-[28px] border border-[rgba(15,76,92,0.12)] border-l-[3px] border-l-[rgba(63,107,97,0.4)] bg-[rgba(255,253,248,0.78)] p-5 shadow-[0_18px_40px_rgba(15,76,92,0.06)]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(63,107,97,0.08)] text-[rgba(63,107,97,0.7)]">
        {icon}
      </div>
      <p className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-text)]">{title}</p>
      <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}

function MiniSignal({
  description,
  eyebrow,
  title
}: {
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="h-fit rounded-[24px] border border-[rgba(255,255,255,0.14)] bg-[rgba(7,24,29,0.18)] p-4 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(255,255,255,0.54)]">
        {eyebrow}
      </p>
      <p className="mt-2 text-lg font-semibold tracking-[-0.02em]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[rgba(255,255,255,0.76)]">{description}</p>
    </div>
  );
}

function ProblemCard({ description, icon, title }: { description: string; icon: React.ReactNode; title: string }) {
  return (
    <Card className="border-[rgba(178,74,58,0.14)] bg-[rgba(255,253,248,0.9)] border-l-[3px] border-l-[rgba(178,74,58,0.4)]">
      <CardHeader className="gap-3 pb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(178,74,58,0.08)] text-[rgba(178,74,58,0.65)]">
          {icon}
        </div>
        <p className="text-2xl font-semibold tracking-[-0.03em]">{title}</p>
      </CardHeader>
      <CardContent className="pt-0 pb-6">
        <p className="text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
      </CardContent>
    </Card>
  );
}

function PlatformCard({ description, icon, title }: { description: string; icon: React.ReactNode; title: string }) {
  return (
    <div className="rounded-[28px] border border-[var(--color-border)] border-l-[3px] border-l-[rgba(15,76,92,0.4)] bg-[rgba(255,255,255,0.72)] p-5 shadow-[0_18px_40px_rgba(15,76,92,0.06)]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(15,76,92,0.08)] text-[var(--color-primary)]">
        {icon}
      </div>
      <p className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-text)]">{title}</p>
      <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}

function DeepDiveCard({
  badge,
  bullets,
  description,
  signal,
  title
}: {
  badge: string;
  bullets: string[];
  description: string;
  signal: string;
  title: string;
}) {
  return (
    <Card className="overflow-hidden border-[rgba(15,76,92,0.14)] bg-[rgba(255,253,248,0.94)] shadow-[0_22px_50px_rgba(15,76,92,0.08)]">
      <CardHeader className="gap-4 border-b border-[var(--color-border)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge tone="info" className="w-fit px-3">
            {badge}
          </Badge>
          <div className="rounded-full border border-[rgba(15,76,92,0.12)] bg-[rgba(15,76,92,0.04)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
            {signal}
          </div>
        </div>
        <p className="text-[2rem] font-semibold leading-[1.04] tracking-[-0.04em]">{title}</p>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
        <div className="mt-5 grid gap-2">
          {bullets.map((bullet) => (
            <div className="flex items-start gap-3" key={bullet}>
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(15,76,92,0.08)]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-primary)]" />
              </div>
              <p className="text-sm leading-7 text-[var(--color-text)]">{bullet}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RiskCard({ description, icon, title }: { description: string; icon: React.ReactNode; title: string }) {
  return (
    <div className="rounded-[28px] border border-[rgba(15,76,92,0.12)] border-l-[3px] border-l-[rgba(15,76,92,0.35)] bg-[rgba(255,253,248,0.82)] p-5 shadow-[0_18px_40px_rgba(15,76,92,0.06)]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(15,76,92,0.06)] text-[var(--color-primary)]">
        {icon}
      </div>
      <p className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-text)]">{title}</p>
      <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}

function FitPoint({ description, icon, title }: { description: string; icon: React.ReactNode; title: string }) {
  return (
    <div className="rounded-[24px] border border-[var(--color-border)] border-l-[3px] border-l-[rgba(198,122,69,0.45)] bg-[rgba(15,76,92,0.03)] p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(198,122,69,0.1)] text-[var(--color-accent)]">
        {icon}
      </div>
      <p className="text-lg font-semibold tracking-[-0.02em]">{title}</p>
      <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}

function FaqCard({ answer, question }: { answer: string; question: string }) {
  return (
    <details className="group rounded-[28px] border border-[rgba(15,76,92,0.14)] bg-[rgba(255,253,248,0.92)] shadow-[0_8px_24px_rgba(15,76,92,0.04)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
        <p className="text-lg font-semibold leading-[1.2] tracking-[-0.02em]">{question}</p>
        <ChevronDown className="h-5 w-5 shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="px-6 pb-6 pt-0">
        <p className="text-sm leading-7 text-[var(--color-text-muted)]">{answer}</p>
      </div>
    </details>
  );
}
