"use client";

import { startTransition, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Download,
  Edit,
  Ellipsis,
  Expand,
  Eye,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getApplicationsForPost,
  getMyJobPosts,
  reviewApplication,
} from "@/actions/actions";
import BodyMessage from "@/components/body-message";
import { type Session } from "next-auth";
import LoadingSpinner from "@/components/loading-spinner";
import DetailedPostPopup from "@/components/jobs/detailed-post-popup";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { openPdf } from "@/actions/client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import DetailedApplicationPopup from "./detailed-application-popup";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const queryClient = new QueryClient();

function JobPosts({
  session,
  selectedPost,
  setSelectedPost,
  setExpandedPost,
  onDeletePost,
}: {
  session: Session;
  selectedPost: number;
  setSelectedPost: (postId: number) => void;
  setExpandedPost: (postId: number | null) => void;
  onDeletePost: (postId: number) => void;
}) {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      return await getMyJobPosts(session.user.id);
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!posts || posts.length === 0) {
    return <BodyMessage>No job postings found</BodyMessage>;
  }

  return (
    <Table className="">
      <TableHeader>
        <TableRow>
          <TableHead className="">Title</TableHead>
          <TableHead className="">Date Posted</TableHead>
          <TableHead className="">Status</TableHead>
          <TableHead className="">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow
            key={post.postId}
            className={`hover:bg-gray-100 ${
              selectedPost === post.postId ? "font-bold" : ""
            }`}
          >
            <TableCell className="min-w-64 max-w-0">
              <div className="truncate" title={post.title}>
                {post.title}
              </div>
            </TableCell>
            <TableCell>{post.dateCreated.toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge
                variant={post.status === "ACCEPTED" ? "default" : "secondary"}
              >
                {post.status}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Open actions menu"
                  >
                    <Ellipsis className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => setExpandedPost(post.postId)}
                    className="flex items-center gap-2"
                  >
                    <Expand className="h-4 w-4" />
                    <span>Expand Post</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/post/edit/${post.postId}`}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Post</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0">
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="text-red-500">Delete Post</span>
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the job post and all associated applications.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeletePost(post.postId)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedPost(post.postId)}
                    >
                      <Eye />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>See applications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ApplicationList({
  selectedPost,
  setExpandedApplication,
}: {
  selectedPost: number;
  setExpandedApplication: (postId: number) => void;
}) {
  const { data: applications, isLoading } = useQuery({
    queryKey: ["applications", selectedPost],
    queryFn: async () => {
      return getApplicationsForPost(selectedPost);
    },
  });

  const handleStatusUpdate = (
    id: number,
    action: "APPLIED" | "ACCEPTED" | "REJECTED",
  ) => {
    startTransition(async () => {
      const res = await reviewApplication(id, action);
      if (res.success) {
        await queryClient.invalidateQueries({
          queryKey: ["applications", selectedPost],
        });
        toast.success(
          `Succesfully ${action === "APPLIED" ? "reverted action" : `${action.toLowerCase()} application`}`,
          {
            action: {
              label: "Undo",
              onClick: () => handleStatusUpdate(id, "APPLIED"),
            },
          },
        );
      } else if (res.error) {
        toast.error(res.error);
      } else {
        toast.error("Failed to review job posting");
      }
    });
  };

  if (isLoading) return <LoadingSpinner />;

  if (!applications || applications.length === 0) {
    return <div>No applications found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Date Applied</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application.id}>
            <TableCell>{`${application.firstName} ${application.lastName}`}</TableCell>
            <TableCell>{application.email}</TableCell>
            <TableCell>
              {application.dateApplied.toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  application.status === "ACCEPTED"
                    ? "default"
                    : application.status === "REJECTED"
                      ? "destructive"
                      : "secondary"
                }
              >
                {application.status}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Open application actions menu"
                  >
                    <Ellipsis className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => setExpandedApplication(application.id)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Application</span>
                  </DropdownMenuItem>
                  {application.resumeId && (
                    <DropdownMenuItem
                      onClick={() => openPdf(application.resumeId)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Resume</span>
                    </DropdownMenuItem>
                  )}
                  {application.coverLetterId && (
                    <DropdownMenuItem
                      onClick={() => openPdf(application.coverLetterId)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Cover Letter</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {application.status !== "ACCEPTED" && (
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusUpdate(application.id, "ACCEPTED")
                      }
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">Accept Application</span>
                    </DropdownMenuItem>
                  )}
                  {application.status !== "REJECTED" && (
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusUpdate(application.id, "REJECTED")
                      }
                      className="flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-500">Reject Application</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EmployerDashboard({ session }: { session: Session }) {
  const [selectedPost, setSelectedPost] = useState(0);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [expandedApplication, setExpandedApplication] = useState<number | null>(
    null,
  );
  const closeDialog = () => {
    setExpandedPost(null);
    setExpandedApplication(null);
  };
  const queryClient = useQueryClient();

  const handleDeletePost = async (postId: number) => {
    // TODO: Implement delete post functionality
    console.log(`Deleting post ${postId}`);
    // After successful deletion, refetch the posts
    await queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <JobPosts
              session={session}
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
              setExpandedPost={setExpandedPost}
              onDeletePost={handleDeletePost}
            />
          </CardContent>
        </Card>

        {selectedPost ? (
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicationList
                selectedPost={selectedPost}
                setExpandedApplication={setExpandedApplication}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <BodyMessage>Select a job posting to view applications</BodyMessage>
          </Card>
        )}
      </div>
      <DetailedPostPopup
        closeDialog={closeDialog}
        expandedPost={expandedPost}
      />
      <DetailedApplicationPopup
        closeDialog={closeDialog}
        expandedApplication={expandedApplication}
      />
    </>
  );
}

export default function Wrapper({ session }: { session: Session }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Employer Dashboard</h1>
          <Button asChild>
            <Link href="/post">
              <Plus /> Post New Job
            </Link>
          </Button>
        </div>
        <EmployerDashboard session={session} />
      </div>
    </QueryClientProvider>
  );
}
