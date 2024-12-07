import AdminDashboard from "@/components/admin/admin-dashboard";
import BodyMessage from "@/components/body-message";
import EmployerDashboard from "@/components/employer/employer-dashboard";
import { auth } from "@/server/auth";

export default async function AdminPage() {
  const session = await auth();
  if (!session)
    return (
      <BodyMessage>You must be logged in to access this page.</BodyMessage>
    );
  if (session.user.role == "ADMIN") {
    return <AdminDashboard />;
  } else if (session.user.role == "EMPLOYER")
    return <EmployerDashboard session={session} />;
  else {
    return <BodyMessage>Unauthorized</BodyMessage>;
  }
}
