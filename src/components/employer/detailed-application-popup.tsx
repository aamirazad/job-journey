import { getApplication } from "@/actions/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import LoadingSpinner from "../loading-spinner";
import BodyMessage from "../body-message";
import { Badge } from "../ui/badge";

const queryClient = new QueryClient();

function DetailedApplicationPopup({
  expandedApplication,
}: {
  expandedApplication: number | null;
}) {
  const { data: application, isLoading } = useQuery({
    queryKey: ["application", expandedApplication],
    queryFn: async () => {
      return await getApplication(expandedApplication);
    },
  });

  if (isLoading)
    return (
      <>
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        <LoadingSpinner />
      </>
    );

  if (!application)
    return (
      <>
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        <BodyMessage>Post not found</BodyMessage>
      </>
    );

  return (
    <>
      <DialogHeader>
        <DialogTitle>Application Details</DialogTitle>
        <DialogDescription>
          Submitted by {application.firstName} {application.lastName}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <span className="font-medium">Email:</span>
          <span className="col-span-3">{application.email}</span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <span className="font-medium">Phone:</span>
          <span className="col-span-3">{application.phoneNumber}</span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <span className="font-medium">Date Applied:</span>
          <span className="col-span-3">
            {application.dateApplied.toLocaleString()}
          </span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <span className="font-medium">Status:</span>
          <span className="col-span-3">
            <Badge
              variant={
                application.status === "ACCEPTED"
                  ? "default"
                  : application.status === "REJECTED"
                    ? "destructive"
                    : "default"
              }
            >
              {application.status}
            </Badge>
          </span>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <span className="font-medium">Last Updated:</span>
          <span className="col-span-3">
            {application.dateUpdated.toLocaleString()}
          </span>
        </div>
        {application.isWithdrawn && (
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Withdrawn:</span>
            <span className="col-span-3">Yes</span>
          </div>
        )}
      </div>
    </>
  );
}

export default function Wrapper({
  expandedApplication,
  closeDialog,
}: {
  expandedApplication: number | null;
  closeDialog: () => void;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <Dialog open={!!expandedApplication} onOpenChange={closeDialog}>
        <DialogContent>
          <DetailedApplicationPopup expandedApplication={expandedApplication} />
        </DialogContent>
      </Dialog>
    </QueryClientProvider>
  );
}
