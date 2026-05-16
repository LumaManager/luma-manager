import type { Metadata } from "next";
import { BookingPage } from "./booking-page";

export const metadata: Metadata = {
  title: "Agendar sessão | Luma Manager",
  robots: "noindex"
};

export default async function AgendarPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <BookingPage token={token} />;
}
