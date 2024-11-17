import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function UserAvatar() {
  const session = await auth();

  if (!session) {
    return redirect("/auth/login");
  }

  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button>Sign out</Button>
      </form>
    </div>
  );
}
