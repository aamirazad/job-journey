import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DetailedJobPost from "../jobs/detailed-post";

export default function DetailedPostPopup({
  expandedPost,
  closeDialog,
}: {
  expandedPost: number | null;
  closeDialog: () => void;
}) {
  return (
    <Dialog open={expandedPost !== null} onOpenChange={closeDialog}>
      <DialogContent className="max-h-[80vh] w-[600px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Job Posting Details</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto pr-4">
          {expandedPost && <DetailedJobPost postId={expandedPost} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
