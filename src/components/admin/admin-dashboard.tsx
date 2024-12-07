import { PendingJobPostingsBlock } from "@/components/admin/approve-page";
import { UserPromotionBlock } from "@/components/admin/user-promotion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Promote User</CardTitle>
          </CardHeader>
          <CardContent>
            <UserPromotionBlock />
          </CardContent>
        </Card>
        <PendingJobPostingsBlock />
      </div>
    </div>
  );
}
