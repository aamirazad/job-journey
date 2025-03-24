import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DetailedJobPost } from "../jobs/detailed-post";
import { getJobPost } from "@/actions/actions";
import BodyMessage from "@/components/body-message";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

function App({ expandedPost }: { expandedPost: number }) {
  const {
    data: JobPost,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["jobPost", expandedPost],
    queryFn: () => getJobPost(expandedPost),
  });

  if (isLoading) {
    return <BodyMessage>Loading...</BodyMessage>;
  }

  if (isError) {
    return <BodyMessage>Error loading post</BodyMessage>;
  }

  if (!JobPost) {
    return <BodyMessage>Post not found</BodyMessage>;
  }

  return <DetailedJobPost post={JobPost} />;
}

export default function DetailedPostPopup({
  expandedPost,
  closeDialog,
}: {
  expandedPost: number;
  closeDialog: () => void;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <Dialog open={expandedPost !== null} onOpenChange={closeDialog}>
        <DialogContent className="max-h-[80vh] w-[600px] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Job Posting Details</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto pr-4">
            <App expandedPost={expandedPost} />
          </div>
        </DialogContent>
      </Dialog>
    </QueryClientProvider>
  );
}
