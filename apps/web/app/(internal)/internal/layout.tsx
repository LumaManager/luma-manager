import { InternalShell } from "@/components/internal/internal-shell";
import { getInternalBootstrap } from "@/lib/internal/get-internal-bootstrap";

export default async function InternalLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bootstrap = await getInternalBootstrap();

  return <InternalShell bootstrap={bootstrap}>{children}</InternalShell>;
}
