// apps/web/app/(public)/cadastro/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Check, FileText, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader } from "@terapia/ui";
import { getSessionToken } from "@/lib/auth/session";
import { noindexMetadata } from "@/lib/marketing/seo-config";

import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  ...noindexMetadata,
  title: "Criar conta | Luma Manager",
  description: "Crie sua conta no Luma Manager e comece a organizar sua prática."
};

export default async function CadastroPage() {
  const sessionToken = await getSessionToken();
  if (sessionToken) redirect("/app/dashboard");

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(198,122,69,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(15,76,92,0.16),transparent_30%),linear-gradient(180deg,#f8f3e8_0%,#f4ede2_100%)] px-2 py-5 lg:px-3 lg:py-6">
      <div className="mx-auto w-full max-w-[1900px]">
        <section className="relative overflow-hidden rounded-[40px] border border-[rgba(15,76,92,0.14)] bg-[linear-gradient(145deg,#103a45_0%,#0f4c5c_42%,#164d59_100%)] p-8 pb-11 text-white shadow-[0_30px_80px_rgba(15,76,92,0.24)] lg:p-10 lg:pb-16">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.1)_28%,rgba(255,255,255,0.04)_46%,rgba(255,255,255,0)_74%)] opacity-90" />
          <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-[rgba(255,255,255,0.08)] blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[rgba(198,122,69,0.16)] blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2.5">
              <Image src="/icon.svg" alt="Luma" width={26} height={26} className="rounded-lg" />
              <span className="text-base font-semibold tracking-[-0.03em] text-white">Luma</span>
            </div>

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,480px)]">
              {/* Left — copy */}
              <div className="flex flex-col justify-between gap-10 lg:min-h-[560px]">
                <div>
                  <h1 className="max-w-[16ch] text-[clamp(2.8rem,4.1vw,4.8rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
                    Comece a organizar sua prática.
                  </h1>
                  <p className="mt-5 max-w-lg text-[17px] leading-8 text-[rgba(255,255,255,0.78)]">
                    Agenda, prontuários e cobranças num só lugar. Sem configuração complicada.
                  </p>

                  <ul className="mt-7 grid gap-3">
                    <Bullet text="Veja sua agenda do dia e o histórico de cada paciente antes de entrar na sessão." />
                    <Bullet text="Registre a nota clínica logo depois — sem acumular para o fim do dia." />
                    <Bullet text="Acompanhe cobranças, pagamentos e pendências num painel só." />
                  </ul>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <FeaturePanel icon={CalendarDays} title="Sua agenda"     description="Sessões do dia organizadas, em ordem." />
                  <FeaturePanel icon={FileText}     title="Seus pacientes" description="Histórico acessível a qualquer momento." />
                  <FeaturePanel icon={Wallet}       title="Suas cobranças" description="O que foi pago e o que está pendente." />
                </div>
              </div>

              {/* Right — form card */}
              <Card className="overflow-hidden rounded-[32px] border-[rgba(255,255,255,0.14)] bg-[rgba(250,246,239,0.98)] text-[var(--color-text)] shadow-[0_22px_60px_rgba(7,24,29,0.28)] backdrop-blur">
                <CardHeader className="gap-2 border-b border-[rgba(15,76,92,0.1)] bg-[linear-gradient(180deg,rgba(255,250,242,0.68)_0%,rgba(251,244,234,0.24)_100%)] px-6 pb-5 pt-6">
                  <p className="text-[1.6rem] font-semibold tracking-[-0.03em]">Crie sua conta</p>
                  <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                    Preencha os dados para começar.
                  </p>
                </CardHeader>
                <CardContent className="px-6 py-7">
                  <RegisterForm />
                  <p className="mt-7 text-center text-sm text-[var(--color-text-muted)]">
                    Já tem conta?{" "}
                    <Link href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
                      Entrar
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.14)]">
        <Check className="h-3 w-3 text-white" />
      </div>
      <span className="text-[15px] leading-7 text-[rgba(255,255,255,0.78)]">{text}</span>
    </li>
  );
}

function FeaturePanel({ description, icon: Icon, title }: { description: string; icon: React.ElementType; title: string }) {
  return (
    <div className="rounded-[22px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.07)] p-4 backdrop-blur">
      <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[rgba(255,255,255,0.14)]">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <p className="mt-3 text-sm font-semibold tracking-[-0.01em]">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[rgba(255,255,255,0.62)]">{description}</p>
    </div>
  );
}
