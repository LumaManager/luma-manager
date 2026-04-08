import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lumamanager.com.br"),
  title: "Luma Manager",
  description: "A plataforma para psicólogos que querem fechar o dia sem carregar o peso do pós-sessão.",
  verification: {
    google: "wZuG87PnonO6y_Emh8KjDVAIp9EYIoxS5LkVyRXUyyQ"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
