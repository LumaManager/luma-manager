import type { Metadata } from "next";
import {
  CalendarDays,
  ClipboardCheck,
  FileText,
  MessageSquareText,
  Users,
  Wallet,
} from "lucide-react";

import { SeoIntentPage } from "@/components/marketing/seo-intent-page";

export const metadata: Metadata = {
  title: "Sistema para psicólogos | Luma Manager",
  description:
    "Sistema para psicólogos com agenda, prontuário psicológico, documentos, pagamentos e rotina clínica organizada em um só lugar.",
  alternates: {
    canonical: "/sistema-para-psicologos",
  },
};

const pageType = "system_page";

export default function Page() {
  return (
    <SeoIntentPage
      pageType={pageType}
      title="Sistema para psicólogos que organiza a rotina clínica sem espalhar o trabalho."
      description="O Luma Manager centraliza agenda, pacientes, prontuário, documentos e pagamentos para psicólogos autônomos que querem menos retrabalho entre uma sessão e outra."
      badges={["Sistema para psicólogos", "Agenda, prontuário e pagamentos"]}
      bullets={[
        "Veja agenda, pacientes e pendências em um fluxo único.",
        "Registre a continuidade clínica sem depender de arquivos soltos.",
        "Acompanhe cobrança, faltas e combinados com mais clareza operacional.",
      ]}
      previewTitle="Fluxo central"
      previewItems={[
        {
          icon: CalendarDays,
          title: "Agenda com contexto",
          description:
            "Horários, mudanças e próximos passos aparecem juntos para reduzir conferência manual.",
        },
        {
          icon: FileText,
          title: "Prontuário psicológico",
          description:
            "Notas e histórico ficam organizados para retomada rápida do caso.",
        },
        {
          icon: Wallet,
          title: "Pagamentos e pendências",
          description:
            "Cobranças, faltas e status financeiro deixam de ficar escondidos em conversas.",
        },
      ]}
      benefits={[
        {
          icon: Users,
          title: "Paciente em foco",
          description:
            "Centralize dados essenciais, sessões, documentos e pendências por pessoa atendida.",
        },
        {
          icon: MessageSquareText,
          title: "Menos troca de ferramenta",
          description:
            "Reduza a dependência de planilha, WhatsApp, Word e lembretes desconectados.",
        },
        {
          icon: ClipboardCheck,
          title: "Operação mais previsível",
          description:
            "Transforme rotina clínica em processo claro, sem prometer fórmula de agenda cheia.",
        },
      ]}
      workflowEyebrow="Uso na prática"
      workflowTitle="Do agendamento ao fechamento da sessão"
      workflowDescription="O sistema ganha valor quando conecta o que antes ficava em lugares separados."
      workflowSteps={[
        {
          title: "Organize o dia",
          description:
            "Entenda agenda, remarcações e contexto antes de começar os atendimentos.",
        },
        {
          title: "Atenda com continuidade",
          description:
            "Retome histórico e registre o essencial logo depois da sessão.",
        },
        {
          title: "Feche pendências",
          description:
            "Acompanhe pagamentos, documentos e próximos passos sem perder rastreabilidade.",
        },
      ]}
      fitTitle="Boa escolha para quem quer sair do improviso"
      fitDescription="O encaixe é mais forte quando a operação clínica já passa por várias ferramentas."
      fitItems={[
        "Psicólogos autônomos com agenda própria e rotina em crescimento.",
        "Profissionais que usam planilhas, arquivos e conversas para manter controle.",
        "Consultórios que precisam organizar atendimento, documentos e financeiro sem aumentar complexidade.",
      ]}
      primaryCtaLocation="sistema_para_psicologos_hero_primary"
      secondaryCtaLocation="sistema_para_psicologos_hero_secondary"
    />
  );
}
