import SettingCard from "@/components/dashboard/settings/settingCard";

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Setting() {
  const session = await auth();
  if (!session) redirect("/");

  return <SettingCard session={session} />;
}
