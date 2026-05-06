import type { TherapistOnboardingBootstrap } from "@terapia/contracts";

import { OnboardingWizard } from "./onboarding-wizard";

type OnboardingPageProps = {
  initialData: TherapistOnboardingBootstrap;
};

export function OnboardingPage({ initialData }: OnboardingPageProps) {
  return <OnboardingWizard initialData={initialData} />;
}
