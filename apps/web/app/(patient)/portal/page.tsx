import { redirect } from "next/navigation";

export default async function PortalHomePage() {
  redirect("/portal/appointments");
}
