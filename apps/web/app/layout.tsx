import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Luma Manager",
  description: "A plataforma para psicólogos que querem fechar o dia sem carregar o peso do pós-sessão."
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
