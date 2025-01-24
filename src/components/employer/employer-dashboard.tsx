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
  reviewJobPosting,
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
import { DashboardWrapper } from "../dashboard-wrapper";

const queryClient = new QueryClient();

function JobPosts({
  session,
  selectedPost,
  setSelectedPost,
  setExpandedPost,
}: {
  session: Session;
  selectedPost: number;
  setSelectedPost: (postId: number) => void;
  setExpandedPost: (postId: number | null) => void;
}) {
  const queryClient = useQueryClient();
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      return await getMyJobPosts(session.user.id);
    },
  });

  const handleDeletePost = async (id: number) => {
    toast.promise(
      async () => {
        await reviewJobPosting(id, "DELETED");
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
      {
        loading: "Loading...",
        error: "Failed to delete job posting",
        success: "Successfully deleted job posting",
      },
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!posts || posts.length === 0) {
    return <BodyMessage>No job postings found</BodyMessage>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Date Posted</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow
            key={post.postId}
            className={selectedPost === post.postId ? "bg-gray-100" : ""}
          >
            <TableCell className="min-w-64 max-w-0">
              <div className="truncate" title={post.title}>
                {post.title}
              </div>
            </TableCell>
            <TableCell>{post.dateCreated.toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge
                variant={
                  post.status === "ACCEPTED"
                    ? "default"
                    : post.status === "DELETED"
                      ? "destructive"
                      : "outline"
                }
              >
                {post.status}
              </Badge>
            </TableCell>
            <TableCell className="flex gap-2">
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
                    <Eye className="h-4 w-4" />
                    <span>View Post Details</span>
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
                        <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0">
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
                            onClick={() => handleDeletePost(post.postId)}
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
                    <span>View Application Details</span>
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

export default function EmployerDashboard({ session }: { session: Session }) {
  const [selectedPost, setSelectedPost] = useState(0);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [expandedApplication, setExpandedApplication] = useState<number | null>(
    null,
  );
  const closeDialog = () => {
    setExpandedPost(null);
    setExpandedApplication(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {/* Added more responsive padding and max-width */}
      <DashboardWrapper>
        {/* Responsive header layout */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Employer Dashboard</h1>
          <Button
            asChild
            className="w-full sm:w-auto" // Full width on mobile, auto on larger screens
          >
            <Link
              href="/post"
              className="flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" /> Post New Job
            </Link>
          </Button>
        </div>

        {/* Responsive grid with gap and padding */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">
                Your Job Postings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <JobPosts
                session={session}
                selectedPost={selectedPost}
                setSelectedPost={setSelectedPost}
                setExpandedPost={setExpandedPost}
              />
            </CardContent>
          </Card>

          {selectedPost ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">
                  Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ApplicationList
                  selectedPost={selectedPost}
                  setExpandedApplication={setExpandedApplication}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">
                  Applications
                </CardTitle>
              </CardHeader>
              <BodyMessage>
                Select a job posting to view applications
              </BodyMessage>
            </Card>
          )}
        </div>

        {/* Modals remain the same */}
        <DetailedPostPopup
          closeDialog={closeDialog}
          expandedPost={expandedPost}
        />
        <DetailedApplicationPopup
          closeDialog={closeDialog}
          expandedApplication={expandedApplication}
        />
      </DashboardWrapper>
    </QueryClientProvider>
  );
}
