import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";
import { MarketingPageViewTracker } from "@/components/analytics/marketing-page-view-tracker";
import { getGtagInitScript, getGtagScriptUrl, isGa4Enabled } from "@/lib/analytics/gtag";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lumamanager.com.br"),
  title: "Luma Manager",
  description: "A plataforma para psicólogos que querem fechar o dia sem carregar o peso do pós-sessão.",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "wZuG87PnonO6y_Emh8KjDVAIp9EYIoxS5LkVyRXUyyQ"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Luma Manager",
  url: "https://www.lumamanager.com.br",
  logo: "https://www.lumamanager.com.br/icon.svg",
  description: "A plataforma para psicólogos que querem fechar o dia sem carregar o peso do pós-sessão.",
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Luma Manager",
  url: "https://www.lumamanager.com.br",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.lumamanager.com.br/blog?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtagScriptUrl = getGtagScriptUrl();

  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        {children}
        <MarketingPageViewTracker />
        {isGa4Enabled() ? (
          <>
            <Script src={gtagScriptUrl ?? undefined} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {getGtagInitScript()}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
