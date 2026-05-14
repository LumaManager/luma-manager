import type { TherapistOnboardingBootstrap } from "@terapia/contracts";
import { redirect } from "next/navigation";

import { OnboardingPage } from "@/components/onboarding/onboarding-page";
import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export default async function TherapistOnboardingRoute() {
  const sessionToken = await getRequiredSessionToken();
  const onboarding = await apiFetch<TherapistOnboardingBootstrap>("/v1/account/onboarding", {
    token: sessionToken
  });

  if (onboarding.accountStatus === "ready_for_operations") {
    redirect("/app/dashboard");
  }

  return <OnboardingPage initialData={onboarding} />;
}
