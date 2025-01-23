import { PendingJobPostingsBlock } from "@/components/admin/approve-page";
import { UserPromotionBlock } from "@/components/admin/user-promotion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardWrapper } from "../dashboard-wrapper";

export default function Dashboard() {
  return (
    <DashboardWrapper>
      <h1 className="mb-6 text-center text-2xl font-bold md:text-left md:text-3xl">
        Admin Dashboard
      </h1>
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Promote User</CardTitle>
          </CardHeader>
          <CardContent>
            <UserPromotionBlock />
          </CardContent>
        </Card>
        <PendingJobPostingsBlock />
      </div>
    </DashboardWrapper>
  );
}
