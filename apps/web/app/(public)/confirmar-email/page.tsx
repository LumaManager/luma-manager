import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

import { Button } from "@terapia/ui";
import { noindexMetadata } from "@/lib/marketing/seo-config";
import { apiFetch } from "@/lib/api/client";

export const metadata: Metadata = {
  ...noindexMetadata,
  title: "Confirmação de e-mail | Luma Manager"
};

export default async function ConfirmarEmailPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return <Result success={false} message="Link inválido. Nenhum token encontrado." />;
  }

  try {
    await apiFetch(`/v1/auth/verify-email?token=${encodeURIComponent(token)}`);
    return <Result success={true} message="Seu e-mail foi confirmado com sucesso!" />;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Link inválido ou expirado.";
    return <Result success={false} message={message} />;
  }
}

function Result({ success, message }: { success: boolean; message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8f3e8_0%,#f4ede2_100%)] px-4">
      <div className="w-full max-w-md rounded-[32px] border border-[rgba(15,76,92,0.1)] bg-[rgba(250,246,239,0.98)] p-8 shadow-[0_16px_48px_rgba(15,76,92,0.12)] text-center">

        <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${success ? "bg-green-50" : "bg-red-50"}`}>
          {success
            ? <CheckCircle aria-hidden="true" className="h-9 w-9 text-green-500" />
            : <XCircle    aria-hidden="true" className="h-9 w-9 text-red-400" />
          }
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-[#0f4c5c]">
          {success ? "E-mail confirmado!" : "Ops, algo deu errado"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#5a6a72]">{message}</p>

        <div className="mt-8">
          {success ? (
            <Button asChild className="w-full">
              <Link href="/login">Fazer login</Link>
            </Button>
          ) : (
            <Button asChild variant="secondary" className="w-full">
              <Link href="/verificar-email">Reenviar link de confirmação</Link>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
