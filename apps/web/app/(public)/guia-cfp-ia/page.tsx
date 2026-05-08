import type { Metadata } from "next";

import { EbookLandingPage } from "@/components/marketing/ebook-landing-page";

export const metadata: Metadata = {
  title: "Guia Gratuito — A Resolução do CFP que Todo Psicólogo Ignora | Luma Manager",
  description:
    "Desde agosto de 2024, o CFP regulamentou o uso de IA na prática psicológica. Baixe o guia gratuito e saiba o que mudou.",
  alternates: {
    canonical: "/guia-cfp-ia"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function GuiaCfpIaPage() {
  return <EbookLandingPage />;
}
