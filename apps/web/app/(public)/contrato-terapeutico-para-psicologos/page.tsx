import type { Metadata } from "next";
import {
  ClipboardCheck,
  FileSignature,
  FileText,
  Handshake,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { SeoIntentPage } from "@/components/marketing/seo-intent-page";

export const metadata: Metadata = {
  title: "Contrato terapêutico para psicólogos | Luma Manager",
  description:
    "Contrato terapêutico para psicólogos organizarem combinados, consentimentos, política de faltas e documentos do atendimento.",
  alternates: {
    canonical: "/contrato-terapeutico-para-psicologos",
  },
};

const pageType = "contract_page";

export default function Page() {
  return (
    <SeoIntentPage
      pageType={pageType}
      title="Contrato terapêutico para psicólogos deixarem combinados claros desde o início."
      description="O Luma Manager organiza documentos, consentimentos e políticas do atendimento para reduzir improviso em faltas, cancelamentos, pagamentos e comunicação com pacientes."
      badges={["Contrato terapêutico", "Consentimentos e combinados"]}
      bullets={[
        "Organize termos, consentimentos e orientações em um fluxo mais consistente.",
        "Deixe políticas de falta, cancelamento e pagamento mais claras para o paciente.",
        "Reduza insegurança documental sem transformar a clínica em burocracia.",
      ]}
      previewTitle="Documentos do atendimento"
      previewItems={[
        {
          icon: FileSignature,
          title: "Contrato terapêutico",
          description:
            "Combinados importantes ficam mais fáceis de apresentar, manter e localizar.",
        },
        {
          icon: ShieldCheck,
          title: "Consentimento informado",
          description:
            "O paciente entende melhor o fluxo, os limites e as responsabilidades do atendimento.",
        },
        {
          icon: ClipboardCheck,
          title: "Políticas da clínica",
          description:
            "Faltas, cancelamentos e pagamentos deixam de depender de conversa solta.",
        },
      ]}
      benefits={[
        {
          icon: Handshake,
          title: "Relação mais clara",
          description:
            "O contrato ajuda a alinhar expectativas antes que problemas operacionais apareçam.",
        },
        {
          icon: FileText,
          title: "Documentos centralizados",
          description:
            "Termos, orientações e versões ficam menos espalhados entre arquivos e mensagens.",
        },
        {
          icon: UserCheck,
          title: "Experiência mais profissional",
          description:
            "O paciente percebe um processo consistente desde o primeiro contato.",
        },
      ]}
      workflowEyebrow="Combinados clínicos"
      workflowTitle="Documento bom reduz atrito sem pesar na relação"
      workflowDescription="O objetivo é dar clareza para a operação e preservar uma experiência de atendimento simples."
      workflowSteps={[
        {
          title: "Padronize o essencial",
          description:
            "Defina termos, consentimentos e políticas que aparecem em quase todo atendimento.",
        },
        {
          title: "Apresente no início",
          description:
            "Use os documentos como parte natural da entrada do paciente no cuidado.",
        },
        {
          title: "Mantenha rastreável",
          description:
            "Atualize versões e consulte combinados sem caçar arquivos.",
        },
      ]}
      fitTitle="Para quem quer menos insegurança documental"
      fitDescription="A página responde à dor de profissionais que sabem que precisam de combinados, mas não querem operar no improviso."
      fitItems={[
        "Psicólogos que atendem online ou presencial e precisam formalizar combinados.",
        "Profissionais que querem mais clareza sobre falta, cancelamento e pagamento.",
        "Consultórios que precisam organizar documentos sem aumentar o trabalho manual.",
      ]}
      primaryCtaLocation="contrato_terapeutico_hero_primary"
      secondaryCtaLocation="contrato_terapeutico_hero_secondary"
    />
  );
}
