import type { Metadata } from "next";
import Link from "next/link";

import { noindexMetadata } from "@/lib/marketing/seo-config";
import { ResendButton } from "./resend-button";

export const metadata: Metadata = {
  ...noindexMetadata,
  title: "Verifique seu e-mail | Luma Manager"
};

export default async function VerificarEmailPage({
  searchParams
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams;
  const decodedEmail = email ? decodeURIComponent(email) : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8f3e8_0%,#f4ede2_100%)] px-4">
      <div className="w-full max-w-md rounded-[32px] border border-[rgba(15,76,92,0.1)] bg-[rgba(250,246,239,0.98)] p-8 shadow-[0_16px_48px_rgba(15,76,92,0.12)] text-center">

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(15,76,92,0.08)]">
          <svg className="h-8 w-8 text-[#0f4c5c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-[#0f4c5c]">
          Verifique sua caixa de entrada
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#5a6a72]">
          Enviamos um link de confirmação para{" "}
          {decodedEmail ? (
            <strong className="text-[#0f4c5c]">{decodedEmail}</strong>
          ) : (
            "seu e-mail"
          )}
          . Clique nele para ativar sua conta.
        </p>

        <div className="mt-4 rounded-lg bg-[rgba(15,76,92,0.06)] px-4 py-3 text-xs text-[#5a6a72]">
          Não encontrou? Verifique a pasta de spam.
        </div>

        {decodedEmail && (
          <div className="mt-6">
            <ResendButton email={decodedEmail} />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 text-sm text-[#5a6a72]">
          <Link href="/login" className="hover:text-[#0f4c5c] hover:underline">
            Já confirmei — fazer login
          </Link>
          <Link href="/cadastro" className="hover:text-[#0f4c5c] hover:underline">
            Errei o e-mail — cadastrar novamente
          </Link>
        </div>
      </div>
    </main>
  );
}
