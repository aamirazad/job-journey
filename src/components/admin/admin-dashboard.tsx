import { PendingJobPostingsBlock } from "@/components/admin/approve-page";
import { UserPromotionBlock } from "@/components/admin/user-promotion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardWrapper } from "../dashboard-wrapper";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Dashboard() {
  return (
    <DashboardWrapper>
      <h1 className="mb-6 text-center text-2xl font-bold md:text-left md:text-3xl">
        Admin Dashboard
      </h1>
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[500px] gap-4"
      >
        <ResizablePanel defaultSize={50}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">
                Promote User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserPromotionBlock />
            </CardContent>
          </Card>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <Card className="h-full bg-none">
            <PendingJobPostingsBlock />
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </DashboardWrapper>
  );
}
