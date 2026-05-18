"use client";

import { useEffect, useState } from "react";
import type { ConsentDocumentPublic, ConsentSignResponse } from "@terapia/contracts";

type PageState =
  | { type: "loading" }
  | { type: "ready"; doc: ConsentDocumentPublic }
  | { type: "already_signed"; doc: ConsentDocumentPublic }
  | { type: "expired" }
  | { type: "success"; signedAt: string }
  | { type: "error"; message: string };

export function ConsentPage({ token }: { token: string }) {
  const [state, setState] = useState<PageState>({ type: "loading" });
  const [signerName, setSignerName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/public/consent/${token}`);
        if (!res.ok) {
          setState({ type: "expired" });
          return;
        }
        const doc = (await res.json()) as ConsentDocumentPublic;
        if (doc.status === "signed") {
          setState({ type: "already_signed", doc });
        } else if (doc.status === "expired" || doc.status === "revoked") {
          setState({ type: "expired" });
        } else {
          setState({ type: "ready", doc });
        }
      } catch {
        setState({ type: "error", message: "Não foi possível carregar o documento." });
      }
    })();
  }, [token]);

  async function handleSign() {
    if (state.type !== "ready" || !agreed || !signerName.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/public/consent/${token}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signerName: signerName.trim() })
      });
      const result = (await res.json()) as ConsentSignResponse;
      if (result.success) {
        setState({ type: "success", signedAt: result.signedAt });
      } else {
        setState({ type: "error", message: "Não foi possível registrar a assinatura." });
      }
    } catch {
      setState({ type: "error", message: "Erro ao enviar. Tente novamente." });
    } finally {
      setSubmitting(false);
    }
  }

  if (state.type === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Carregando documento…</p>
      </main>
    );
  }

  if (state.type === "expired") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-3">Link expirado</h1>
          <p className="text-gray-600">
            Este link de consentimento não está mais disponível. Solicite ao seu terapeuta um novo link.
          </p>
        </div>
      </main>
    );
  }

  if (state.type === "already_signed") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow text-center">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-3">Consentimento já registrado</h1>
          <p className="text-gray-600">
            Você já autorizou a gravação e transcrição de sessões com {state.doc.therapistName}.
          </p>
        </div>
      </main>
    );
  }

  if (state.type === "success") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow text-center">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-3">Autorização registrada</h1>
          <p className="text-gray-600">
            Sua autorização foi registrada com sucesso. As sessões poderão ser gravadas e transcritas para apoio clínico.
          </p>
        </div>
      </main>
    );
  }

  if (state.type === "error") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-3">Erro</h1>
          <p className="text-gray-600">{state.message}</p>
        </div>
      </main>
    );
  }

  const { doc } = state;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow p-8">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Autorização de Gravação e Transcrição
            </h1>
            <p className="text-sm text-gray-500">
              Terapeuta: <span className="font-medium text-gray-700">{doc.therapistName}</span>
              {" · "}
              Válido até: <span className="font-medium text-gray-700">{new Date(doc.expiresAt).toLocaleDateString("pt-BR")}</span>
            </p>
          </div>

          <div className="prose prose-sm text-gray-700 mb-8 space-y-4">
            <p>
              Olá, <strong>{doc.patientName}</strong>. Seu terapeuta solicita sua autorização para
              gravar e transcrever as sessões de psicoterapia realizadas por videoconferência.
            </p>
            <p>
              <strong>O que será gravado:</strong> Áudio e vídeo das sessões de teleatendimento,
              quando você e seu terapeuta estiverem conectados.
            </p>
            <p>
              <strong>Finalidade:</strong> Produção de transcrição automática para apoio ao registro
              clínico do terapeuta. O conteúdo não será usado para treinamento de IA nem
              compartilhado com terceiros sem sua autorização explícita.
            </p>
            <p>
              <strong>Segurança:</strong> O arquivo de áudio é processado e excluído do servidor
              imediatamente após a transcrição. Apenas o texto da transcrição, após revisão e
              aprovação do terapeuta, pode integrar o prontuário.
            </p>
            <p>
              <strong>Revogação:</strong> Você pode revogar esta autorização a qualquer momento
              comunicando seu terapeuta. A revogação não afeta sessões já realizadas.
            </p>
            <p>
              Este termo está em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei
              nº 13.709/2018) e com as resoluções do Conselho Federal de Psicologia.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="signerName" className="block text-sm font-medium text-gray-700 mb-1">
                Seu nome completo (para registro)
              </label>
              <input
                id="signerName"
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Digite seu nome completo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Li e concordo com os termos acima. Autorizo a gravação e transcrição das minhas
                sessões de psicoterapia por videoconferência.
              </span>
            </label>

            <button
              onClick={handleSign}
              disabled={!agreed || !signerName.trim() || submitting}
              className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Registrando…" : "Confirmar autorização"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Versão do documento: {doc.documentVersion} · Data da assinatura será registrada automaticamente
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
