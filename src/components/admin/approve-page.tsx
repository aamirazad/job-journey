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
import Link from "next/link";
import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";

const queryClient = new QueryClient();

function Block() {
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

  const handleJobAction = (id: number, action: "accept" | "reject") => {
    startTransition(async () => {
      const res = await reviewJobPosting(id, action);
      if (res.success) {
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success(`Succesfully ${action}ed job posting`);
      } else if (res.error) {
        toast.error(res.error);
      } else {
        toast.error("Failed to review job posting");
      }
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Link</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((job) => (
          <TableRow key={job.postId}>
            <TableCell>{job.title}</TableCell>
            <TableCell>{job.company}</TableCell>
            <TableCell>
              <Link href={`/job/${job.postId}`}>
                <Link2 className="inline-block h-4 w-4" />
              </Link>
            </TableCell>
            <TableCell>
              <div className="space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleJobAction(job.postId, "accept")}
                  disabled={isPending}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isPending}
                  onClick={() => handleJobAction(job.postId, "reject")}
                >
                  Reject
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function PendingJobPostingsBlock() {
  return (
    <QueryClientProvider client={queryClient}>
      <Block />
    </QueryClientProvider>
  );
}
