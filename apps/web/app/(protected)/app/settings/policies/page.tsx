import { SettingsPageView } from "@/components/settings/settings-page";
import { getSettingsBootstrap } from "@/lib/settings/get-settings-bootstrap";

export default async function SettingsPoliciesPage() {
  const data = await getSettingsBootstrap();
  return <SettingsPageView activeSection="policies" initialData={data} />;
}
