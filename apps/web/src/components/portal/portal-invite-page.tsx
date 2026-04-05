"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { PortalInvite } from "@terapia/contracts";
import { Badge, Button, Card, CardContent, CardHeader } from "@terapia/ui";

export function PortalInvitePage({ invite }: { invite: PortalInvite }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("Maria Souza");
  const [email, setEmail] = useState("maria.souza@email.com");
  const [phone, setPhone] = useState("(11) 99871-2204");
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/portal/invite/${invite.inviteToken}/accept`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fullName,
            email,
            phone,
            acceptedTerms,
            acceptedPrivacy
          })
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { message?: string } | null;
          throw new Error(payload?.message ?? "Não foi possível ativar o portal.");
        }

        const payload = (await response.json()) as { redirectTo: string };
        router.push(payload.redirectTo);
        router.refresh();
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Erro inesperado no convite.");
      }
    });
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7e9_0%,#f5efe5_42%,#efe8dd_100%)] px-6 py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_minmax(380px,520px)]">
        <section className="rounded-[36px] border border-[rgba(22,42,56,0.08)] bg-white/88 p-8 shadow-[0_28px_70px_rgba(38,48,58,0.08)] lg:p-10">
          <div className="flex items-center gap-3">
            <Badge tone="info">Convite do portal</Badge>
            <Badge tone="neutral">{invite.expiresAtLabel}</Badge>
          </div>

          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.03em]">
            {invite.patientFirstName}, este é o seu acesso operacional para sessão, documentos e pagamento.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-text-muted)]">
            O portal foi desenhado para ser simples: revisar seus dados, assinar o que for obrigatório
            e entrar na sessão sem expor conteúdo clínico.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {invite.checklist.map((item) => (
              <Card key={item.id} className="border-[rgba(22,42,56,0.08)] bg-[rgba(255,249,242,0.88)]">
                <CardHeader className="pb-3">
                  <p className="text-sm font-semibold">{item.label}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-[var(--color-text-muted)]">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 rounded-[28px] border border-dashed border-[rgba(22,42,56,0.16)] bg-[rgba(10,66,84,0.04)] p-5">
            <p className="text-sm font-semibold">Resumo deste convite</p>
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">{invite.practiceName}</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">Terapeuta: {invite.therapistName}</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{invite.appointmentDateLabel}</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{invite.modalityLabel}</p>
          </div>
        </section>

        <Card className="border-[rgba(22,42,56,0.08)] bg-white/92 shadow-[0_28px_70px_rgba(38,48,58,0.08)]">
          <CardHeader className="border-b border-[rgba(22,42,56,0.08)] pb-5">
            <p className="text-2xl font-semibold">Ativar acesso</p>
            <p className="text-sm leading-6 text-[var(--color-text-muted)]">
              Confirme seus dados básicos para abrir o portal do paciente em modo web-first.
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <Field label="Nome completo" value={fullName} onChange={setFullName} />
              <Field label="E-mail" type="email" value={email} onChange={setEmail} />
              <Field label="Telefone" value={phone} onChange={setPhone} />

              <label className="flex items-start gap-3 rounded-2xl border border-[rgba(22,42,56,0.08)] bg-[rgba(10,66,84,0.04)] p-4 text-sm text-[var(--color-text-muted)]">
                <input checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} type="checkbox" />
                Confirmo o aceite do atendimento remoto e dos fluxos operacionais do portal.
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-[rgba(22,42,56,0.08)] bg-[rgba(10,66,84,0.04)] p-4 text-sm text-[var(--color-text-muted)]">
                <input checked={acceptedPrivacy} onChange={(event) => setAcceptedPrivacy(event.target.checked)} type="checkbox" />
                Confirmo a política de privacidade, comunicação e descarte do bruto conforme a operação atual.
              </label>

              {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}

              <Button className="w-full" disabled={isPending} type="submit">
                {isPending ? "Ativando portal..." : "Ativar portal do paciente"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Field({
  label,
  onChange,
  type = "text",
  value
}: {
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <input
        className="h-12 w-full rounded-2xl border border-[rgba(22,42,56,0.14)] bg-white px-4 outline-none transition focus:border-[var(--color-primary)]"
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </label>
  );
}
