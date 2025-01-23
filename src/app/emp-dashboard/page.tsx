import EmployerDashboard from "@/components/employer/employer-dashboard";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AdminEmployerDashboard() {
  const session = await auth();
  if (session?.user.role != "ADMIN") {
    redirect("/dashboard");
  }
  return <EmployerDashboard session={session} />;
}
