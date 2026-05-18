import type { Metadata } from "next";
import type { MetadataRoute } from "next";

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lumamanager.com.br";

export const siteUrl = configuredSiteUrl.replace(
  "https://lumamanager.com.br",
  "https://www.lumamanager.com.br"
);

export const indexableRoutes = [
  {
    path: "/",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    path: "/software-para-psicologos",
    changeFrequency: "weekly",
    priority: 0.95,
  },
  {
    path: "/sistema-para-psicologos",
    changeFrequency: "weekly",
    priority: 0.95,
  },
  {
    path: "/solicitar-demo",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/seguranca-e-privacidade",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/prontuario-eletronico-para-psicologos",
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    path: "/agenda-para-psicologos",
    changeFrequency: "weekly",
    priority: 0.85,
  },
  {
    path: "/teleatendimento-para-psicologos",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/documentos-e-consentimentos-para-psicologos",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/controle-financeiro-para-psicologos",
    changeFrequency: "weekly",
    priority: 0.82,
  },
  {
    path: "/contrato-terapeutico-para-psicologos",
    changeFrequency: "weekly",
    priority: 0.82,
  },
  {
    path: "/blog",
    changeFrequency: "weekly",
    priority: 0.75,
  },
  {
    path: "/blog/como-escolher-software-para-psicologo",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/blog/como-organizar-agenda-e-prontuario",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/blog/lgpd-para-psicologos-consultorio",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/comparar",
    changeFrequency: "weekly",
    priority: 0.78,
  },
  {
    path: "/comparar/planilha-e-whatsapp-vs-software",
    changeFrequency: "weekly",
    priority: 0.75,
  },
  {
    path: "/comparar/agenda-em-planilha-vs-software",
    changeFrequency: "weekly",
    priority: 0.74,
  },
  {
    path: "/comparar/prontuario-no-word-vs-software",
    changeFrequency: "weekly",
    priority: 0.74,
  },
  {
    path: "/pricing",
    changeFrequency: "monthly",
    priority: 0.8,
  },
] as const satisfies ReadonlyArray<{
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  path: string;
  priority: number;
}>;

export const privateRoutePrefixes = [
  "/app/",
  "/portal/",
  "/internal/",
] as const;

export const noindexMetadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
};

export function buildAbsoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}
