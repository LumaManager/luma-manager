"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { AppointmentCall } from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader, cn } from "@terapia/ui";
import {
  Camera,
  CameraOff,
  Clock3,
  Link2,
  Mic,
  MicOff,
  PhoneOff,
  RefreshCcw,
  ShieldCheck,
  Video
} from "lucide-react";

type AppointmentCallPageProps = {
  initialCall: AppointmentCall;
};

export function AppointmentCallPageView({ initialCall }: AppointmentCallPageProps) {
  const [call, setCall] = useState(initialCall);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [camera, setCamera] = useState(initialCall.devices.availableCameras[0] ?? "");
  const [microphone, setMicrophone] = useState(initialCall.devices.availableMicrophones[0] ?? "");
  const [enteredAt, setEnteredAt] = useState<number | null>(
    initialCall.participants.therapistJoined ? Date.now() : null
  );
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isBusy, setIsBusy] = useState<null | "room" | "check-in" | "end">(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState(call.connection);

  useEffect(() => {
    if (!enteredAt || !call.participants.therapistJoined) {
      setElapsedMs(0);
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedMs(Date.now() - enteredAt);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [call.participants.therapistJoined, enteredAt]);

  const isLiveSurface =
    call.experienceState === "live" ||
    call.experienceState === "waiting_patient" ||
    call.experienceState === "reconnecting";

  const readinessTone = useMemo(() => {
    if (call.readiness.outcome === "blocked") return "critical";
    if (call.readiness.outcome === "attention") return "warning";
    return "success";
  }, [call.readiness.outcome]);

  async function runAction(action: "room" | "check-in" | "end") {
    setIsBusy(action);
    setError(null);

    const endpointMap = {
      room: `/api/appointments/${call.appointment.id}/room`,
      "check-in": `/api/appointments/${call.appointment.id}/check-in`,
      end: `/api/appointments/${call.appointment.id}/end-session`
    } as const;

    const response = await fetch(endpointMap[action], {
      method: "POST"
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(payload?.message ?? "Não foi possível concluir a ação agora.");
      setIsBusy(null);
      return;
    }

    const nextCall = (await response.json()) as AppointmentCall;
    setCall(nextCall);
    setConnectionState(nextCall.connection);

    if (action === "check-in") {
      setEnteredAt(Date.now());
    }

    if (action === "end") {
      setEnteredAt(null);
    }

    setIsBusy(null);
  }

  function simulateReconnect() {
    setConnectionState({
      state: "reconnecting",
      label: "Reconectando",
      description: "Tentando restabelecer a conexão automaticamente."
    });

    window.setTimeout(() => {
      setConnectionState({
        state: "stable",
        label: "Conexão estável",
        description: "A chamada voltou sem perda operacional."
      });
    }, 1800);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-[var(--color-border)] bg-[rgba(255,253,248,0.82)] p-7 shadow-[var(--shadow-panel)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="info">Teleatendimento web</Badge>
              <Badge tone={readinessTone}>{call.experienceLabel}</Badge>
              <Badge tone={call.transcript.state === "active" ? "success" : "warning"}>
                {call.transcript.label}
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.02em]">
              {call.appointment.patientName} · {call.appointment.timeRangeLabel}
            </h1>
            <p className="mt-3 text-base leading-7 text-[var(--color-text-muted)]">
              {call.appointment.dateLabel} · {call.appointment.durationLabel}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href={call.appointment.detailHref}>Voltar ao detalhe</Link>
            </Button>
            <Button
              disabled={isBusy !== null || !call.callPermissions.canEndSession}
              onClick={() => runAction("end")}
              type="button"
              variant="ghost"
            >
              <PhoneOff className="h-4 w-4" />
              Encerrar atendimento
            </Button>
          </div>
        </div>
      </section>

      {isLiveSurface ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <section className="rounded-[32px] bg-[#0f2730] p-6 text-white shadow-[0_24px_70px_rgba(15,76,92,0.18)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="info">{connectionState.label}</Badge>
                  <Badge tone={call.transcript.state === "active" ? "success" : "warning"}>
                    {call.transcript.label}
                  </Badge>
                  <Badge tone="neutral">{formatElapsed(elapsedMs)}</Badge>
                </div>
                <p className="text-sm text-white/72">{call.participants.patientLabel}</p>
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-[1.45fr_0.55fr]">
                <VideoPanel
                  isRemote
                  state={call.participants.patientPresence}
                  title={call.appointment.patientName}
                />
                <VideoPanel
                  isCameraOn={isCameraOn}
                  title="Você"
                />
              </div>
            </section>

            <section className="flex flex-wrap items-center gap-3 rounded-[32px] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-panel)]">
              <ControlButton
                active={isMicOn}
                icon={isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                label={isMicOn ? "Microfone ligado" : "Microfone desligado"}
                onClick={() => setIsMicOn((current) => !current)}
              />
              <ControlButton
                active={isCameraOn}
                icon={isCameraOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                label={isCameraOn ? "Camera ligada" : "Câmera desligada"}
                onClick={() => setIsCameraOn((current) => !current)}
              />
              <ControlButton
                active
                icon={<RefreshCcw className="h-4 w-4" />}
                label="Simular reconexão"
                onClick={simulateReconnect}
              />
              <ControlButton
                active
                icon={<Link2 className="h-4 w-4" />}
                label={call.roomSummary.joinUrlLabel}
                onClick={async () => {
                  await navigator.clipboard.writeText(call.roomSummary.joinUrlLabel).catch(() => undefined);
                }}
              />
            </section>
          </div>

          <div className="space-y-4">
            <CallReadinessCard call={call} />
            <SidePanelCard call={call} />
            {error ? <ErrorCard message={error} /> : null}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-lg font-semibold">Pré-entrada</p>
              </div>
              <p className="text-sm text-[var(--color-text-muted)]">
                Resumo da sessão, prontidão, dispositivos e transcript antes da entrada.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <PreviewCard cameraEnabled={isCameraOn} />
                <div className="space-y-4">
                  <SelectField
                    label="Câmera"
                    onChange={setCamera}
                    options={call.devices.availableCameras}
                    value={camera}
                  />
                  <SelectField
                    label="Microfone"
                    onChange={setMicrophone}
                    options={call.devices.availableMicrophones}
                    value={microphone}
                  />
                  <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4">
                    <p className="text-sm font-semibold">Nível do microfone</p>
                    <div className="mt-3 flex items-end gap-1">
                      {[18, 26, 38, call.devices.microphoneLevel, 52].map((value, index) => (
                        <span
                          className="w-2 rounded-full bg-[var(--color-primary)]"
                          key={`${value}-${index}`}
                          style={{ height: `${Math.max(12, value)}px`, opacity: index >= 3 && !isMicOn ? 0.2 : 1 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <CallReadinessCard call={call} />

              <div className="grid gap-4 md:grid-cols-2">
                <StatusCard
                  description={call.transcript.description}
                  title="Status de transcript"
                  tone={call.transcript.state === "active" ? "success" : "warning"}
                />
                <StatusCard
                  description={`${call.joinWindow.therapistOpensAtLabel} terapeuta · ${call.joinWindow.patientOpensAtLabel} paciente`}
                  title="Janela de entrada"
                  tone={call.joinWindow.canJoinNow ? "info" : "critical"}
                />
              </div>

              {error ? <ErrorCard message={error} /> : null}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <SidePanelCard call={call} />
            <Card>
              <CardHeader>
                <p className="text-lg font-semibold">Ações da chamada</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  disabled={isBusy !== null || !call.callPermissions.canProvisionRoom}
                  onClick={() => runAction("room")}
                  type="button"
                  variant="secondary"
                >
                  <Video className="h-4 w-4" />
                  Preparar sala
                </Button>
                <Button
                  className="w-full"
                  disabled={isBusy !== null || !call.callPermissions.canCheckIn}
                  onClick={() => runAction("check-in")}
                  type="button"
                >
                  Entrar agora
                </Button>
                <Button asChild className="w-full" variant="ghost">
                  <Link href={call.appointment.detailHref}>Voltar ao detalhe</Link>
                </Button>
              </CardContent>
            </Card>

            {call.notices.map((notice) => (
              <Card key={notice.id}>
                <CardHeader>
                  <Badge tone={notice.tone}>{notice.title}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                    {notice.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CallReadinessCard({ call }: { call: AppointmentCall }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          <p className="text-lg font-semibold">Status de prontidão</p>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">
          {call.readiness.outcome === "ready"
            ? "Pronto para entrar"
            : call.readiness.outcome === "attention"
              ? "Atenção necessária"
              : "Bloqueado"}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {call.readiness.items.map((item) => (
          <div
            className="rounded-3xl border border-[var(--color-border)] bg-[rgba(15,76,92,0.03)] p-4"
            key={item.label}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">{item.label}</p>
              <Badge tone={item.state === "ok" ? "success" : item.state === "attention" ? "warning" : "critical"}>
                {item.state === "ok" ? "OK" : item.state === "attention" ? "Atenção" : "Bloqueado"}
              </Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{item.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SidePanelCard({ call }: { call: AppointmentCall }) {
  return (
    <Card>
      <CardHeader>
        <p className="text-lg font-semibold">Painel rápido</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {call.sidePanel.map((item) => (
          <div
            className="rounded-3xl border border-[var(--color-border)] bg-white p-4"
            key={item.label}
          >
            <p className="text-sm font-semibold">{item.label}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{item.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PreviewCard({ cameraEnabled }: { cameraEnabled: boolean }) {
  return (
    <div className="rounded-[28px] bg-[#102a33] p-5 text-white">
      <p className="text-sm font-semibold">Preview local</p>
      <div className="mt-4 flex min-h-[220px] items-center justify-center rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]">
        {cameraEnabled ? (
          <div className="text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-white/10" />
            <p className="mt-4 text-sm text-white/74">Câmera pronta para entrar</p>
          </div>
        ) : (
          <div className="text-center">
            <CameraOff className="mx-auto h-10 w-10 text-white/70" />
            <p className="mt-4 text-sm text-white/74">Entrar sem câmera</p>
          </div>
        )}
      </div>
    </div>
  );
}

function VideoPanel({
  isCameraOn = true,
  isRemote = false,
  state = "joined",
  title
}: {
  isCameraOn?: boolean;
  isRemote?: boolean;
  state?: AppointmentCall["participants"]["patientPresence"];
  title: string;
}) {
  const isWaiting = isRemote && (state === "absent" || state === "waiting_room");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/10",
        isRemote ? "min-h-[420px]" : "min-h-[220px]"
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(66,164,175,0.22),rgba(15,27,32,0.96))]" />
      <div className="relative flex h-full flex-col justify-between p-5">
        <Badge tone={isRemote ? "info" : "neutral"}>{title}</Badge>
        <div className="flex flex-1 items-center justify-center">
          {isWaiting ? (
            <div className="text-center">
              <Clock3 className="mx-auto h-10 w-10 text-white/70" />
              <p className="mt-4 text-sm text-white/74">
                {state === "waiting_room" ? "Paciente aguardando na waiting room" : "Paciente ainda não entrou"}
              </p>
            </div>
          ) : isCameraOn ? (
            <div className="h-28 w-28 rounded-full bg-white/10" />
          ) : (
            <div className="text-center">
              <CameraOff className="mx-auto h-10 w-10 text-white/70" />
              <p className="mt-4 text-sm text-white/74">Câmera desligada</p>
            </div>
          )}
        </div>
      </div>
    </div>
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
  options: string[];
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
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ControlButton({
  active,
  icon,
  label,
  onClick
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "inline-flex h-12 items-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition",
        active
          ? "border-[var(--color-border-strong)] bg-[rgba(15,76,92,0.06)] text-[var(--color-primary)]"
          : "border-[var(--color-border)] bg-white text-[var(--color-text-muted)]"
      )}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

function StatusCard({
  description,
  title,
  tone
}: {
  description: string;
  title: string;
  tone: "success" | "warning" | "info" | "critical";
}) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-white p-4">
      <Badge tone={tone}>{title}</Badge>
      <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <Card>
      <CardHeader>
        <Badge tone="critical">Falha operacional</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-[var(--color-danger)]">{message}</p>
      </CardContent>
    </Card>
  );
}

function formatElapsed(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
