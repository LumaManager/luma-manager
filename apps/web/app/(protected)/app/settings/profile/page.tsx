import { SettingsPageView } from "@/components/settings/settings-page";
import { getSettingsBootstrap } from "@/lib/settings/get-settings-bootstrap";

export default async function SettingsProfilePage() {
  const data = await getSettingsBootstrap();
  return <SettingsPageView activeSection="profile" initialData={data} />;
}
