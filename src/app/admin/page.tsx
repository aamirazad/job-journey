import AdminDashboard from "@/components/admin/dashboard";
import BodyMessage from "@/components/body-message";
import { auth } from "@/server/auth";

export default async function AdminPage() {
  const session = await auth();
  if (!session)
    return (
      <BodyMessage>You must be logged in to access this page.</BodyMessage>
    );

  return <AdminDashboard />;
}
