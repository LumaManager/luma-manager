import type { TherapistOnboardingBootstrap } from "@terapia/contracts";

import { OnboardingPage } from "@/components/onboarding/onboarding-page";
import { apiFetch } from "@/lib/api/client";
import { getRequiredSessionToken } from "@/lib/auth/session";

export default async function TherapistOnboardingRoute() {
  const sessionToken = await getRequiredSessionToken();
  const onboarding = await apiFetch<TherapistOnboardingBootstrap>("/v1/account/onboarding", {
    token: sessionToken
  });

  return <OnboardingPage initialData={onboarding} />;
}
