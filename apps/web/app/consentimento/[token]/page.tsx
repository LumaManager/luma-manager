import type { Metadata } from "next";
import { ConsentPage } from "./consent-page";

export const metadata: Metadata = {
  title: "Autorização de gravação | Luma Manager",
  robots: "noindex"
};

export default async function ConsentimentoPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ConsentPage token={token} />;
}
