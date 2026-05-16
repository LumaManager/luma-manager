import type { Metadata } from "next";
import { BookingPage } from "./booking-page";

export const metadata: Metadata = {
  title: "Agendar sessão | Luma Manager",
  robots: "noindex"
};

export default function AgendarPage({ params }: { params: { token: string } }) {
  return <BookingPage token={params.token} />;
}
