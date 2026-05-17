import type { Metadata } from "next";
import {
  Ban,
  CalendarClock,
  CircleDollarSign,
  FileCheck2,
  ReceiptText,
  Wallet,
} from "lucide-react";

import { SeoIntentPage } from "@/components/marketing/seo-intent-page";

export const metadata: Metadata = {
  title: "Controle financeiro para psicólogos | Luma Manager",
  description:
    "Controle financeiro para psicólogos acompanharem sessões, pagamentos, faltas, cancelamentos e pendências do consultório.",
  alternates: {
    canonical: "/controle-financeiro-para-psicologos",
  },
};

const pageType = "finance_page";

export default function Page() {
  return (
    <SeoIntentPage
      pageType={pageType}
      title="Controle financeiro para psicólogos acompanharem pagamentos sem perder contexto clínico."
      description="O Luma Manager ajuda a enxergar sessões realizadas, pagamentos pendentes, faltas e cancelamentos sem transformar o financeiro em uma planilha paralela."
      badges={["Controle financeiro", "Pagamentos, faltas e cancelamentos"]}
      bullets={[
        "Acompanhe o status financeiro por paciente e por sessão.",
        "Dê mais clareza para combinados de falta, cancelamento e pagamento.",
        "Reduza cobrança improvisada depois que a sessão já ficou para trás.",
      ]}
      previewTitle="Financeiro operacional"
      previewItems={[
        {
          icon: Wallet,
          title: "Pagamentos pendentes",
          description:
            "Veja o que precisa de acompanhamento sem procurar em extratos e mensagens.",
        },
        {
          icon: CalendarClock,
          title: "Faltas e remarcações",
          description:
            "Registre eventos importantes para entender o impacto na rotina do consultório.",
        },
        {
          icon: ReceiptText,
          title: "Histórico por sessão",
          description:
            "Relacione cobrança e atendimento sem separar a operação em planilhas soltas.",
        },
      ]}
      benefits={[
        {
          icon: CircleDollarSign,
          title: "Clareza de recebimento",
          description:
            "Tenha uma visão mais objetiva do que foi pago e do que ainda precisa ser resolvido.",
        },
        {
          icon: Ban,
          title: "Política menos ambígua",
          description:
            "Use combinados claros para faltas, atrasos e cancelamentos antes de virar conflito.",
        },
        {
          icon: FileCheck2,
          title: "Menos cobrança informal",
          description:
            "A rotina financeira fica conectada ao atendimento, sem depender só de memória.",
        },
      ]}
      workflowEyebrow="Rotina financeira"
      workflowTitle="O financeiro precisa acompanhar a sessão, não correr atrás dela"
      workflowDescription="A maior perda acontece quando pagamento, falta e cancelamento ficam fora do fluxo clínico."
      workflowSteps={[
        {
          title: "Defina combinados",
          description:
            "Mantenha política de pagamento e cancelamento clara desde o início.",
        },
        {
          title: "Registre a sessão",
          description:
            "Associe atendimento, status financeiro e evento relevante no mesmo fluxo.",
        },
        {
          title: "Acompanhe pendências",
          description:
            "Priorize cobranças e ajustes sem depender de busca manual.",
        },
      ]}
      fitTitle="Para consultórios onde o financeiro já virou atrito"
      fitDescription="O valor aparece quando a agenda cresce e a cobrança deixa de caber na memória."
      fitItems={[
        "Psicólogos que cobram por sessão e precisam rastrear pagamento individual.",
        "Profissionais que lidam com faltas, cancelamentos e remarcações recorrentes.",
        "Consultórios que querem evitar cobrança improvisada por mensagem.",
      ]}
      primaryCtaLocation="controle_financeiro_hero_primary"
      secondaryCtaLocation="controle_financeiro_hero_secondary"
    />
  );
}
