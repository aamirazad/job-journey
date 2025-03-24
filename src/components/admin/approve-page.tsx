"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { getUnreviewedJobPosts, reviewJobPosting } from "@/actions/actions";
import LoadingSpinner from "@/components/loading-spinner";
import BodyMessage from "../body-message";
import { Expand } from "lucide-react";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DetailedPostPopup from "../jobs/detailed-post-popup";

const queryClient = new QueryClient();

function Block({
  setExpandedPost,
}: {
  setExpandedPost: (postId: number | null) => void;
}) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getUnreviewedJobPosts,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (posts instanceof Error) {
    return <BodyMessage>{posts.message}</BodyMessage>;
  }

  if (posts?.length === 0 || !posts) {
    return <BodyMessage>No posts to review</BodyMessage>;
  }

  const handleJobAction = (
    id: number,
    action: "UNREVIEWED" | "ACCEPTED" | "DELETED",
  ) => {
    startTransition(async () => {
      const res = await reviewJobPosting(id, action);
      if (res.success) {
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success(`Successfully ${action.toLowerCase()} job posting`, {
          action: {
            label: "Undo",
            onClick: () => handleJobAction(id, "UNREVIEWED"),
          },
        });
      } else if (res.error) {
        toast.error(res.error);
      } else {
        toast.error("Failed to review job posting");
      }
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-2/5 sm:w-auto">Title</TableHead>
            <TableHead className="w-2/5 sm:w-auto">Company</TableHead>
            <TableHead className="hidden sm:table-cell">Expand</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((job) => (
            <TableRow key={job.postId} className="text-sm sm:text-base">
              <TableCell className="max-w-0 min-w-64">
                <div className="truncate" title={job.title}>
                  {job.title}
                </div>
              </TableCell>
              <TableCell className="max-w-[100px] sm:max-w-[150px]">
                <div
                  className="truncate overflow-hidden text-ellipsis"
                  title={job.company}
                >
                  {job.company}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setExpandedPost(job.postId);
                  }}
                >
                  <Expand className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => handleJobAction(job.postId, "ACCEPTED")}
                    disabled={isPending}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full sm:w-auto"
                    disabled={isPending}
                    onClick={() => handleJobAction(job.postId, "DELETED")}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function PendingJobPostingsBlock() {
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const closeDialog = () => setExpandedPost(null);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">
              Pending Job Postings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <Block setExpandedPost={setExpandedPost} />
          </CardContent>
        </Card>
      </QueryClientProvider>
      {expandedPost && (
        <DetailedPostPopup
          closeDialog={closeDialog}
          expandedPost={expandedPost}
        />
      )}
    </>
  );
}
