import Settings from "@/components/auth/settings";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function UserSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return <Settings session={session} />;
}
