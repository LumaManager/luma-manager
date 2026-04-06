import type { AuthSession } from "@terapia/contracts";

export function isInternalOperatorSession(session: Pick<AuthSession, "therapist">) {
  return session.therapist.crp === "INTERNAL" || session.therapist.email.endsWith("@terapia.internal");
}

export function getAuthenticatedHomePath(
  session: Pick<AuthSession, "accountStatus" | "therapist">,
  requestedPath?: string
) {
  if (isInternalOperatorSession(session)) {
    return requestedPath?.startsWith("/internal") ? requestedPath : "/internal";
  }

  if (session.accountStatus !== "ready_for_operations") {
    return "/app/onboarding";
  }

  return requestedPath?.startsWith("/app") ? requestedPath : "/app/dashboard";
}
