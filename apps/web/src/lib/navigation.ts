import type { AppShellBootstrap } from "@terapia/contracts";

export const primaryNavigation = [
  { key: "onboarding", label: "Ativação", href: "/app/onboarding" },
  { key: "dashboard", label: "Dashboard", href: "/app/dashboard" },
  { key: "patients", label: "Pacientes", href: "/app/patients" },
  { key: "agenda", label: "Agenda", href: "/app/agenda" },
  { key: "clinicalReview", label: "Revisão Clínica", href: "/app/clinical-review" },
  { key: "finance", label: "Financeiro", href: "/app/finance" },
  { key: "documents", label: "Documentos", href: "/app/documents" },
  { key: "settings", label: "Configurações", href: "/app/settings/profile" }
] as const;

export function getBadgeForItem(
  bootstrap: AppShellBootstrap,
  key: Exclude<(typeof primaryNavigation)[number]["key"], "onboarding">
) {
  return bootstrap.navigationBadges[key] ?? 0;
}

export function getBreadcrumbs(pathname: string) {
  if (pathname.startsWith("/app/onboarding")) {
    return ["Ativação da conta"];
  }

  if (pathname.startsWith("/app/dashboard")) {
    return ["Dashboard"];
  }

  if (pathname.startsWith("/app/patients/") && pathname.endsWith("/clinical-record")) {
    return ["Pacientes", "Paciente", "Prontuário"];
  }

  if (pathname.startsWith("/app/patients/")) {
    return ["Pacientes", "Paciente"];
  }

  if (pathname.startsWith("/app/patients")) {
    return ["Pacientes"];
  }

  if (pathname.startsWith("/app/appointments/")) {
    return ["Agenda", "Sessão"];
  }

  if (pathname.startsWith("/app/agenda")) {
    return ["Agenda"];
  }

  if (pathname.startsWith("/app/clinical-review")) {
    return ["Revisão Clínica"];
  }

  if (pathname.startsWith("/app/finance")) {
    return ["Financeiro"];
  }

  if (pathname.startsWith("/app/documents")) {
    return ["Documentos"];
  }

  if (pathname.startsWith("/app/settings")) {
    if (pathname.startsWith("/app/settings/practice")) return ["Configurações", "Conta e consultório"];
    if (pathname.startsWith("/app/settings/security")) return ["Configurações", "Segurança"];
    if (pathname.startsWith("/app/settings/policies")) return ["Configurações", "Políticas"];
    if (pathname.startsWith("/app/settings/notifications")) return ["Configurações", "Notificações"];
    return ["Configurações", "Perfil"];
  }

  return ["Workspace"];
}
