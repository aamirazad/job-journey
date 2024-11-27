import FormWrapper from "@/components/auth/form-wrapper";
import Settings from "@/components/auth/settings";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function UserSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <FormWrapper header="Settings" description="Update your account settings">
      <Settings session={session} />
    </FormWrapper>
  );
}
