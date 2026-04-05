import { SettingsPageView } from "@/components/settings/settings-page";
import { getSettingsBootstrap } from "@/lib/settings/get-settings-bootstrap";

export default async function SettingsSecurityPage() {
  const data = await getSettingsBootstrap();
  return <SettingsPageView activeSection="security" initialData={data} />;
}
