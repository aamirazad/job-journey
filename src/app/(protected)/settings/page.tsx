import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/server/auth";
import { changeRole } from "@/actions/mutate";
import { redirect } from "next/navigation";

export default async function UserAvatar() {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  const user = session.user;

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
        <Button
          formAction={async () => {
            "use server";
            await changeRole({ userId: user.id, role: "ADMIN" });
          }}
        >
          Switch to admin
        </Button>
        <Button
          formAction={async () => {
            "use server";
            await changeRole({ userId: user.id, role: "STUDENT" });
          }}
        >
          Switch to student
        </Button>
        <Button
          formAction={async () => {
            "use server";
            await changeRole({ userId: user.id, role: "EMPLOYER" });
          }}
        >
          Switch to employer
        </Button>
      </form>
    </div>
  );
}
