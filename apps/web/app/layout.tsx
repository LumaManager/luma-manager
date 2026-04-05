import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Terapia | Core Web",
  description: "Workspace web-first para operacao clinica e administrativa do terapeuta."
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
