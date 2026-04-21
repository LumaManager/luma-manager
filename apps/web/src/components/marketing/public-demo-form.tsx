"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";

import { Button, Card, CardContent, CardHeader } from "@terapia/ui";

import { trackFormStart, trackGenerateLead } from "@/lib/analytics/gtag";

const inputClassName =
  "h-[50px] w-full rounded-[18px] border border-[var(--color-border-strong)] bg-[rgba(255,251,244,0.96)] px-4 text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(15,76,92,0.08)]";

const textareaClassName =
  "min-h-[120px] w-full rounded-[18px] border border-[var(--color-border-strong)] bg-[rgba(255,251,244,0.96)] px-4 py-3 text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(15,76,92,0.08)]";

export function PublicDemoForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [clinicType, setClinicType] = useState("consultorio");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const hasTrackedFormStartRef = useRef(false);

  function handleFormStart() {
    if (hasTrackedFormStartRef.current) {
      return;
    }

    hasTrackedFormStartRef.current = true;
    trackFormStart({
      formName: "demo_request",
      formVariant: "public",
      sourcePath: "/solicitar-demo"
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = encodeURIComponent("Solicitação de demo - Luma Manager");
    const body = encodeURIComponent(
      [
        `Nome: ${fullName}`,
        `E-mail: ${email}`,
        `Perfil: ${clinicType}`,
        "",
        "Mensagem:",
        message || "Gostaria de ver o produto funcionando em um caso parecido com o meu."
      ].join("\n")
    );

    trackGenerateLead({
      leadType: "demo_request",
      sourcePath: "/solicitar-demo",
      professionalRole: clinicType
    });

    setSubmitted(true);
    window.location.href = `mailto:contato@lumamanager.com.br?subject=${subject}&body=${body}`;
  }

  return (
    <Card className="overflow-hidden border-[rgba(255,255,255,0.14)] bg-[rgba(255,253,248,0.98)] shadow-[0_22px_60px_rgba(7,24,29,0.26)] backdrop-blur">
      <CardHeader className="border-b border-[rgba(15,76,92,0.1)] bg-[linear-gradient(180deg,rgba(255,250,242,0.68)_0%,rgba(251,244,234,0.24)_100%)] px-6 pb-5 pt-6">
        <p className="text-[1.45rem] font-semibold tracking-[-0.03em] text-[var(--color-text)]">
          Solicitar demo
        </p>
        <p className="text-sm leading-6 text-[var(--color-text-muted)]">
          Conte o seu cenário. A resposta volta por e-mail para agendarmos uma conversa curta.
        </p>
      </CardHeader>

      <CardContent className="px-6 py-6">
        <form className="space-y-4" onFocusCapture={handleFormStart} onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome completo">
              <input
                className={inputClassName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Seu nome"
                required
                value={fullName}
              />
            </Field>
            <Field label="E-mail profissional">
              <input
                className={inputClassName}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@consultorio.com.br"
                required
                type="email"
                value={email}
              />
            </Field>
          </div>

          <Field label="Tipo de operação">
            <select
              className={inputClassName}
              onChange={(event) => setClinicType(event.target.value)}
              value={clinicType}
            >
              <option value="consultorio">Consultório solo</option>
              <option value="clinica-pequena">Clínica pequena</option>
              <option value="multiplos-profissionais">Múltiplos profissionais</option>
              <option value="operacao">Operação / administrativo</option>
            </select>
          </Field>

          <Field label="O que você quer ver na demo?">
            <textarea
              className={textareaClassName}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ex.: agenda, prontuário, documentos, segurança, migração ou fluxo do pós-sessão."
              value={message}
            />
          </Field>

          <div className="flex flex-wrap items-center gap-3">
            <Button className="h-[48px] rounded-[18px] px-5 text-sm" type="submit">
              {submitted ? "Abrindo e-mail..." : "Solicitar demo"}
            </Button>
            <p className="text-xs leading-5 text-[var(--color-text-muted)]">
              Ao enviar, seu app de e-mail será aberto com a solicitação pronta.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  children,
  label
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[13px] font-medium text-[var(--color-text)]">{label}</span>
      {children}
    </label>
  );
}
